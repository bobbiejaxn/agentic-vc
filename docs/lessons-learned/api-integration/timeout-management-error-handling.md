### Title

External API Integration: Timeout Management and Robust Error Handling in Serverless Functions

### Issue

When implementing Mistral OCR and OpenAI enhanced processing, encountered multiple integration challenges:

- API timeouts causing incomplete document processing
- Inconsistent error responses from external services
- Lack of retry logic for transient failures
- Poor error visibility for debugging and user feedback
- Environment variable management for API keys

### Root Cause

External API integrations in serverless environments have unique challenges:

1. **Timeout Constraints**: Serverless functions have execution time limits (Convex: 60-120 seconds)
2. **Network Reliability**: External API calls can fail due to network issues, rate limits, or service downtime
3. **Error Response Variability**: Different APIs return errors in different formats
4. **State Management**: Failed operations need proper cleanup and retry mechanisms
5. **Security**: API keys must be handled securely and validated before use

### Solution / Fix

1. **Environment Validation**: Pre-validate API keys and configuration
2. **Timeout Management**: Implement appropriate timeouts for each API call
3. **Comprehensive Error Handling**: Catch and categorize different error types
4. **Retry Logic**: Implement exponential backoff for transient failures
5. **Progress Tracking**: Update progress at each stage for visibility
6. **Error Reporting**: Provide detailed error information for debugging

```typescript
// Environment validation
const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// Timeout-managed API call with comprehensive error handling
const ocrResponse = await mistral.ocr.process({
  model: "mistral-ocr-latest",
  document: {
    type: "image_url",
    imageUrl: `data:${mimeType};base64,${base64File}`,
  },
});

// Enhanced processing with timeout and error handling
const enhancedResponse = await Promise.race([
  openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert financial document analyst...",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this document and extract intelligence:\n\n${fullText}`,
          },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 4000,
  }),
  new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("OpenAI API timeout after 45 seconds")),
      45000
    )
  ),
]);

// Error categorization and handling
try {
  const result = await externalAPICall();
  return result;
} catch (error) {
  console.error("API call failed:", error);

  // Categorize error type
  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      throw new Error("API rate limit exceeded. Please try again later.");
    } else if (error.status >= 500) {
      throw new Error(
        "External API service unavailable. Please try again later."
      );
    } else if (error.status === 401) {
      throw new Error(
        "API authentication failed. Check API key configuration."
      );
    }
  } else if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      throw new Error(
        "Processing timeout. Document may be too large or complex."
      );
    }
  }

  throw new Error(
    `Processing failed: ${error instanceof Error ? error.message : "Unknown error"}`
  );
}

// Retry logic with exponential backoff
async function retryAPICall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // Final attempt failed, rethrow error
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(
        `API call failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("All retry attempts failed");
}
```

### Lessons Learned

- **Environment Validation is Critical**: Validate API keys and configuration before making API calls, not during error handling
- **Timeout Management is Essential**: Serverless environments have strict time limits - implement appropriate timeouts for each API call
- **Error Categorization Improves UX**: Different error types need different user messages and handling strategies
- **Retry Logic for Transient Failures**: Network issues and temporary service problems can be resolved with exponential backoff
- **Comprehensive Logging**: Detailed error logs are crucial for debugging external API integration issues
- **Universal Application**: These patterns apply to any external API integration:
  - Payment processing services
  - Email/SMS providers
  - Cloud storage services
  - Authentication providers
  - Third-party data sources
  - Machine learning APIs

- **Graceful Degradation**: When external APIs fail, provide alternative functionality or clear user guidance
- **Rate Limit Awareness**: Respect API rate limits and implement proper queuing for high-volume operations
- **Cost Monitoring**: Track API usage to prevent unexpected costs and implement usage limits
- **Security First**: Never expose API keys in client-side code or logs; use secure environment variable management
- **Testing Strategy**: Mock external APIs for development and testing to avoid dependency on external services
