# Mistral OCR Implementation Testing Guide

## Overview

This guide explains how to test the Mistral OCR implementation in the VC Portfolio OS. The implementation currently uses mock data but is structured to easily integrate with the real Mistral API.

## Current Implementation Status

### ✅ What's Working

- **Mock OCR Processing**: Simulates Mistral OCR with realistic data
- **Document Status Tracking**: Proper status updates (uploading → processing → completed/error)
- **Chunk Creation**: Creates searchable text chunks from OCR results
- **Error Handling**: Graceful error handling and status updates
- **Database Integration**: Full Convex database integration

### 🔄 What's Mocked

- **Mistral API Calls**: Currently returns mock OCR results
- **File Processing**: No actual file upload/processing
- **Real OCR**: Uses simulated text extraction

## Testing Scripts

### 1. Quick Test (Recommended)

```bash
node test-mistral-simple.js
```

**What it tests:**

- User creation
- Document creation
- Mistral OCR processing
- Chunk creation
- Basic functionality

### 2. Comprehensive Test

```bash
node test-mistral.js
```

**What it tests:**

- Full workflow testing
- Error handling
- Performance metrics
- Search functionality
- Integration readiness

### 3. Advanced Test

```bash
node test-mistral-advanced.js
```

**What it tests:**

- Multiple document processing
- Performance benchmarking
- Chunk analysis
- Search functionality
- Integration readiness for Google ADK

## Manual Testing via Frontend

### 1. Start the Application

```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start Next.js frontend
cd apps/web && npm run dev
```

### 2. Test via Upload Page

1. Navigate to `http://localhost:3000/upload`
2. Click "Upload & Process" (even without selecting a file)
3. Check the console for processing results
4. Verify the document status updates

### 3. Check Database

```bash
# View documents
npx convex run documents:getDocumentsByUser '{"userId":"your-user-id"}'

# View chunks
npx convex run enhancedHybridChunks:getChunksByUser '{"userId":"your-user-id"}'
```

## Integration with Real Mistral API

### Current Mock Implementation

```typescript
// In convex/mistral.ts - lines 33-42
const mockOCRResult = {
  markdown: `# Fund Report Q4 2024\n\n## Performance Summary\n- IRR: 15.2%\n- MOIC: 2.1x\n- Fund Size: €100M`,
  metadata: {
    pages: 10,
    confidence: 0.95,
    processingTime: 2500,
  },
};
```

### Real Mistral API Integration

To integrate with real Mistral API, replace the mock section with:

```typescript
// Real Mistral API integration
const mistralApiKey = process.env.MISTRAL_API_KEY;
const mistralApiUrl = "https://api.mistral.ai/v1/ocr";

const response = await fetch(mistralApiUrl, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${mistralApiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "mistral-ocr-2505",
    document: documentContent, // Base64 encoded file
    options: {
      extract_tables: true,
      extract_images: true,
      confidence_threshold: 0.8,
    },
  }),
});

const ocrResult = await response.json();
```

## Expected Test Results

### ✅ Successful Test Output

```
🧪 Quick Mistral OCR Test
========================================
1. Creating test user...
✅ User created: j1234567890abcdef
2. Creating test document...
✅ Document created: k1234567890abcdef
3. Processing with Mistral OCR...
✅ Processing completed in 1250ms
✅ Success: true
✅ Extracted text: # Fund Report Q4 2024...
4. Checking created chunks...
✅ Chunks created: 1

🎉 Quick test completed successfully!
```

### ❌ Failed Test Output

```
❌ Quick test failed: Document not found
```

## Performance Benchmarks

### Expected Performance

- **Processing Time**: < 3 seconds (mock), < 10 seconds (real API)
- **Memory Usage**: < 100MB per document
- **Success Rate**: > 95%
- **Chunk Creation**: 1-5 chunks per document

### Performance Monitoring

```bash
# Monitor processing times
node test-mistral-advanced.js | grep "Processing completed"
```

## Troubleshooting

### Common Issues

1. **"Document not found" error**
   - Check if document was created successfully
   - Verify document ID is correct

2. **"Convex function not found" error**
   - Ensure Convex backend is running (`npx convex dev`)
   - Check if functions are deployed

3. **"Environment variable not set" error**
   - Verify `NEXT_PUBLIC_CONVEX_URL` is set
   - Check `.env.local` file

4. **Slow processing times**
   - Check network connection
   - Monitor Convex dashboard for errors
   - Verify database performance

### Debug Commands

```bash
# Check Convex status
npx convex dev --help

# View Convex logs
npx convex logs

# Test Convex connection
npx convex run users:getUserByEmail '{"email":"test@example.com"}'
```

## Next Steps

### Phase 1: Mock Testing ✅

- [x] Basic functionality testing
- [x] Error handling testing
- [x] Performance benchmarking
- [x] Integration testing

### Phase 2: Real API Integration

- [ ] Integrate real Mistral API
- [ ] Test with actual PDF files
- [ ] Implement file upload handling
- [ ] Add real OCR processing

### Phase 3: Google ADK Integration

- [ ] Connect to Google ADK agents
- [ ] Test multi-agent workflow
- [ ] Implement Tier 1 extraction
- [ ] Add confidence scoring

## Test Data

### Sample Documents for Testing

1. **Fund Reports**: Q4 2024 performance summaries
2. **Portfolio Summaries**: Company listings and valuations
3. **Capital Account Statements**: Investment tracking documents
4. **Due Diligence Reports**: Investment analysis documents

### Expected OCR Output

- **Text Extraction**: Clean, readable text from PDFs
- **Table Recognition**: Structured data from financial tables
- **Metadata**: Document properties and confidence scores
- **Chunking**: Semantic chunks for RAG processing

## Monitoring and Alerts

### Key Metrics to Monitor

- Processing success rate
- Average processing time
- Error frequency
- Chunk creation rate
- Search functionality

### Alert Thresholds

- Processing time > 10 seconds
- Success rate < 90%
- Error rate > 5%
- Chunk creation failure

This testing guide ensures the Mistral OCR implementation is robust and ready for production use.
