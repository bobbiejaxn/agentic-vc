Based on the article's insights and your current implementation, here's my recommended plan to improve your RAG system:

    Phase 1: Contextual Enrichment (Week 1)

    1. Modify chunk creation in document_processor.ts:
      - Add document-level context to each chunk (fund name, quarter, document type)
      - Include previous/next chunk summaries for continuity
      - Preserve section hierarchy in chunk metadata
    2. Create context generation function:
      - Use GPT-3.5-turbo to generate 50-100 word contexts for each chunk
      - Store both original and contextualized content
      - Add context generation as part of the chunking pipeline

    Phase 2: Hybrid Search Implementation (Week 2)

    1. Add BM25 index alongside vector search:
      - Implement BM25 scoring for keyword-based retrieval
      - Create compound index for company names, metrics, and key terms
      - Store BM25 tokens in chunk metadata
    2. Implement rank fusion:
      - Reciprocal rank fusion to combine vector and BM25 results
      - Adjustable weights based on query type
      - Return combined relevance scores

    Phase 3: Enhanced Chunking Strategy (Week 3)

    1. Improve chunking logic:
      - Add 10-15% overlap between consecutive chunks
      - Implement semantic boundary detection
      - Variable chunk sizes based on content type (500-2000 chars)
    2. Chunk relationship mapping:
      - Track parent-child relationships between chunks
      - Store chunk sequence information
      - Enable multi-chunk retrieval for complete context

    Phase 4: Query Processing Enhancement (Week 4)

    1. Query understanding pipeline:
      - Classify query intent (company vs fund level)
      - Extract temporal context from queries
      - Expand acronyms and financial terms
    2. Dynamic retrieval configuration:
      - Adjust k value based on query complexity
      - Set different thresholds for different chunk types
      - Implement fallback strategies for low-confidence results

    This phased approach will significantly improve retrieval accuracy while maintaining system performance and cost
    efficiency.

⏺ Update Todos
⎿ ☐ Phase 1: Add context generation function for chunk enrichment  
 ☐ Phase 1: Modify chunk creation to include document-level context
☐ Phase 1: Update chunk storage to handle contextualized content
☐ Phase 2: Implement BM25 indexing for keyword search
☐ Phase 2: Create rank fusion algorithm for hybrid search
☐ Phase 3: Add chunk overlap to preserve context continuity
☐ Phase 3: Implement semantic boundary detection for chunking
☐ Phase 4: Build query understanding pipeline
☐ Phase 4: Implement dynamic retrieval configuration

     ----

Building a Context-Aware RAG System
Aniket Hingane
Aniket Hingane

Following
Receive email notifications from Aniket Hingane.
Okay, got it

12 min read
·
1 day ago
42

Hands on : My Journey from Theory to Implementation

RAG System Architecture Overview
TL;DR
After diving deep into the world of Retrieval-Augmented Generation (RAG) systems, I’ve discovered that traditional RAG approaches often miss crucial context when splitting documents into chunks. In my experience, contextual retrieval — a technique that preserves context by enriching chunks with surrounding information — can reduce retrieval failures by up to 67%.

Through hands-on implementation using Python, LangChain, and vector databases, I’ve built a system that significantly outperforms vanilla RAG in accuracy and relevance. This blog walks you through my complete journey, from understanding the core concepts to implementing a production-ready contextual RAG system.

What This Article Is About
This comprehensive guide chronicles my journey building a contextual RAG system from scratch. I’ll walk you through every step of the process, from understanding why traditional RAG systems fall short to implementing a sophisticated solution that preserves context throughout the retrieval pipeline. You’ll learn about chunking strategies, embedding techniques, vector databases, and most importantly, how to implement contextual retrieval that dramatically improves system performance.

As per my experience working with various RAG implementations, the devil is truly in the details. I’ll share the code, the challenges I faced, and the lessons learned along the way. Whether you’re a seasoned AI engineer or just starting your journey with RAG systems, this article will provide you with practical insights and a working implementation you can build upon.

Why Read This Article
In my opinion, most RAG tutorials out there focus on the basic “hello world” implementations but skip the nuanced challenges that make or break real-world applications.

This article is different because:

Real-world implementation: I’ll show you actual code that handles the messy realities of document processing, not just toy examples
Performance-focused: Based on my testing, contextual retrieval can improve accuracy by 49–67% compared to traditional approaches
Complete pipeline: From data ingestion to query processing, I’ll cover every component you need for a production system
Practical insights: I’ll share the gotchas, optimizations, and trade-offs I’ve discovered through hands-on experience
The Problem
Traditional RAG systems face a fundamental challenge that I’ve encountered repeatedly in my projects: context fragmentation. When documents are split into chunks for efficient retrieval, critical contextual information gets lost. Let me illustrate this with a real example I faced:

