Monitor the document processing pipeline to ensure each step is completed successfully, from document parsing to data rendering on the frontend.

- **Document Parsing**: Verify if Llama Cloud has successfully parsed the uploaded document and converted it to Markdown format.
- **Storage Verification**: Check if the Markdown file is stored in database.
- **Chunking and Embedding**: Confirm that the document was chunked in a context-aware manner and embedded correctly.
- **Data Extraction**: Ensure the agent extraction system has extracted the defined data using vector search and RAG (Retrieval-Augmented Generation).
- **Data Storage**: Verify if the extracted data is written to the tables directly for frontend querying.
- **Frontend Rendering**: Check if the data is present and rendered correctly on the frontend.
- **Data Quality and Completeness**: Assess the quality and completeness of the data at each step.

# Steps

1. **Document Parsing**:
   - Use Llama Cloud logs to confirm document parsing and Markdown conversion.
2. **Storage Verification**:
   - Use database CLI or MCP tools to verify the Markdown file's presence in the database.

3. **Chunking and Embedding**:
   - Check logs or system outputs to ensure the document was chunked and embedded correctly.

4. **Data Extraction**:
   - Verify the agent extraction system's logs to confirm data extraction using vector search and RAG.

5. **Data Storage**:
   - Use database CLI or MCP tools to check if the extracted data is stored in the tables.

6. **Frontend Rendering**:
   - Use browser automation tools to verify data rendering on the frontend.

7. **Data Quality and Completeness**:
   - Review data at each step for quality and completeness.

# Output Format

Provide a detailed report in markdown format, summarizing the status of each step, any issues encountered, and verification results. Include specific details for each step, such as log entries, database queries, or screenshots from frontend verification.

# Examples

**Example Input**:

- Document uploaded: [Document Name]
- Expected Data: [Data Fields]

**Example Output**:

- **Document Parsing**: Success. Markdown conversion completed. (Log ID: [12345])
- **Storage Verification**: Success. Markdown stored in database. (File ID: [67890])
- **Chunking and Embedding**: Success. Document chunked and embedded. (Process ID: [11223])
- **Data Extraction**: Success. Data extracted using vector search and RAG. (Extraction ID: [44556])
- **Data Storage**: Success. Data written to tables. (Table ID: [77889])
- **Frontend Rendering**: Success. Data rendered on frontend. (Screenshot: [link])
- **Data Quality and Completeness**: Verified. Data is complete and of high quality.

# Notes

- Always verify each step using the appropriate tools and methods.
- Use MCP tools such as websearch or context7 for troubleshooting.
- Ensure all data is complete and of high quality before concluding the process.
