import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export interface MarkdownSection {
  type: "heading" | "paragraph" | "table" | "list" | "code";
  level?: number;
  content: string;
  startLine: number;
  endLine: number;
  headingPath: string[];
}

export interface ParsedMarkdown {
  sections: MarkdownSection[];
  metadata: {
    headingCount: number;
    tableCount: number;
    listCount: number;
    codeBlockCount: number;
  };
}

export function normalizeMarkdown(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parseMarkdownStructure(text: string): ParsedMarkdown {
  const normalized = normalizeMarkdown(text);
  const lines = normalized.split("\n");
  const sections: MarkdownSection[] = [];
  const headingStack: Array<{ level: number; text: string }> = [];
  
  let i = 0;
  let metadata = {
    headingCount: 0,
    tableCount: 0,
    listCount: 0,
    codeBlockCount: 0,
  };

  while (i < lines.length) {
    const line = lines[i];
    
    // Detect headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      
      // Update heading stack
      while (headingStack.length > 0 && headingStack[headingStack.length - 1].level >= level) {
        headingStack.pop();
      }
      headingStack.push({ level, text });
      
      sections.push({
        type: "heading",
        level,
        content: text,
        startLine: i,
        endLine: i,
        headingPath: headingStack.map(h => h.text),
      });
      
      metadata.headingCount++;
      i++;
      continue;
    }
    
    // Detect code blocks
    if (line.trim().startsWith("```")) {
      const startLine = i;
      i++;
      let codeContent = line + "\n";
      
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeContent += lines[i] + "\n";
        i++;
      }
      
      if (i < lines.length) {
        codeContent += lines[i];
        i++;
      }
      
      sections.push({
        type: "code",
        content: codeContent,
        startLine,
        endLine: i - 1,
        headingPath: headingStack.map(h => h.text),
      });
      
      metadata.codeBlockCount++;
      continue;
    }
    
    // Detect tables
    if (line.includes("|")) {
      const startLine = i;
      let tableContent = "";
      
      while (i < lines.length && (lines[i].includes("|") || lines[i].trim() === "")) {
        if (lines[i].trim() !== "") {
          tableContent += lines[i] + "\n";
        }
        i++;
      }
      
      if (tableContent.trim()) {
        sections.push({
          type: "table",
          content: tableContent.trim(),
          startLine,
          endLine: i - 1,
          headingPath: headingStack.map(h => h.text),
        });
        metadata.tableCount++;
      }
      continue;
    }
    
    // Detect lists
    if (line.match(/^\s*[-*+]\s+/) || line.match(/^\s*\d+\.\s+/)) {
      const startLine = i;
      let listContent = "";
      
      while (i < lines.length && (lines[i].match(/^\s*[-*+]\s+/) || lines[i].match(/^\s*\d+\.\s+/) || lines[i].trim() === "")) {
        if (lines[i].trim() !== "") {
          listContent += lines[i] + "\n";
        }
        i++;
      }
      
      if (listContent.trim()) {
        sections.push({
          type: "list",
          content: listContent.trim(),
          startLine,
          endLine: i - 1,
          headingPath: headingStack.map(h => h.text),
        });
        metadata.listCount++;
      }
      continue;
    }
    
    // Regular paragraph
    if (line.trim()) {
      const startLine = i;
      let paragraphContent = "";
      
      while (i < lines.length && lines[i].trim() && !lines[i].match(/^#{1,6}\s+/) && !lines[i].includes("|") && !lines[i].match(/^\s*[-*+]\s+/) && !lines[i].match(/^\s*\d+\.\s+/) && !lines[i].trim().startsWith("```")) {
        paragraphContent += lines[i] + "\n";
        i++;
      }
      
      if (paragraphContent.trim()) {
        sections.push({
          type: "paragraph",
          content: paragraphContent.trim(),
          startLine,
          endLine: i - 1,
          headingPath: headingStack.map(h => h.text),
        });
      }
      continue;
    }
    
    i++;
  }
  
  return { sections, metadata };
}

export const testParser = internalQuery({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return parseMarkdownStructure(args.text);
  },
});
