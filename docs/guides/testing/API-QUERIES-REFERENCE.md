# VC Portfolio OS - API Queries Quick Reference

## 🚀 **Quick Start Commands**

```bash
# Run all tests
node test-api-validation.js && node test-frontend-data.js

# Run specific test
node test-api-validation.js

# Run with debug
DEBUG=true node test-api-queries.js
```

---

## 📋 **Complete API Queries List**

### **Core Document & Data (8 queries)**

| Query                       | Purpose                 | Returns                        | Usage                  |
| --------------------------- | ----------------------- | ------------------------------ | ---------------------- |
| `listDocuments`             | Get all user documents  | `[{_id, fileName, status}]`    | Document management    |
| `getDocument`               | Get specific document   | `{_id, content, metadata}`     | Document details       |
| `getAllFunds`               | Get all funds           | `[{_id, name, vintageYear}]`   | Fund overview          |
| `getAllPortfolioCompanies`  | Get portfolio companies | `{companies[], totalValue}`    | Portfolio page         |
| `getAllMetrics`             | Get fund metrics        | `{totalValue, commitments}`    | Dashboard              |
| `getPortfolioAggregation`   | Get portfolio overview  | `{funds[], totalCommitments}`  | Main dashboard         |
| `getAllFundReports`         | Get processed reports   | `[{_id, status, processedAt}]` | Report history         |
| `getTopPerformingCompanies` | Get top performers      | `[{name, performance}]`        | Performance highlights |

### **Intelligence (4 queries)**

| Query                       | Purpose                 | Returns                                 | Usage                  |
| --------------------------- | ----------------------- | --------------------------------------- | ---------------------- |
| `getAllTier2Intelligence`   | Get intelligence data   | `{coInvestors[], portfolioCompanies[]}` | Intelligence dashboard |
| `getAllTier3Analytics`      | Get analytics data      | `{analytics, predictions}`              | Advanced analytics     |
| `getCoInvestorIntelligence` | Get co-investor network | `{coInvestors[], networkData}`          | Network analysis       |
| `getMarketIntelligence`     | Get market insights     | `{trends[], opportunities[]}`           | Market analysis        |

### **Processing (3 queries)**

| Query                         | Purpose               | Returns                       | Usage                 |
| ----------------------------- | --------------------- | ----------------------------- | --------------------- |
| `getEnhancedHybridChunks`     | Get document chunks   | `[{content, type, tier}]`     | Document processing   |
| `getOCRProcessingStatus`      | Get OCR status        | `{status, progress, message}` | Processing monitoring |
| `getEnhancedProcessingStatus` | Get processing status | `{status, tier2Complete}`     | Pipeline status       |

### **Search & Discovery (2 queries)**

| Query                           | Purpose           | Returns                          | Usage                 |
| ------------------------------- | ----------------- | -------------------------------- | --------------------- |
| `searchDocumentsWithEmbeddings` | Semantic search   | `[{documentId, relevanceScore}]` | Document search       |
| `getNetworkGraphData`           | Get network graph | `{nodes[], edges[]}`             | Network visualization |

### **Portfolio Support (2 queries)**

| Query                  | Purpose                | Returns                        | Usage             |
| ---------------------- | ---------------------- | ------------------------------ | ----------------- |
| `getSupportActivities` | Get support activities | `[{activityId, type, status}]` | Support tracking  |
| `getSupportStats`      | Get support statistics | `{totalActivities, metrics}`   | Support dashboard |

### **Processing Progress (1 query)**

| Query             | Purpose          | Returns                            | Usage               |
| ----------------- | ---------------- | ---------------------------------- | ------------------- |
| `listAllProgress` | Get all progress | `[{documentId, status, progress}]` | Progress monitoring |

### **External Enrichment (1 query)**

| Query                 | Purpose               | Returns                    | Usage                 |
| --------------------- | --------------------- | -------------------------- | --------------------- |
| `getEnrichmentStatus` | Get enrichment status | `{status, enrichmentType}` | Enrichment monitoring |

