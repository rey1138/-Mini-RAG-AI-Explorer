
import { GoogleGenAI, Type } from "@google/genai";
import type { Chunk } from '../types';

const API_KEY_SESSION_STORAGE_KEY = 'gemini-api-key';

function getClient(): GoogleGenAI {
  const apiKey = sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY);
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set it in the application settings.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function getGroundedAnswer(query: string, contextChunks: Chunk[]): Promise<{ response: string; promptLength: number }> {
  const model = 'gemini-2.5-flash';
  
  const context = contextChunks
    .map(chunk => `[Source ${chunk.id}]:\n${chunk.content}`)
    .join('\n\n---\n\n');

  const prompt = `
You are a helpful AI assistant. Your task is to answer the user's query based ONLY on the provided sources.
Do not use any external knowledge or information you were trained on.
If the answer cannot be found within the provided sources, you MUST respond with "I could not find an answer in the provided text."

Your answer must be grounded in the sources. Include inline citations to the sources using the format [1], [2], etc., corresponding to the source number. For example, if a piece of information comes from Source 1, cite it as [1].

**SOURCES:**
${context}

**USER QUERY:**
${query}

**ANSWER:**
`;

  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    
    return {
        response: response.text.trim(),
        promptLength: prompt.length
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("The provided Gemini API key is not valid. Please check it in the settings.");
    }
    throw new Error("Failed to communicate with the AI model. Please check your API key and network connection.");
  }
}

export async function retrieveChunks(query: string, chunks: Chunk[]): Promise<Chunk[]> {
  if (chunks.length === 0) return [];
  
  const model = 'gemini-2.5-flash';
  const chunkContent = chunks.map(c => `[ID: ${c.id}]:\n${c.content}`).join('\n\n---\n\n');
  
  const prompt = `
You are a highly intelligent retrieval assistant. Your task is to analyze the user's query and the provided document chunks and identify the TOP 5 most relevant chunks that are most likely to contain the answer to the query.

Return only a JSON object with a single key "relevant_ids", which is an array of the chunk IDs you have identified as most relevant. Do not provide any explanation or other text.

**USER QUERY:**
${query}

**DOCUMENT CHUNKS:**
${chunkContent}

**JSON OBJECT OF RELEVANT IDs:**
`;
  
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevant_ids: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: "An array of the top 5 most relevant chunk IDs."
            }
          }
        }
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as { relevant_ids: number[] };
    const relevantIds = result.relevant_ids;
    
    const chunkMap = new Map(chunks.map(c => [c.id, c]));
    return relevantIds.map(id => chunkMap.get(id)).filter((c): c is Chunk => c !== undefined);

  } catch (error) {
    console.error("Error calling Gemini API for retrieval:", error);
     if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("The provided Gemini API key is not valid. Please check it in the settings.");
    }
    // Fallback: if retrieval fails, return an empty array or the first few chunks as a last resort.
    return [];
  }
}

export async function rerankChunks(query: string, chunks: Chunk[]): Promise<Chunk[]> {
  if (chunks.length === 0) {
    return [];
  }

  const model = 'gemini-2.5-flash';
  
  const chunkContent = chunks.map(c => `[ID: ${c.id}]:\n${c.content}`).join('\n\n---\n\n');

  const prompt = `
You are a reranking assistant. Your task is to reorder the following document chunks based on their relevance to the user's query.
Return only a JSON object with a single key "reranked_ids", which is an array of the chunk IDs, ordered from most relevant to least relevant. Do not provide any explanation or other text.

**USER QUERY:**
${query}

**DOCUMENT CHUNKS:**
${chunkContent}

**JSON OBJECT OF RELEVANT IDs:**
`;

  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reranked_ids: {
              type: Type.ARRAY,
              items: {
                type: Type.NUMBER,
                description: "The ID of a chunk."
              },
              description: "An array of chunk IDs, ordered by relevance to the query."
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as { reranked_ids: number[] };
    const rerankedIds = result.reranked_ids;

    const chunkMap = new Map(chunks.map(c => [c.id, c]));
    
    const rerankedChunks = rerankedIds
      .map(id => chunkMap.get(id))
      .filter((c): c is Chunk => c !== undefined);

    // Ensure all original chunks are returned, even if the model misses some.
    const rerankedSet = new Set(rerankedIds);
    const missingChunks = chunks.filter(c => !rerankedSet.has(c.id));

    return [...rerankedChunks, ...missingChunks];
  } catch (error) {
    console.error("Error calling Gemini API for reranking:", error);
     if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("The provided Gemini API key is not valid. Please check it in the settings.");
    }
    // Fallback to original order if reranking fails
    return chunks;
  }
}
