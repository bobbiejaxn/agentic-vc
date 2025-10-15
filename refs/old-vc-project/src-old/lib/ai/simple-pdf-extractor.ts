// Real text extraction for development and production

export interface SimpleExtractedData {
  rawText: string;
  confidence: number;
  pageCount?: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

export class SimplePDFExtractor {
  /**
   * Extract text from a PDF file using a server-compatible approach
   * For now, we'll use a more robust approach that works in Node.js environment
   */
  async extractText(file: File): Promise<SimpleExtractedData> {
    try {
      // For now, we'll implement a basic PDF text extraction
      // This is a simplified approach that works reliably in server environments

      // Convert File to ArrayBuffer to analyze the PDF structure
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Basic PDF text extraction using regex patterns
      // This is a simplified approach that extracts text from PDFs
      const pdfText = this.extractTextFromPDFBuffer(uint8Array);

      if (pdfText.length > 0) {
        return {
          rawText: pdfText,
          confidence: 0.8, // Good confidence for successful extraction
          pageCount: this.estimatePageCount(uint8Array),
          metadata: {
            title: file.name,
            creator: "PDF Text Extractor (Server)",
          },
        };
      } else {
        // If no text found, return a more informative message
        return {
          rawText: `[PDF Text Extraction - Limited Success]\n\nFile: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type}\n\nNote: PDF text extraction completed but limited text was found. This may be due to:\n- Scanned PDF (image-based)\n- Complex formatting\n- Encrypted content\n\nFor better results, consider using Google Cloud Document AI in production.`,
          confidence: 0.3, // Lower confidence due to limited extraction
          pageCount: this.estimatePageCount(uint8Array),
          metadata: {
            title: file.name,
            creator: "PDF Text Extractor (Limited)",
          },
        };
      }
    } catch (error) {
      console.error("Error extracting text from PDF:", error);

      // Fallback to placeholder if PDF parsing fails
      return {
        rawText: `[PDF Text Extraction Failed]\n\nFile: ${file.name}\nSize: ${
          file.size
        } bytes\nType: ${file.type}\n\nError: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n\nNote: PDF text extraction failed. This may be due to the PDF format or content.`,
        confidence: 0.1, // Low confidence due to extraction failure
        pageCount: 1,
        metadata: {
          title: file.name,
          creator: "PDF Text Extractor (Failed)",
        },
      };
    }
  }

  /**
   * Extract text from PDF buffer using basic regex patterns
   */
  private extractTextFromPDFBuffer(buffer: Uint8Array): string {
    try {
      // Convert buffer to string for text extraction
      const pdfString = new TextDecoder("latin1").decode(buffer);

      // Extract text between BT (Begin Text) and ET (End Text) markers
      const textMatches = pdfString.match(/BT\s*(.*?)\s*ET/gs);

      if (!textMatches) {
        return "";
      }

      let extractedText = "";

      for (const match of textMatches) {
        // Extract text content from the match
        const textContent = match.replace(/BT\s*/, "").replace(/\s*ET/, "");

        // Look for text strings in parentheses (common PDF text format)
        const stringMatches = textContent.match(/\(([^)]+)\)/g);

        if (stringMatches) {
          for (const strMatch of stringMatches) {
            // Remove parentheses and decode escaped characters
            let text = strMatch.slice(1, -1);
            text = text.replace(/\\(.)/g, "$1"); // Basic escape sequence handling
            extractedText += text + " ";
          }
        }

        // Also look for text between brackets
        const bracketMatches = textContent.match(/<([^>]+)>/g);
        if (bracketMatches) {
          for (const bracketMatch of bracketMatches) {
            let text = bracketMatch.slice(1, -1);
            // Convert hex-encoded text
            if (text.match(/^[0-9A-Fa-f]+$/)) {
              try {
                text = Buffer.from(text, "hex").toString("utf8");
              } catch (e) {
                // If hex decoding fails, use as-is
              }
            }
            extractedText += text + " ";
          }
        }
      }

      // Clean up the extracted text
      return extractedText
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, "\n") // Remove empty lines
        .trim();
    } catch (error) {
      console.error("Error in PDF text extraction:", error);
      return "";
    }
  }

  /**
   * Estimate page count from PDF buffer
   */
  private estimatePageCount(buffer: Uint8Array): number {
    try {
      const pdfString = new TextDecoder("latin1").decode(buffer);
      // Count page objects
      const pageMatches = pdfString.match(/\/Type\s*\/Page\b/g);
      return pageMatches ? pageMatches.length : 1;
    } catch (error) {
      return 1;
    }
  }

  /**
   * Extract text from a text file
   */
  async extractTextFromTextFile(file: File): Promise<SimpleExtractedData> {
    try {
      const text = await file.text();
      return {
        rawText: text,
        confidence: 1.0, // Perfect confidence for text files
        pageCount: 1,
      };
    } catch (error) {
      console.error("Error extracting text from text file:", error);
      throw new Error(
        `Failed to extract text from text file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Extract text from any supported file type
   */
  async extractTextFromFile(file: File): Promise<SimpleExtractedData> {
    if (file.type === "application/pdf") {
      return this.extractText(file);
    } else if (file.type === "text/plain") {
      return this.extractTextFromTextFile(file);
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  }
}

export const simplePDFExtractor = new SimplePDFExtractor();
