
import React, { useState, useMemo } from 'react';
import type { Chunk, RequestDetails } from '../types';
import { AppState } from '../types';
import { SendIcon } from './icons/SendIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface QaPanelProps {
  appState: AppState;
  onQuerySubmit: (query: string) => void;
  aiResponse: string;
  citedChunks: Chunk[];
  isLoading: boolean;
  loadingMessage: string;
  requestDetails: RequestDetails | null;
  error: string | null;
  highlightedChunkId: number | null;
  onHighlightChunk: (id: number) => void;
}

const Citation = ({ index, onClick }: { index: number; onClick: () => void; }) => (
    <a href={`#source-${index}`} 
       onClick={(e) => {
           e.preventDefault();
           onClick();
           document.getElementById(`source-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }}
       className="inline-block bg-slate-600 hover:bg-indigo-500 text-white font-bold text-xs w-5 h-5 text-center leading-5 rounded-full transition-colors duration-200 mx-1 no-underline cursor-pointer"
       title={`Go to source ${index}`}>
        {index}
    </a>
);

export const QaPanel: React.FC<QaPanelProps> = ({ appState, onQuerySubmit, aiResponse, citedChunks, isLoading, loadingMessage, requestDetails, error, highlightedChunkId, onHighlightChunk }) => {
  const [query, setQuery] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuerySubmit(query);
  };

  const formattedResponse = useMemo(() => {
    if (!aiResponse) return null;

    const parts = aiResponse.split(/(\[\d+\])/g);
    
    return parts.map((part, index) => {
        const citationMatch = part.match(/\[(\d+)\]/);
        if (citationMatch) {
            const citationNumber = parseInt(citationMatch[1], 10);
            return <Citation key={index} index={citationNumber} onClick={() => onHighlightChunk(citationNumber)} />;
        }
        return <span key={index} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br />') }} />;
    });
  }, [aiResponse, onHighlightChunk]);

  const renderContent = () => {
    if (appState === AppState.INITIAL) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-slate-800 rounded-lg">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-slate-200">Process a document to begin</h3>
          <p className="text-slate-400">Once your document is processed, you can ask questions about its content here.</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex-grow p-6 bg-slate-800 rounded-t-lg space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">2. Ask a Question</h2>
          {isLoading && (
              <div className="flex items-center gap-3 text-slate-300">
                  <LoadingSpinner />
                  <span>{loadingMessage || 'Thinking...'}</span>
              </div>
          )}
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
          
          {aiResponse && !isLoading && (
            <div className="space-y-4">
              <h3 className="font-semibold text-indigo-400">Answer</h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">{formattedResponse}</div>
            </div>
          )}

          {(citedChunks.length > 0 || requestDetails) && !isLoading && (
            <div className="space-y-4 pt-4 border-t border-slate-700">
               {requestDetails && (
                <div className="text-xs text-slate-500 flex items-center gap-4">
                    <span>Response Time: <strong>{requestDetails.time}s</strong></span>
                    <span>Estimated Tokens: <strong>~{requestDetails.tokens}</strong></span>
                </div>
              )}
              {citedChunks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-indigo-400 mt-2">Sources</h3>
                  <div className="space-y-3 mt-2">
                    {citedChunks.map((chunk) => {
                      const isHighlighted = chunk.id === highlightedChunkId;
                      const highlightClass = isHighlighted ? 'ring-2 ring-indigo-400 bg-indigo-900/30' : 'border-slate-700';
                      return (
                        <div key={chunk.id} id={`source-${chunk.id}`} className={`bg-slate-900/50 p-3 rounded-md border text-sm text-slate-400 scroll-mt-20 transition-all duration-300 ${highlightClass}`}>
                          <span className="font-bold text-slate-300 mr-2">[{chunk.id}]</span>
                          {chunk.content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 rounded-b-lg">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question based on the document..."
              className="w-full bg-slate-700 border border-slate-600 rounded-full py-3 pl-5 pr-14 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={isLoading || !query.trim()}
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  return renderContent();
};