Consider a financial document containing: “The company’s revenue grew by 3% over the previous quarter.”

In a traditional RAG system, this chunk might be retrieved for a query about “ACME Corp revenue growth,” but without context, the system doesn’t know:

Which company this refers to
What time period we’re discussing
What the baseline revenue was
How this fits into the broader financial picture
This context loss leads to several problems I’ve observed:

Inaccurate retrievals: The system fetches chunks that seem relevant but lack necessary context
Incomplete answers: Generated responses miss crucial details because the retrieval step failed
Hallucinations: The LLM tries to fill in missing context, sometimes incorrectly
Poor user experience: Users receive generic or irrelevant responses
From my experience, these issues become exponentially worse as your knowledge base grows. What works fine with a few hundred documents completely breaks down when you’re dealing with thousands of complex, interconnected documents.

Contextual Retrieval Process Flow
The Solution: Contextual Retrieval
After extensive research and experimentation, I’ve found that contextual retrieval offers a elegant solution to the context fragmentation problem. The core idea is brilliantly simple yet powerful: instead of embedding raw chunks, we first enrich each chunk with relevant context from the surrounding document.

Here’s how it works in practice:

Original chunk: “The company’s revenue grew by 3% over the previous quarter.”

Contextualized chunk: “This chunk is from an SEC filing on ACME Corp’s Q2 2023 performance; the previous quarter’s revenue was $314 million. The company’s revenue grew by 3% over the previous quarter.”

The magic happens through two key techniques I’ve implemented:

1. Contextual Embeddings
   Before creating vector embeddings, I use an LLM to generate contextual information for each chunk. This ensures that the semantic meaning captured in the embedding includes both the content and its broader context.

2. Contextual BM25
   I enhance traditional keyword-based search (BM25) with the same contextual information, improving exact match retrieval for specific terms and entities.

In my testing, this approach has delivered impressive results:

49% reduction in failed retrievals with contextual embeddings alone
67% reduction when combined with reranking techniques
25% improvement in precision for complex queries
Why You Can’t Miss This
I think the AI landscape is rapidly evolving, and contextual retrieval represents a fundamental shift in how we approach information retrieval. Here’s why I believe this is crucial for anyone building RAG systems:

Competitive Advantage
Companies implementing contextual retrieval are seeing significant improvements in customer satisfaction and operational efficiency. For instance, major hospital networks using contextual RAG in clinical decision support systems report 30% fewer misdiagnoses and 25% less time spent reviewing literature.

Future-Proof Architecture
As per my experience, the principles of contextual retrieval align with how humans naturally process information. This approach is more likely to remain relevant as AI systems become more sophisticated.

Measurable Impact
Unlike many AI improvements that are hard to quantify, contextual retrieval delivers measurable performance gains that directly translate to business value.

Let’s Understand the Design
Building an effective contextual RAG system requires careful consideration of several architectural components. In my implementation, I’ve focused on creating a modular, scalable design that can handle real-world complexity.

Core Architecture Components

1. Document Preprocessing Pipeline

Document ingestion and format standardization
Intelligent chunking strategies (I’ll detail these below)
Metadata extraction and enrichment 2. Contextual Enhancement Engine

LLM-powered context generation
Template-based context formatting
Context validation and quality checks 3. Dual Retrieval System

Vector database for semantic search
BM25 index for keyword matching
Hybrid search with rank fusion 4. Query Processing Pipeline

Query understanding and expansion
Multi-stage retrieval with reranking
Response generation with source attribution
Chunking Strategies I’ve Tested
Through my experiments, I’ve found that the chunking strategy significantly impacts retrieval quality. Here are the approaches I’ve evaluated:

Fixed-size Chunking: Simple but often breaks semantic boundaries
Semantic Chunking: Preserves meaning but can create inconsistent chunk sizes
Hybrid Approach: My preferred method that balances semantic coherence with manageable chunk sizes

def hybrid_chunking(document, max_chunk_size=512, overlap=50):
"""
Intelligent chunking that respects semantic boundaries
while maintaining reasonable chunk sizes
""" # Detect paragraph boundaries
paragraphs = document.split('\n\n')
chunks = []
current_chunk = ""

    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) <= max_chunk_size:
            current_chunk += paragraph + '\n\n'
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = paragraph + '\n\n'

    if current_chunk:
        chunks.append(current_chunk.strip())

    # Add overlap between chunks for better context
    return add_overlap(chunks, overlap)

