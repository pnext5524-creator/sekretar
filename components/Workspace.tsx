import React, { useState, useRef } from 'react';
import { FileUploader } from './FileUploader';
import { ResponseEditor } from './ResponseEditor';
import { UploadedFile, AppStatus, UserProfile } from '../types';
import { generateOfficialResponse, transcribeUserAudio, blobToBase64 } from '../services/geminiService';
import { saveToArchive } from '../services/storageService';
import { Briefcase, Loader2, Sparkles, AlertCircle, LogOut, Moon, Sun, User, ChevronDown, Mic, Square, Volume2 } from 'lucide-react';

interface WorkspaceProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigateToDashboard: () => void;
  user: UserProfile;
}

export const Workspace: React.FC<WorkspaceProps> = ({ 
  onLogout, 
  isDarkMode, 
  toggleTheme,
  onNavigateToDashboard,
  user
}) => {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [userInstruction, setUserInstruction] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [generatedResponse, setGeneratedResponse] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const handleGenerate = async () => {
    if (!selectedFile) {
      setErrorMessage("Необходимо загрузить документ (скан или PDF).");
      return;
    }
    if (!userInstruction.trim()) {
      setErrorMessage("Укажите суть ответа.");
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setErrorMessage(null);

    try {
      const response = await generateOfficialResponse(
        selectedFile.base64,
        selectedFile.file.type,
        userInstruction
      );
      setGeneratedResponse(response);
      setStatus(AppStatus.SUCCESS);

      // Save to Archive automatically
      saveToArchive(
        selectedFile.file.name,
        selectedFile.file.type,
        userInstruction,
        response
      );

    } catch (error) {
      console.error(error);
      setErrorMessage("Произошла ошибка при генерации ответа. Пожалуйста, проверьте API ключ и повторите попытку.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUserInstruction('');
    setGeneratedResponse('');
    setStatus(AppStatus.IDLE);
    setErrorMessage(null);
  };

  // Voice Input Logic
  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      setErrorMessage("Нет доступа к микрофону. Проверьте настройки браузера.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const base64Audio = await blobToBase64(blob);
      const text = await transcribeUserAudio(base64Audio, 'audio/webm');
      
      setUserInstruction(prev => {
        const prefix = prev.trim() ? prev.trim() + ' ' : '';
        return prefix + text;
      });
    } catch (error) {
      console.error("Transcription error:", error);
      setErrorMessage("Не удалось распознать речь. Попробуйте еще раз.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Секретарь 2.0</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ассистент Госслужащего</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            
            {status === AppStatus.SUCCESS && (
              <button 
                onClick={handleReset}
                className="hidden md:block text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors mr-2"
              >
                Новый документ
              </button>
            )}
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'}`}>
                  <User size={16} />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none max-w-[120px] truncate">{user.name}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.position}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button 
                         onClick={() => {
                           setShowUserMenu(false);
                           onNavigateToDashboard();
                         }}
                         className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                      >
                        <User size={14} />
                        <span>Личный кабинет</span>
                      </button>
                      <button 
                         onClick={onLogout}
                         className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                      >
                        <LogOut size={14} />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Left Column: Input */}
          <div className="flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border border-slate-200 dark:border-slate-700">1</span>
                Входящие данные
              </h2>
              
              <FileUploader 
                selectedFile={selectedFile} 
                onFileSelect={setSelectedFile} 
              />

              <div className="w-full relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Суть ответа (Резолюция)
                  </label>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                    {isRecording ? "Идет запись..." : isTranscribing ? "Распознавание..." : "Введите текст или скажите голосом"}
                  </span>
                </div>
                
                <div className="relative">
                  <textarea
                    value={userInstruction}
                    onChange={(e) => setUserInstruction(e.target.value)}
                    placeholder="Например: Отказать в связи с отсутствием законных оснований (ст. 12 ФЗ...). Или: Удовлетворить просьбу, сообщить, что работы будут выполнены до 20 числа."
                    className={`w-full h-32 p-3 pr-12 bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all ${
                      isRecording ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                  
                  <button
                    onClick={toggleRecording}
                    disabled={isTranscribing}
                    className={`absolute bottom-3 right-3 p-2 rounded-full shadow-sm transition-all duration-200 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                        : isTranscribing
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                    title={isRecording ? "Остановить запись" : "Надиктовать голосом"}
                  >
                     {isRecording ? <Square size={18} fill="currentColor" /> : isTranscribing ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
                  </button>
                  
                  {/* Recording Wave Visualization Mock */}
                  {isRecording && (
                    <div className="absolute top-3 right-3 flex space-x-1">
                      <span className="block w-1 h-3 bg-red-400 rounded-full animate-bounce delay-75"></span>
                      <span className="block w-1 h-5 bg-red-400 rounded-full animate-bounce delay-150"></span>
                      <span className="block w-1 h-3 bg-red-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex items-start space-x-3 text-red-700 dark:text-red-400">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={status === AppStatus.PROCESSING || !selectedFile || !userInstruction || isRecording || isTranscribing}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-md flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                status === AppStatus.PROCESSING || !selectedFile || !userInstruction || isRecording || isTranscribing
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none text-slate-200 dark:text-slate-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 dark:from-blue-500 dark:to-indigo-600'
              }`}
            >
              {status === AppStatus.PROCESSING ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Готовлю документ...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Сформировать ответ</span>
                </>
              )}
            </button>
            
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center px-4">
              Искусственный интеллект проанализирует документ (фото или PDF) и составит грамотный текст на основе ваших указаний.
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="h-full min-h-[500px]">
            {generatedResponse ? (
              <ResponseEditor responseText={generatedResponse} />
            ) : (
              <div className="h-full bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 transition-colors">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <FileTextPlaceholder />
                </div>
                <p className="font-medium text-lg text-slate-500 dark:text-slate-400 mb-1">Ожидание данных</p>
                <p className="text-sm text-center max-w-xs">
                  Загрузите документ и введите резолюцию, чтобы получить готовый текст ответа здесь.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

const FileTextPlaceholder = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);