import { EdmsType } from "../types";

export const generateEdmsPackage = (type: EdmsType, responseText: string, originalFileName: string): { filename: string, content: string, mimeType: string } => {
  const timestamp = new Date().toISOString();
  
  switch (type) {
    case EdmsType.ONEC:
      // 1C:Document Management usually consumes XML via Universal Data Exchange or EnterpriseData
      return {
        filename: `export_1c_${Date.now()}.xml`,
        mimeType: 'application/xml',
        content: `<?xml version="1.0" encoding="UTF-8"?>
<Communication xmlns="http://www.1c.ru/docflow/integration">
  <Header>
    <Source>Sekretar 2.0</Source>
    <Created>${timestamp}</Created>
    <Type>OutgoingDocument</Type>
  </Header>
  <Document>
    <Title>Ответ на обращение (AI Draft)</Title>
    <Basis>${originalFileName}</Basis>
    <Description>Проект ответа, сгенерированный системой Секретарь 2.0</Description>
    <Body>
<![CDATA[
${responseText}
]]>
    </Body>
    <Status>Draft</Status>
    <Priority>Normal</Priority>
  </Document>
</Communication>`
      };

    case EdmsType.DIRECTUM:
      // Directum RX often uses JSON for REST API integration
      return {
        filename: `export_directum_${Date.now()}.json`,
        mimeType: 'application/json',
        content: JSON.stringify({
          "$type": "Sungero.Docflow.IOutgoingLetter, Sungero.Docflow.Interfaces",
          "Subject": "Ответ на обращение (Проект)",
          "Note": "Сгенерировано в Секретарь 2.0",
          "DocumentDate": timestamp,
          "BasisDocumentName": originalFileName,
          "Body": responseText,
          "LifeCycleState": "Draft",
          "Author": "AI Assistant"
        }, null, 2)
      };

    case EdmsType.DELO:
      // EOS Delo traditionally uses XML schemas for interchange
      // FIX: Changed encoding from WINDOWS-1251 to UTF-8 to match the actual file encoding
      return {
        filename: `export_delo_${Date.now()}.xml`,
        mimeType: 'application/xml',
        content: `<?xml version="1.0" encoding="UTF-8"?>
<Card>
  <MainInfo>
    <CardKind>Проект исходящего</CardKind>
    <RegDate>${new Date().toLocaleDateString('ru-RU')}</RegDate>
    <Summary>Ответ на вх. документ ${originalFileName}</Summary>
  </MainInfo>
  <Files>
    <File>
      <Description>Текст ответа</Description>
      <TextContent><![CDATA[${responseText}]]></TextContent>
    </File>
  </Files>
  <SystemInfo>
    <Generator>Секретарь 2.0</Generator>
    <Version>1.0</Version>
  </SystemInfo>
</Card>`
      };
      
    default:
      return { filename: 'export.txt', content: responseText, mimeType: 'text/plain' };
  }
};