Context Generation Process
The heart of contextual retrieval lies in generating meaningful context for each chunk. I’ve developed a systematic approach:

def generate_context(chunk, full_document, chunk_index):
"""
Generate contextual information for a given chunk
"""
context_prompt = f"""
<document>
{full_document}
</document>

    Here is the chunk we want to situate within the whole document:

    <chunk>
    {chunk}
    </chunk>

    Please provide a short, succinct context to situate this chunk
    within the overall document for improved search retrieval.
    Answer only with the context and nothing else.
    """

    # Use LLM to generate context
    context = llm.generate(context_prompt)

    # Combine context with original chunk
    contextualized_chunk = f"{context}\n\n{chunk}"

    return contextualized_chunk

Real-World Use Cases
Based on my experience and research, contextual RAG systems excel in several domains where traditional approaches struggle:

Customer Support Automation
Companies like Shopify have implemented contextual RAG in their customer support chatbots, resulting in more accurate responses that consider user history, product context, and support ticket details. The system can pull relevant information from knowledge bases, order histories, and product catalogs to provide comprehensive support.

Financial Services
JPMorgan Chase uses RAG-based systems for fraud detection and risk assessment, where contextual information about transaction patterns, user behavior, and market conditions is crucial for accurate decision-making. The system continuously retrieves and analyzes real-time data to monitor transactions and detect potential fraud.

Healthcare and Medical Research
In my view, healthcare represents one of the most compelling use cases for contextual RAG. Hospital networks using these systems report significant improvements in clinical decision support, with 30% reduction in misdiagnoses and 40% increase in early detection of rare diseases6. The system connects to electronic health records and medical databases to provide doctors with relevant, contextual information.

Enterprise Knowledge Management
Companies like Siemens and Morgan Stanley have deployed contextual RAG systems for internal knowledge management, allowing employees to quickly access and synthesize information from vast repositories of documents, policies, and technical manuals. The contextual approach ensures that retrieved information is relevant to the user’s specific role and current task.

E-commerce and Personalization
Amazon’s recommendation systems leverage contextual RAG techniques to provide personalized product suggestions based on user behavior, purchase history, and contextual factors like season, location, and browsing patterns. This results in more relevant recommendations and improved user engagement.

Implementation Deep Dive
Now, let me walk you through the complete implementation of a contextual RAG system. I’ll share the actual code I’ve developed and tested:

Setting Up the Environment

# Required dependencies

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
import openai
from rank_bm25 import BM25Okapi
import asyncio
from typing import List, Dict, Any
Document Processing Pipeline
class DocumentProcessor:
def **init**(self, embedding_model='all-MiniLM-L6-v2'):
self.embedding_model = SentenceTransformer(embedding_model)
self.llm = openai.OpenAI() # Configure with your API key

    def load_documents(self, file_paths: List[str]) -> List[Dict]:
        """Load documents from various formats"""
        documents = []
        for file_path in file_paths:
            if file_path.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
                docs = loader.load()
                documents.extend(docs)
        return documents

    def intelligent_chunking(self, document: str,
                           max_chunk_size: int = 512) -> List[str]:
        """
        Intelligent chunking that preserves semantic boundaries
        """
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=max_chunk_size,
            chunk_overlap=50,
            length_function=len,
            separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""]
        )

        chunks = splitter.split_text(document)
        return chunks

    async def generate_context(self, chunk: str,
                             full_document: str) -> str:
        """
        Generate contextual information for a chunk
        """
        prompt = f"""
        <document>
        {full_document[:3000]}  # Truncate for token limits
        </document>

        Here is the chunk we want to situate within the whole document:

        <chunk>
        {chunk}
        </chunk>

        Please give a short succinct context to situate this chunk
        within the overall document for the purposes of improving
        search retrieval of the chunk. Answer only with the succinct
        context and nothing else.
        """

        response = await self.llm.acompletion(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
            temperature=0.1
        )

        context = response.choices[0].message.content.strip()
        return f"{context}\n\n{chunk}"

    async def process_document(self, document: str) -> List[Dict]:
        """
        Process a document with contextual enrichment
        """
        # Step 1: Chunk the document
        chunks = self.intelligent_chunking(document)

        # Step 2: Generate context for each chunk
        contextualized_chunks = []
        for i, chunk in enumerate(chunks):
            context_chunk = await self.generate_context(chunk, document)
            contextualized_chunks.append({
                'original_chunk': chunk,
                'contextualized_chunk': context_chunk,
                'chunk_id': i,
                'document_id': hash(document)  # Simple document ID
            })

        return contextualized_chunks

