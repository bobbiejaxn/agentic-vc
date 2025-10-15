import { MarkdownSection, ParsedMarkdown } from "./markdownParser";

export interface SmartChunk {
  content: string;
  context: string;
  headingPath: string[];
  sections: Array<{ type: string; content: string }>;
  metadata: {
    hasTables: boolean;
    hasCode: boolean;
    hasLists: boolean;
    estimatedTokens: number;
  };
}

function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

export function createSmartChunks(
  parsed: ParsedMarkdown,
  minTokens: number = 300,
  maxTokens: number = 900
): SmartChunk[] {
  const chunks: SmartChunk[] = [];
  let currentChunk: {
    sections: MarkdownSection[];
    headingPath: string[];
  } = {
    sections: [],
    headingPath: [],
  };
  
  let currentTokens = 0;
  
  for (const section of parsed.sections) {
    const sectionTokens = estimateTokens(section.content);
    
    // Tables and code blocks are atomic - never split
    if (section.type === "table" || section.type === "code") {
      // If current chunk exists and adding this would exceed max, finalize it
      if (currentChunk.sections.length > 0 && currentTokens + sectionTokens > maxTokens) {
        chunks.push(finalizeChunk(currentChunk));
        currentChunk = { sections: [], headingPath: section.headingPath };
        currentTokens = 0;
      }
      
      // Add atomic section
      currentChunk.sections.push(section);
      currentChunk.headingPath = section.headingPath;
      currentTokens += sectionTokens;
      
      // If this atomic section is large enough, finalize immediately
      if (currentTokens >= minTokens) {
        chunks.push(finalizeChunk(currentChunk));
        currentChunk = { sections: [], headingPath: section.headingPath };
        currentTokens = 0;
      }
      
      continue;
    }
    
    // For headings, check if we should start a new chunk
    if (section.type === "heading") {
      // If we have content and heading path changed significantly, finalize
      if (currentChunk.sections.length > 0 && currentTokens >= minTokens) {
        const pathChanged = section.level && section.level <= 2;
        if (pathChanged) {
          chunks.push(finalizeChunk(currentChunk));
          currentChunk = { sections: [], headingPath: section.headingPath };
          currentTokens = 0;
        }
      }
      
      currentChunk.sections.push(section);
      currentChunk.headingPath = section.headingPath;
      currentTokens += sectionTokens;
      continue;
    }
    
    // For other content, check token limits
    if (currentTokens + sectionTokens > maxTokens && currentChunk.sections.length > 0) {
      chunks.push(finalizeChunk(currentChunk));
      currentChunk = { sections: [], headingPath: section.headingPath };
      currentTokens = 0;
    }
    
    currentChunk.sections.push(section);
    currentChunk.headingPath = section.headingPath;
    currentTokens += sectionTokens;
    
    // If we've reached a good size, finalize
    if (currentTokens >= minTokens && section.type === "paragraph") {
      chunks.push(finalizeChunk(currentChunk));
      currentChunk = { sections: [], headingPath: section.headingPath };
      currentTokens = 0;
    }
  }
  
  // Finalize remaining chunk
  if (currentChunk.sections.length > 0) {
    chunks.push(finalizeChunk(currentChunk));
  }
  
  return chunks;
}

function finalizeChunk(chunk: {
  sections: MarkdownSection[];
  headingPath: string[];
}): SmartChunk {
  const content = chunk.sections.map(s => s.content).join("\n\n");
  const context = chunk.headingPath.length > 0 
    ? `Context: ${chunk.headingPath.join(" > ")}\n\n`
    : "";
  
  const hasTables = chunk.sections.some(s => s.type === "table");
  const hasCode = chunk.sections.some(s => s.type === "code");
  const hasLists = chunk.sections.some(s => s.type === "list");
  
  return {
    content,
    context,
    headingPath: chunk.headingPath,
    sections: chunk.sections.map(s => ({
      type: s.type,
      content: s.content,
    })),
    metadata: {
      hasTables,
      hasCode,
      hasLists,
      estimatedTokens: estimateTokens(content),
    },
  };
}
