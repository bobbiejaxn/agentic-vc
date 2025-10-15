# Mistral OCR Implementation Guide (Updated)

A comprehensive guide for integrating Mistral AI's OCR capabilities into your applications.

## Table of Contents

- [Overview](#overview)
- [Setup & Configuration](#setup--configuration)
- [IMPORTANT: Correct Implementation](#important-correct-implementation)
- [Python Implementation](#python-implementation)
- [Advanced Features](#advanced-features)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Mistral AI provides a powerful OCR (Optical Character Recognition) service that can extract text and structured content from documents and images. The service is particularly effective for:

- **PDF Documents**: Multi-page PDFs with complex layouts
- **Images**: Photos, screenshots, scanned documents
- **Tables**: Structured data extraction with formatting preserved
- **Financial Documents**: Complex layouts with numbers and tables

**Key Benefits:**

- Handles documents up to 50MB
- Processes up to 1000 pages per document
- Preserves table structure and formatting
- Supports multiple file formats (PDF, PNG, JPEG, etc.)
- High accuracy for complex layouts
- Returns clean markdown formatted text

## Setup & Configuration

### 1. Get API Access

1. Sign up at [Mistral AI](https://mistral.ai/)
2. Navigate to your API keys section
3. Create a new API key
4. Store it securely (use environment variables)

### 2. Environment Variables

```bash
# .env
MISTRAL_API_KEY=your_api_key_here
```

### 3. Install Dependencies

```bash
# Python
pip install mistralai

# JavaScript/TypeScript
npm install mistralai
```

## IMPORTANT: Correct Implementation

⚠️ **Critical Update (2024)**: The Mistral OCR API requires a two-step process:
1. Upload the file to get a file ID
2. Get a signed URL and process with OCR

The direct base64 encoding approach shown in many examples **DOES NOT WORK**.

## Python Implementation

### Working Implementation (Tested and Verified)

```python
"""
Correct Mistral OCR Implementation
Based on official Mistral cookbook examples
"""

import os
import time
from typing import Dict, Any, Optional
from pathlib import Path
from mistralai import Mistral, DocumentURLChunk
import json


class MistralOCRCorrect:
    """Correct implementation of Mistral OCR using file upload approach"""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize with API key"""
        self.api_key = api_key or os.getenv("MISTRAL_API_KEY")
        if not self.api_key:
            raise ValueError("MISTRAL_API_KEY not configured")
        
        self.client = Mistral(api_key=self.api_key)
        self.model = "mistral-ocr-latest"

    async def extract_pdf_text(self, pdf_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Extract text from PDF using correct Mistral OCR API
        
        Args:
            pdf_content: PDF file content as bytes
            filename: Name of the file
            
        Returns:
            Dict with extracted text and metadata
        """
        start_time = time.time()
        
        try:
            # Step 1: Upload the PDF file to Mistral
            print(f"Uploading {filename} to Mistral...")
            uploaded_file = self.client.files.upload(
                file={
                    "file_name": filename.replace(".pdf", ""),
                    "content": pdf_content,
                },
                purpose="ocr",
            )
            print(f"File uploaded with ID: {uploaded_file.id}")
            
            # Step 2: Get signed URL for the uploaded file
            signed_url = self.client.files.get_signed_url(
                file_id=uploaded_file.id,
                expiry=1  # 1 hour expiry
            )
            print(f"Got signed URL for processing")
            
            # Step 3: Process PDF with OCR
            print(f"Processing with OCR model: {self.model}")
            ocr_response = self.client.ocr.process(
                document=DocumentURLChunk(document_url=signed_url.url),
                model=self.model,
                include_image_base64=False  # Don't include images to save bandwidth
            )
            
            # Step 4: Parse the response
            response_dict = json.loads(ocr_response.model_dump_json())
            
            # Extract text content
            extracted_text = ""
            pages_data = []
            
            # The response contains 'pages' with markdown content
            if "pages" in response_dict:
                for page in response_dict["pages"]:
                    if "markdown" in page:
                        extracted_text += page["markdown"] + "\n\n"
                        pages_data.append(page)
            elif "text" in response_dict:
                # Direct text response
                extracted_text = response_dict["text"]
            else:
                # Try to extract any text from the response
                extracted_text = json.dumps(response_dict)
            
            processing_time = time.time() - start_time
            
            # Calculate metrics
            page_count = len(pages_data) if pages_data else 1
            contains_portfolio = "portfolio" in extracted_text.lower()
            contains_tables = "table" in extracted_text.lower() or "|" in extracted_text
            
            # Calculate confidence based on extraction
            confidence = 1.0 if len(extracted_text) > 1000 else len(extracted_text) / 1000
            
            print(f"OCR extraction completed in {processing_time:.2f}s")
            print(f"Extracted {len(extracted_text)} characters from {page_count} pages")
            print(f"Contains portfolio data: {contains_portfolio}")
            print(f"Contains tables: {contains_tables}")
            
            return {
                "text": extracted_text.strip(),
                "page_count": page_count,
                "confidence": confidence,
                "processing_time": processing_time,
                "model": self.model,
                "contains_tables": contains_tables,
                "contains_portfolio": contains_portfolio,
                "file_id": uploaded_file.id,
            }
            
        except Exception as e:
            print(f"OCR extraction error: {e}")
            raise Exception(f"OCR processing failed: {str(e)}")
```

### Usage Example

```python
import asyncio
from pathlib import Path

async def extract_document():
    # Initialize OCR service
    ocr = MistralOCRCorrect()
    
    # Read PDF file
    pdf_path = Path("document.pdf")
    pdf_content = pdf_path.read_bytes()
    
    # Extract text
    result = await ocr.extract_pdf_text(pdf_content, pdf_path.name)
    
    print(f"Extracted {len(result['text'])} characters")
    print(f"Confidence: {result['confidence']:.2f}")
    print(f"Processing time: {result['processing_time']:.2f}s")
    
    # Save extracted text
    output_path = Path("extracted_text.md")
    output_path.write_text(result['text'])
    print(f"Saved to {output_path}")

# Run the extraction
asyncio.run(extract_document())
```

## Response Format

The OCR API returns structured data with markdown-formatted text:

```json
{
  "pages": [
    {
      "index": 0,
      "markdown": "# Document Title\n\n## Section 1\n\nContent here...\n\n| Column 1 | Column 2 |\n| --- | --- |\n| Data 1 | Data 2 |",
      "images": [],
      "dimensions": {
        "dpi": 200,
        "height": 2200,
        "width": 1700
      }
    }
  ],
  "model": "mistral-ocr-2505-completion",
  "usage_info": {
    "pages_processed": 2,
    "doc_size_bytes": 3749
  }
}
```

## Advanced Features

### Table Extraction

The OCR automatically preserves table structure in markdown format:

```markdown
| Fund Name | Vintage Year | Size |
| --- | --- | --- |
| Sequoia Capital Growth Fund VI | 2019 | $2.5B |
| Andreessen Horowitz Fund IV | 2020 | $1.8B |
```

### Portfolio Company Extraction

For financial documents, the OCR excellently extracts:
- Company names with valuations
- Investment amounts
- Sector information
- Performance metrics

Example output:
```markdown
# Notable Portfolio Companies 

- Stripe - Payments infrastructure (Series H, $95B valuation)
- Canva - Design platform (Series E, $40B valuation)  
- Instacart - Grocery delivery (IPO 2023)
- Klarna - Buy-now-pay-later (Series D, $45B valuation)
```

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
| --- | --- | --- |
| `MISTRAL_API_KEY not configured` | Missing API key | Set environment variable |
| `Distribution not found at: file:///deps/*` | Docker build issue | Check dependencies |
| `File too large` | File > 50MB | Compress or split file |
| `422 Unprocessable Entity` | Wrong API format | Use the file upload approach |

### Retry Logic

```python
async def extract_with_retry(self, file_buffer: bytes, file_name: str, max_retries: int = 3):
    """Extract text with automatic retry on failure"""
    last_error = None
    
    for attempt in range(1, max_retries + 1):
        try:
            return await self.extract_pdf_text(file_buffer, file_name)
        except Exception as e:
            last_error = e
            
            # Don't retry on client errors
            if "400" in str(e) or "File too large" in str(e):
                raise e
            
            if attempt < max_retries:
                delay = 2 ** attempt  # Exponential backoff
                print(f"OCR attempt {attempt} failed, retrying in {delay}s...")
                await asyncio.sleep(delay)
    
    raise last_error
```

## Best Practices

### 1. Always Use Environment Variables

```python
# Good
api_key = os.getenv("MISTRAL_API_KEY")

# Bad
api_key = "hardcoded_key_here"
```

### 2. Validate Extraction Results

```python
def validate_extraction(text: str, min_length: int = 100) -> bool:
    """Validate extraction quality"""
    if not text or len(text) < min_length:
        return False
    
    # Check for common extraction indicators
    has_content = any([
        "portfolio" in text.lower(),
        "fund" in text.lower(),
        "investment" in text.lower()
    ])
    
    return has_content
```

### 3. Monitor Performance

```python
# Log extraction metrics
print(f"OCR Metrics:")
print(f"  File: {filename}")
print(f"  Size: {len(pdf_content) / 1024:.1f} KB")
print(f"  Extracted: {len(result['text'])} characters")
print(f"  Time: {result['processing_time']:.2f}s")
print(f"  Speed: {len(result['text']) / result['processing_time']:.0f} chars/sec")
```

## Troubleshooting

### OCR Not Triggering

**Symptoms:**
- No "Using Mistral OCR" messages in logs
- Extraction returns minimal text
- Portfolio companies not extracted from tables

**Solution:**
```python
# Force OCR for fund documents
if "fund" in filename.lower() or "portfolio" in text.lower():
    use_ocr = True
```

### API Errors

**422 Unprocessable Entity:**
- You're using the wrong API format
- Switch to the file upload approach shown above

**Network Timeouts:**
```python
# Increase timeout for large files
async with httpx.AsyncClient(timeout=180.0) as client:
    # Your API calls here
```

### Monitoring Extraction

Check these log messages:
```
✅ Good signs:
- "Uploading document.pdf to Mistral..."
- "File uploaded with ID: xxx"
- "Got signed URL for processing"
- "OCR extracted 2033 characters with 1.00 confidence"
- "Contains portfolio data: True"
- "Contains tables: True"

❌ Bad signs:
- "Error in Mistral OCR extraction"
- "Falling back to basic PDF text extraction"
- "OCR processing failed"
```

## Migration from Old Implementation

If you were using the direct base64 approach, here's how to migrate:

### Old (Doesn't Work):
```python
# This approach DOES NOT WORK
payload = {
    "model": "mistral-ocr-latest",
    "document": f"data:{mime_type};base64,{base64_content}"
}
response = await client.post("/v1/ocr", json=payload)
```

### New (Works):
```python
# This approach WORKS
uploaded_file = client.files.upload(file={"file_name": name, "content": content}, purpose="ocr")
signed_url = client.files.get_signed_url(file_id=uploaded_file.id, expiry=1)
result = client.ocr.process(document=DocumentURLChunk(document_url=signed_url.url), model="mistral-ocr-latest")
```

## Conclusion

The Mistral OCR API is powerful and accurate, especially for financial documents with complex tables and layouts. The key points to remember:

1. **Use the file upload approach** - Direct base64 encoding doesn't work
2. **The API returns markdown** - Tables and formatting are preserved
3. **Monitor extraction quality** - Check character count and content indicators
4. **Implement retry logic** - For network issues and transient failures
5. **Validate results** - Ensure extraction meets your requirements

For production deployments:
- Use environment variables for API keys
- Implement comprehensive logging
- Monitor extraction metrics
- Cache results when appropriate
- Handle errors gracefully

The corrected implementation has been tested and verified to extract portfolio companies, tables, and all fund data successfully.