Vector Database and Retrieval System
class ContextualRetriever:
def **init**(self, collection_name: str = "contextual_rag"):
self.client = chromadb.Client()
self.collection = self.client.create_collection(
name=collection_name,
metadata={"hnsw:space": "cosine"}
)
self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
self.bm25_index = None
self.chunk_mapping = {}

    def index_documents(self, processed_chunks: List[Dict]):
        """
        Index processed chunks in both vector and BM25 indices
        """
        embeddings = []
        documents = []
        metadatas = []
        ids = []
        bm25_corpus = []

        for chunk_data in processed_chunks:
            chunk_id = f"{chunk_data['document_id']}_{chunk_data['chunk_id']}"
            contextualized_text = chunk_data['contextualized_chunk']

            # Generate embedding
            embedding = self.embedding_model.encode(contextualized_text)
            embeddings.append(embedding.tolist())

            # Prepare for vector database
            documents.append(contextualized_text)
            ids.append(chunk_id)
            metadatas.append({
                'original_chunk': chunk_data['original_chunk'],
                'document_id': str(chunk_data['document_id']),
                'chunk_id': chunk_data['chunk_id']
            })

            # Prepare for BM25
            bm25_corpus.append(contextualized_text.split())
            self.chunk_mapping[chunk_id] = chunk_data

        # Index in vector database
        self.collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

        # Build BM25 index
        self.bm25_index = BM25Okapi(bm25_corpus)

    def hybrid_search(self, query: str, k: int = 10) -> List[Dict]:
        """
        Perform hybrid search combining vector and BM25 retrieval
        """
        # Vector search
        query_embedding = self.embedding_model.encode(query)
        vector_results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=k
        )

        # BM25 search
        bm25_scores = self.bm25_index.get_scores(query.split())
        bm25_results = []

        # Get top k BM25 results
        top_indices = np.argsort(bm25_scores)[-k:][::-1]
        for idx in top_indices:
            chunk_id = list(self.chunk_mapping.keys())[idx]
            bm25_results.append({
                'id': chunk_id,
                'score': bm25_scores[idx],
                'document': self.chunk_mapping[chunk_id]['contextualized_chunk']
            })

        # Combine and rerank results
        combined_results = self.combine_results(vector_results, bm25_results)
        return combined_results

    def combine_results(self, vector_results: Dict,
                       bm25_results: List[Dict]) -> List[Dict]:
        """
        Combine vector and BM25 results using rank fusion
        """
        # Implement reciprocal rank fusion
        combined_scores = {}

        # Process vector results
        for i, doc_id in enumerate(vector_results['ids'][0]):
            combined_scores[doc_id] = 1 / (i + 1)

        # Process BM25 results
        for i, result in enumerate(bm25_results):
            doc_id = result['id']
            if doc_id in combined_scores:
                combined_scores[doc_id] += 1 / (i + 1)
            else:
                combined_scores[doc_id] = 1 / (i + 1)

        # Sort by combined score
        sorted_results = sorted(
            combined_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        # Return formatted results
        final_results = []
        for doc_id, score in sorted_results:
            if doc_id in self.chunk_mapping:
                final_results.append({
                    'id': doc_id,
                    'score': score,
                    'original_chunk': self.chunk_mapping[doc_id]['original_chunk'],
                    'contextualized_chunk': self.chunk_mapping[doc_id]['contextualized_chunk']
                })

        return final_results

Query Processing and Answer Generation
class ContextualRAGSystem:
def **init**(self):
self.processor = DocumentProcessor()
self.retriever = ContextualRetriever()
self.llm = openai.OpenAI()

    async def process_documents(self, file_paths: List[str]):
        """Process and index documents"""
        documents = self.processor.load_documents(file_paths)

        all_chunks = []
        for doc in documents:
            chunks = await self.processor.process_document(doc.page_content)
            all_chunks.extend(chunks)

        self.retriever.index_documents(all_chunks)

    def query(self, question: str, k: int = 5) -> Dict[str, Any]:
        """
        Process a query and generate an answer
        """
        # Retrieve relevant chunks
        relevant_chunks = self.retriever.hybrid_search(question, k)

        # Prepare context for the LLM
        context = "\n\n".join([
            f"Source {i+1}: {chunk['original_chunk']}"
            for i, chunk in enumerate(relevant_chunks)
        ])

        # Generate answer
        prompt = f"""
        Based on the following context information, please answer the question.
        If the answer cannot be found in the context, please say so.

        Context:
        {context}

        Question: {question}

        Answer:
        """

        response = self.llm.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.1
        )

        answer = response.choices[0].message.content

        return {
            'answer': answer,
            'sources': relevant_chunks,
            'context': context
        }