---

## 🧪 **Test Files Overview**

### **`test-api-validation.js`**

- **Type**: Simulated API testing
- **Data**: Mock data with realistic patterns
- **Use Case**: Quick health check, deployment validation
- **Output**: System health report with performance metrics

### **`test-frontend-data.js`**

- **Type**: Browser automation testing
- **Data**: Real frontend rendering validation
- **Use Case**: UI functionality, data display verification
- **Output**: Frontend rendering report with data validation

### **`test-api-queries.js`**

- **Type**: Comprehensive API testing
- **Data**: Real Convex client testing
- **Use Case**: Complete system validation, production readiness
- **Output**: Detailed API performance and data quality report

---

## 📊 **Test Results Interpretation**

### **Status Codes**

- **✅ PASS**: Query working correctly, data present, good performance
- **⚠️ WARN**: Query working but with issues (empty data, slow response, missing fields)
- **❌ FAIL**: Query not working (errors, no data, timeout)

### **Performance Thresholds**

- **Fast**: < 100ms
- **Normal**: 100-500ms
- **Slow**: 500-1000ms
- **Very Slow**: > 1000ms

### **Data Quality Scores**

- **Excellent**: 0.8-1.0
- **Good**: 0.6-0.8
- **Fair**: 0.4-0.6
- **Poor**: < 0.4

---

## 🔧 **Common Issues & Solutions**

### **"Could not find public function"**

```bash
# Solution: Deploy Convex functions
npx convex dev
# or
npx convex deploy
```

### **"Connection refused"**

```bash
# Solution: Start development server
npm run dev
```

### **"Empty data returned"**

```bash
# Solution: Upload documents to populate database
# Go to Data Management page and upload a PDF
```

### **Frontend not rendering**

```bash
# Solution: Check browser console for errors
# Restart development server
npm run dev
```

---

## 📈 **Monitoring Dashboard**

### **Key Metrics to Track**

- **Success Rate**: Should be > 95%
- **Average Response Time**: Should be < 500ms
- **Data Quality Score**: Should be > 0.7
- **Error Rate**: Should be < 5%

### **Health Indicators**

- **🟢 EXCELLENT**: All systems optimal
- **🟡 GOOD**: Minor issues, mostly working
- **🟠 FAIR**: Some issues need attention
- **🔴 POOR**: Significant problems

---

## 🚀 **Quick Commands**

### **Run All Tests**

```bash
# Complete system test
node test-api-validation.js && node test-frontend-data.js && node test-api-queries.js
```

### **Run Specific Tests**

```bash
# API validation only
node test-api-validation.js

# Frontend testing only
node test-frontend-data.js

# Comprehensive API testing
node test-api-queries.js
```

### **Debug Mode**

```bash
# Enable verbose logging
DEBUG=true node test-api-queries.js

# Run with specific document ID
DOCUMENT_ID=k574bn0cx7544anfv6dxkwz0wn7s3fvt node test-api-queries.js
```

### **Environment Variables**

```bash
# Set Convex URL
VITE_CONVEX_URL=https://your-convex-url.convex.cloud

# Enable debug mode
DEBUG=true

# Set document ID for testing
DOCUMENT_ID=your-document-id
```

---

## 📚 **File Structure**

```
vc-os-convex/
├── test-api-validation.js      # Simulated API testing
├── test-frontend-data.js      # Frontend rendering tests
├── test-api-queries.js        # Comprehensive API tests
├── API-TESTING-DOCUMENTATION.md  # Complete documentation
├── API-QUERIES-REFERENCE.md   # This quick reference
└── API-QUERIES-ASSESSMENT.md  # System assessment report
```

---

## 🎯 **Next Steps**

1. **Run Tests**: Execute all test files to validate system
2. **Review Results**: Check for any warnings or failures
3. **Fix Issues**: Address any problems found in tests
4. **Monitor**: Set up regular testing schedule
5. **Update**: Keep tests current with system changes

---

_For detailed information, see `API-TESTING-DOCUMENTATION.md`_
