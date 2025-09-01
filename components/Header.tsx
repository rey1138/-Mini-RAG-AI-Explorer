
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                R
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
            Mini RAG AI Explorer
            </h1>
        </div>
        <p className="text-sm text-slate-400 hidden md:block">Grounded Answers with Gemini</p>
      </div>
    </header>
  );
};