# Usage example

async def main():
rag_system = ContextualRAGSystem()

    # Process documents
    await rag_system.process_documents(['nutrition_textbook.pdf'])

    # Query the system
    result = rag_system.query("What are the main macronutrients and their functions?")

    print("Answer:", result['answer'])
    print("\nSources used:", len(result['sources']))

# Run the system

# asyncio.run(main())

Performance Optimization and Monitoring
class PerformanceMonitor:
def **init**(self):
self.metrics = {
'precision_at_k': [],
'recall_at_k': [],
'response_time': [],
'context_relevance': []
}

    def evaluate_retrieval(self, query: str, retrieved_chunks: List[Dict],
                          ground_truth: List[str]) -> Dict[str, float]:
        """
        Evaluate retrieval performance
        """
        # Calculate precision at k
        relevant_retrieved = len(set(retrieved_chunks) & set(ground_truth))
        precision = relevant_retrieved / len(retrieved_chunks) if retrieved_chunks else 0

        # Calculate recall at k
        recall = relevant_retrieved / len(ground_truth) if ground_truth else 0

        # Calculate contextual relevance score
        contextual_score = self.calculate_contextual_relevance(
            query, retrieved_chunks
        )

        return {
            'precision_at_k': precision,
            'recall_at_k': recall,
            'contextual_relevance': contextual_score
        }

    def calculate_contextual_relevance(self, query: str,
                                     chunks: List[Dict]) -> float:
        """
        Calculate how well chunks match the query context
        """
        # Implement semantic similarity scoring
        similarity_scores = []
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

        query_embedding = embedding_model.encode(query)

        for chunk in chunks:
            chunk_embedding = embedding_model.encode(chunk['original_chunk'])
            similarity = np.dot(query_embedding, chunk_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(chunk_embedding)
            )
            similarity_scores.append(similarity)

        return np.mean(similarity_scores) if similarity_scores else 0.0

Traditional RAG vs Contextual RAG Performance Comparison
Closing Thoughts
Through my journey building this contextual RAG system, I’ve gained deep appreciation for the complexity and potential of modern information retrieval. The shift from traditional keyword-based search to context-aware, semantic understanding represents a fundamental evolution in how we interact with information.

In my experience, the key to success with contextual RAG lies not just in the technical implementation, but in understanding the specific needs of your domain and users. The system I’ve built performs exceptionally well on technical documents and structured information, but I’ve found that different document types require different approaches to chunking and context generation.

I think the most exciting aspect of this technology is its potential for democratizing access to complex information. When implemented thoughtfully, contextual RAG systems can make expert knowledge accessible to non-experts, accelerate research and decision-making, and bridge the gap between human intuition and machine processing power.

The performance improvements I’ve achieved — 49–67% reduction in failed retrievals — translate to real business value. Users spend less time searching for information, get more accurate answers, and can focus on higher-value tasks. As per my experience, this efficiency gain compounds over time, leading to significant organizational benefits.

Looking ahead, I believe contextual retrieval will become the standard approach for RAG systems. The techniques I’ve outlined here represent current best practices, but the field is evolving rapidly. I’m particularly excited about developments in multimodal retrieval, where we can apply similar contextual principles to images, videos, and other media types.

I encourage you to experiment with the code and concepts I’ve shared. Start with a small document collection and gradually scale up as you become comfortable with the implementation. Pay attention to the quality of your context generation — it’s often the difference between a good system and a great one.

Consider the specific challenges in your domain:

What types of documents do you need to process?
What kinds of queries do your users typically ask?
How can you measure success in your specific use case?
I’d love to hear about your experiences implementing contextual RAG systems. What challenges have you encountered? Where have you seen the biggest improvements? The community of practitioners working on these problems is still relatively small, and sharing our experiences benefits everyone.

Remember, the goal isn’t to build the most sophisticated system possible, but to create something that genuinely improves how people interact with information. As I’ve learned through my own implementation journey, the best RAG system is the one that disappears into the background, allowing users to focus on their work rather than struggling with search and retrieval.

The future of information access is contextual, intelligent, and human-centered. I believe the techniques we’ve explored here are just the beginning of what’s possible when we combine the best of human understanding with machine capability. The journey continues, and I’m excited to see where it leads.

If you found this guide helpful, consider sharing it with others who might benefit from understanding contextual RAG systems. The field advances when we all contribute to the collective knowledge, and I believe that open sharing of techniques and insights is essential for continued progress.

Rags
Genai
Gen Ai For Business
AI
