import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LegalAnalysisResult } from "../types";

const SYSTEM_PROMPT = `
Вы — опытный государственный служащий с 15-летним стажем работы в органах исполнительной власти. 
Ваша задача — подготовить проект официального ответа на поступившее обращение (жалобу, заявление или запрос), файл которого предоставлен.

Правила составления ответа:
1. Стиль: Строго официально-деловой, бюрократический, но вежливый и корректный.
2. Лексика: Используйте стандартные канцелярские обороты (например, "В ответ на Ваше обращение...", "Рассмотрев Ваше заявление...", "Доводим до Вашего сведения...", "На основании вышеизложенного...").
3. Структура:
   - Уважаемый(ая) [Имя Отчество заявителя, если есть в документе]!
   - Вводная часть: ссылка на поступление обращения.
   - Основная часть: суть ответа, основанная на УКАЗАНИЯХ ПОЛЬЗОВАТЕЛЯ.
   - Заключительная часть: выводы или инструкции (если применимо).
   - "С уважением," (без подписи, оставить место).
4. Содержание: Опирайтесь на суть, которую передал пользователь в поле "Суть ответа". Если в инструкциях пользователя есть отказ — обоснуйте его вежливо. Если согласие — подтвердите четко.
5. Форматирование: Текст должен быть готов к копированию в документ Word. Не используйте Markdown заголовки (#), используйте простое форматирование абзацев.

Вам будет предоставлен файл входящего документа (изображение или PDF) и текстовая инструкция о том, какое решение принято по этому обращению.
`;

const LEGAL_PROMPT = `
Вы — Старший Юрисконсульт правового департамента. Ваша задача — провести правовую экспертизу текста официального ответа гражданину или организации на предмет соответствия законодательству РФ.

Критерии проверки:
1. Федеральный закон № 59-ФЗ "О порядке рассмотрения обращений граждан РФ" (сроки, обоснованность, полнота ответа).
2. Гражданский кодекс РФ и иные профильные нормативные акты.
3. Отсутствие коррупциогенных факторов, угроз, оскорблений или превышения полномочий.
4. Логическая непротиворечивость и деловая этика.

Проанализируйте текст и верните JSON с результатами проверки:
- Уровень риска (SAFE, WARNING, CRITICAL).
- Список конкретных юридических или стилистических ошибок с отсылками к законам.
- Исправленная версия текста, устраняющая все нарушения, но сохраняющая суть.
`;

export const generateOfficialResponse = async (
  fileBase64: string,
  mimeType: string,
  userInstruction: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing via process.env.API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });
    const currentDate = new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Using gemini-3-flash-preview as it is a robust multimodal model supporting Text, Images, and PDF
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nТЕКУЩАЯ ДАТА: ${currentDate}\n\nСУТЬ РЕШЕНИЯ (ИНСТРУКЦИЯ К ОТВЕТУ): ${userInstruction}`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: fileBase64
            }
          }
        ]
      },
      config: {
        temperature: 0.3, // Low temperature for consistent, formal output
      }
    });

    return response.text || "Не удалось сгенерировать ответ. Попробуйте еще раз.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeLegalCompliance = async (text: string): Promise<LegalAnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    const currentDate = new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Schema definition for the legal analysis result
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        hasRisks: { type: Type.BOOLEAN },
        riskLevel: { type: Type.STRING, enum: ['SAFE', 'WARNING', 'CRITICAL'] },
        generalComment: { type: Type.STRING },
        revisedText: { type: Type.STRING },
        issues: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
              citation: { type: Type.STRING },
            },
            required: ['description', 'severity']
          }
        }
      },
      required: ['hasRisks', 'riskLevel', 'issues', 'generalComment', 'revisedText']
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro model for complex legal reasoning
      contents: {
        parts: [
          { text: `${LEGAL_PROMPT}\n\nТЕКУЩАЯ ДАТА: ${currentDate}` },
          { text: `ТЕКСТ ДЛЯ ЭКСПЕРТИЗЫ:\n${text}` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1, // Very low temperature for strict analysis
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");

    return JSON.parse(resultText) as LegalAnalysisResult;

  } catch (error) {
    console.error("Legal Analysis Error:", error);
    throw error;
  }
};

export const transcribeUserAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });

    // Use Gemini Flash for fast audio transcription
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { 
            text: "Ты — профессиональный стенографист. Твоя задача — точно транскрибировать эту аудиозапись (резолюцию начальника) на русском языке в текст. Верни ТОЛЬКО текст того, что было сказано, без кавычек, без вводных слов типа 'Вот транскрипция'. Если запись пустая или неразборчивая, верни пустую строку." 
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          }
        ]
      },
      config: {
        temperature: 0,
      }
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Audio Transcription Error:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};
