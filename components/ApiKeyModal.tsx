
import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
  initialApiKey?: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, initialApiKey = '' }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            <KeyIcon />
            <h2 className="text-xl font-bold text-white">Gemini API Key</h2>
        </div>
        <p className="text-slate-400 mb-6 text-sm">
          To use this application, please enter your Google Gemini API key. Your key is stored only in your browser's session and is never sent to our servers.
        </p>
        <div className="flex flex-col gap-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-slate-300">Your API Key</label>
            <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key here"
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
        </div>
        <p className="text-xs text-slate-500 mt-2">
            Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a>.
        </p>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md transition-colors duration-200 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={!apiKey.trim()}
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
};
