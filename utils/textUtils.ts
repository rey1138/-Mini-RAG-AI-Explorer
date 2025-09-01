
import type { Chunk } from '../types';

// Simple text chunking function
export function chunkText(text: string): Chunk[] {
  const chunks: Chunk[] = [];
  // Target 800-1200 tokens. A rough approximation is 1 token ~ 4 chars.
  // So we target ~3200-4800 characters, let's aim for 3500.
  const chunkSize = 3500; 
  // 10-15% overlap
  const overlap = Math.floor(chunkSize * 0.15); 
  let id = 1;
  
  for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
    const end = Math.min(i + chunkSize, text.length);
    const content = text.substring(i, end);
    chunks.push({ id: id++, content: content.trim() });
    if (end === text.length) break;
  }
  
  return chunks;
}
