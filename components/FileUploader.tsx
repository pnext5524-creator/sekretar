import React, { useRef, useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { UploadedFile } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface FileUploaderProps {
  onFileSelect: (fileData: UploadedFile | null) => void;
  selectedFile: UploadedFile | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    // Only accept images and PDF
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      alert("Пожалуйста, загрузите изображение (JPG, PNG) или PDF документ.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      onFileSelect({ file, base64, previewUrl });
    } catch (error) {
      console.error("Error processing file", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const clearFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Входящий документ (Скан/Фото или PDF)
      </label>
      
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800'
          }`}
        >
          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-3 text-blue-600 dark:text-blue-400">
            <Upload size={24} />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
            Нажмите для загрузки или перетащите файл
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            PDF, PNG, JPG (Макс. 10MB)
          </p>
        </div>
      ) : (
        <div className="relative border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 flex items-center shadow-sm">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 mr-4 flex items-center justify-center">
            {selectedFile.file.type === 'application/pdf' ? (
              <FileText size={32} className="text-red-500" />
            ) : (
              <img 
                src={selectedFile.previewUrl} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
              {selectedFile.file.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
              <CheckCircle size={12} className="text-green-500 dark:text-green-400 mr-1" />
              Готово к анализу
            </p>
          </div>
          <button
            onClick={clearFile}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />
    </div>
  );
};