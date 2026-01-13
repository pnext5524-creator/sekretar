import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, FilePenLine, Scale, ShieldCheck, ShieldAlert, AlertTriangle, Loader2, ArrowRight, Download, Share2 } from 'lucide-react';
import { analyzeLegalCompliance } from '../services/geminiService';
import { LegalAnalysisResult, EdmsType } from '../types';
import { generateEdmsPackage } from '../utils/edmsTemplates';

interface ResponseEditorProps {
  responseText: string;
}

export const ResponseEditor: React.FC<ResponseEditorProps> = ({ responseText }) => {
  const [editableText, setEditableText] = useState(responseText);
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  
  // Legal Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LegalAnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    setEditableText(responseText);
    setAnalysisResult(null);
    setShowAnalysis(false);
  }, [responseText]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleLegalCheck = async () => {
    if (!editableText.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setShowAnalysis(true);
    
    try {
      const result = await analyzeLegalCompliance(editableText);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyCorrection = () => {
    if (analysisResult?.revisedText) {
      setEditableText(analysisResult.revisedText);
    }
  };

  const handleExport = (type: EdmsType) => {
    const { filename, content, mimeType } = generateEdmsPackage(type, editableText, "Входящий_документ");
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'WARNING': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'SAFE': return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  const getRiskIcon = (level?: string) => {
    switch (level) {
      case 'CRITICAL': return <ShieldAlert size={24} className="text-red-600 dark:text-red-400" />;
      case 'WARNING': return <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400" />;
      case 'SAFE': return <ShieldCheck size={24} className="text-green-600 dark:text-green-400" />;
      default: return <Scale size={24} />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden relative transition-colors duration-300">
      {/* Toolbar */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 flex items-center justify-between flex-wrap gap-2 transition-colors">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <FilePenLine size={18} />
          <h3 className="font-semibold text-sm">Проект Ответа</h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <Share2 size={14} />
              <span>Экспорт в СЭД</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Выберите систему
                </div>
                <div className="py-1">
                  {Object.values(EdmsType).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleExport(type)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 flex items-center justify-between group"
                    >
                      <span>{type}</span>
                      <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLegalCheck}
            disabled={isAnalyzing || !editableText}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
               showAnalysis 
               ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' 
               : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Scale size={14} />}
            <span>Юр. проверка</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Скопировано' : 'Копировать'}</span>
          </button>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 p-0 relative flex flex-col min-h-0">
        <textarea
          className="w-full flex-grow p-6 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 leading-relaxed font-serif text-base transition-colors"
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          spellCheck={false}
          placeholder="Здесь появится текст официального ответа..."
        />
        
        {/* Legal Analysis Panel */}
        {showAnalysis && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 w-full max-h-[50%] overflow-y-auto shadow-inner animate-in slide-in-from-bottom-5 duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                  Результаты правовой экспертизы
                </h4>
                <button 
                  onClick={() => setShowAnalysis(false)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-xs"
                >
                  Скрыть
                </button>
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500 dark:text-slate-400 space-y-3">
                  <Loader2 size={28} className="animate-spin text-indigo-500" />
                  <p className="text-sm">Анализируем законодательство РФ и ищем ошибки...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg border flex items-start gap-3 ${getRiskColor(analysisResult.riskLevel)}`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {getRiskIcon(analysisResult.riskLevel)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">
                        {analysisResult.riskLevel === 'SAFE' && "Нарушений не выявлено"}
                        {analysisResult.riskLevel === 'WARNING' && "Есть замечания"}
                        {analysisResult.riskLevel === 'CRITICAL' && "Критические ошибки"}
                      </p>
                      <p className="text-sm mt-1 opacity-90 leading-relaxed">
                        {analysisResult.generalComment}
                      </p>
                    </div>
                  </div>

                  {/* Issues List */}
                  {analysisResult.issues.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Детальный разбор</h5>
                      <ul className="space-y-3">
                        {analysisResult.issues.map((issue, idx) => (
                          <li key={idx} className="flex gap-3 text-sm border-b border-slate-100 dark:border-slate-700 last:border-0 pb-2 last:pb-0">
                             <span className={`flex-shrink-0 w-2 h-2 mt-1.5 rounded-full ${
                               issue.severity === 'HIGH' ? 'bg-red-500' : 
                               issue.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-400'
                             }`} />
                             <div className="flex-1">
                               <p className="text-slate-800 dark:text-slate-200">{issue.description}</p>
                               {issue.citation && (
                                 <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 bg-slate-100 dark:bg-slate-700 inline-block px-1.5 py-0.5 rounded">
                                   {issue.citation}
                                 </p>
                               )}
                             </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestion Action */}
                  {analysisResult.riskLevel !== 'SAFE' && (
                     <div className="flex justify-end">
                       <button
                         onClick={applyCorrection}
                         className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                       >
                         <span>Применить рекомендованный вариант</span>
                         <ArrowRight size={16} />
                       </button>
                     </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex justify-between transition-colors">
        <span>Подготовлено системой "Секретарь 2.0"</span>
        <span>{editableText.length} символов</span>
      </div>
    </div>
  );
};