
import React, { useState, useCallback, useEffect } from 'react';
import { DocumentInput } from './components/DocumentInput';
import { QaPanel } from './components/QaPanel';
import { Header } from './components/Header';
import { chunkText } from './utils/textUtils';
import { getGroundedAnswer, rerankChunks, retrieveChunks } from './services/geminiService';
import type { Chunk, RequestDetails } from './types';
import { AppState } from './types';

const App: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [citedChunks, setCitedChunks] = useState<Chunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const [highlightedChunkId, setHighlightedChunkId] = useState<number | null>(null);


  useEffect(() => {
    // A welcome message can be set here if needed
  }, []);

  const handleIngest = useCallback((text: string) => {
    try {
      setSourceText(text);
      const newChunks = chunkText(text);
      setChunks(newChunks);
      setAppState(AppState.INGESTED);
      setAiResponse('');
      setCitedChunks([]);
      setError(null);
    } catch (e) {
      setError('Failed to process the document. Please try again.');
      console.error(e);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSourceText('');
    setChunks([]);
    setAiResponse('');
    setCitedChunks([]);
    setError(null);
    setAppState(AppState.INITIAL);
    setRequestDetails(null);
    setHighlightedChunkId(null);
  }, []);
  
  const handleQuerySubmit = useCallback(async (query: string) => {
    if (!query.trim() || chunks.length === 0) {
      setError('Please provide a document and a query.');
      return;
    }

    const startTime = performance.now();
    setIsLoading(true);
    setError(null);
    setAiResponse('');
    setCitedChunks([]);
    setRequestDetails(null);
    setHighlightedChunkId(null);
    
    try {
      // Step 1: Semantic Retrieval
      setLoadingMessage('Semantically retrieving documents...');
      const relevantChunks = await retrieveChunks(query, chunks);

      if (relevantChunks.length === 0) {
        setAiResponse("I couldn't find any relevant information in the document to answer your question.");
        setAppState(AppState.ANSWERED);
        setIsLoading(false);
        setLoadingMessage('');
        return;
      }
      
      // Step 2: Reranking
      setLoadingMessage('Reranking documents...');
      const rerankedChunks = await rerankChunks(query, relevantChunks);
      // Use top 3 reranked chunks for the final context
      const contextChunks = rerankedChunks.slice(0, 3);
      setCitedChunks(contextChunks);
      
      // Step 3: Generation
      setLoadingMessage('Generating answer...');
      const { response, promptLength } = await getGroundedAnswer(query, contextChunks);
      
      const endTime = performance.now();
      const duration = parseFloat(((endTime - startTime) / 1000).toFixed(1));
      const responseLength = response.length;
      // Simple estimation: 1 token ~ 4 characters
      const totalTokens = Math.ceil((promptLength + responseLength) / 4);

      setRequestDetails({ time: duration, tokens: totalTokens });
      setAiResponse(response);
      setAppState(AppState.ANSWERED);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get answer from AI: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [chunks]);

  const handleHighlightChunk = useCallback((id: number) => {
    setHighlightedChunkId(id);
    setTimeout(() => {
      setHighlightedChunkId(null);
    }, 2000); // Highlight lasts for 2 seconds
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <DocumentInput onIngest={handleIngest} onReset={handleReset} isDisabled={isLoading} />
        </div>
        <div className="flex flex-col">
          <QaPanel 
            appState={appState}
            onQuerySubmit={handleQuerySubmit}
            aiResponse={aiResponse}
            citedChunks={citedChunks}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            requestDetails={requestDetails}
            error={error}
            highlightedChunkId={highlightedChunkId}
            onHighlightChunk={handleHighlightChunk}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
