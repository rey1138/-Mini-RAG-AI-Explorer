
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface DocumentInputProps {
  onIngest: (text: string) => void;
  onReset: () => void;
  isDisabled: boolean;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({ onIngest, onReset, isDisabled }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileText = e.target?.result as string;
        setText(fileText);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };
  
  const handleIngestClick = () => {
    if (text.trim()) {
      onIngest(text);
    }
  };

  const handleResetClick = () => {
    setText('');
    setFileName('');
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    onReset();
  }

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">1. Provide Document</h2>
      <div className="flex-grow flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your document text here..."
          className="w-full flex-grow bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
          disabled={isDisabled}
        />
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleUploadClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
            <UploadIcon />
            <span>Upload .txt File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt"
            disabled={isDisabled}
          />
          {fileName && <span className="text-sm text-slate-400 truncate">{fileName}</span>}
        </div>
      </div>
       <div className="mt-6 flex items-center justify-between gap-4">
            <button
                onClick={handleResetClick}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
                disabled={isDisabled}
            >
                <TrashIcon />
                Reset
            </button>
            <button
                onClick={handleIngestClick}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md transition-colors duration-200 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={!text.trim() || isDisabled}
            >
                Process Document
            </button>
        </div>
    </div>
  );
};
