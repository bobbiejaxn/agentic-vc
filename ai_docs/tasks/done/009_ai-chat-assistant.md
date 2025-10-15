# Task: AI Chat Assistant Implementation

## 1. Strategic Analysis & Solution Options

### 1.1 Problem Definition

**Current State**: The VC Portfolio OS has basic AI processing capabilities (Mistral OCR + OpenAI enhanced processing) but lacks an interactive AI chat interface that allows users to ask questions about their portfolio, get insights, and receive assistance with investment analysis using their uploaded documents as context.

**Desired State**: Implement a sophisticated AI chat assistant that leverages the existing Convex database and processed document intelligence to provide users with intelligent conversational access to their portfolio data, investment insights, and document analysis capabilities.

### 1.2 Solution Options Analysis

#### Option 1: Basic Chat Interface with Simple RAG

**Approach**: Implement a simple chat interface using basic Retrieval-Augmented Generation (RAG) with the existing vector search capabilities.

**Pros**:

- Quick implementation time
- Uses existing infrastructure
- Lower development cost
- Easy to maintain
- Good for basic Q&A

**Cons**:

- Limited conversational capabilities
- Basic context management
- No advanced reasoning
- Limited multi-turn conversations
- Simple user experience

**Technical Requirements**:

- OpenAI API integration for chat completion
- Vector search using existing Convex indexes
- Basic conversation history storage
- Simple message formatting and display
- Basic error handling

#### Option 2: Advanced Conversational AI with Context Management

**Approach**: Implement a sophisticated chat assistant with advanced context management, multi-modal capabilities, and intelligent conversation flow.

**Pros**:

- Rich conversational experience
- Advanced context understanding
- Multi-modal document analysis
- Intelligent conversation flow
- Better user engagement

**Cons**:

- Higher development complexity
- More expensive API usage
- Complex state management
- Higher maintenance overhead
- Requires careful prompt engineering

**Technical Requirements**:

- Advanced OpenAI API usage (function calling, streaming)
- Sophisticated context management system
- Multi-modal processing (text, charts, documents)
- Complex conversation state tracking
- Advanced error handling and fallbacks

#### Option 3: Hybrid Agentic System with Multiple AI Capabilities (RECOMMENDED)

**Approach**: Implement a comprehensive AI assistant that combines chat, document analysis, investment insights, and proactive assistance in a unified conversational interface.

**Pros**:

- Most comprehensive user experience
- Leverages all existing AI capabilities
- Proactive assistance capabilities
- Multi-modal interaction
- Extensible for future features

**Cons**:

- Highest development complexity
- Most expensive option
- Complex integration requirements
- Requires extensive testing
- Potential performance challenges

**Technical Requirements**:

- Multi-agent architecture
- Advanced context management
- Real-time data streaming
- Complex conversation orchestration
- Performance optimization

### 1.3 Recommended Solution

**Selected Approach**: Option 3 - Hybrid Agentic System with Multiple AI Capabilities

**Rationale**:

- Provides the most value to users
- Leverages existing investments in AI infrastructure
- Creates differentiated user experience
- Supports complex investment workflows
- Extensible platform for future AI features

**Implementation Strategy**:

- Start with core chat functionality using existing vector search
- Add advanced context management and conversation memory
- Integrate document analysis and portfolio insights
- Implement proactive assistance and recommendations
- Add multi-modal capabilities and advanced features

## 2. Project Analysis & Current State

### 2.1 Current Application State

#### Existing AI Infrastructure Analysis

```typescript
// Current AI capabilities from package.json
{
  "@mistralai/mistralai": "^1.10.0",  // OCR processing
  "openai": "^6.0.0"                   // Enhanced processing + chat
}

// Current Convex AI schema (partial)
interface ChatMessages {
  _id: Id<"chatMessages">;
  userId: Id<"users">;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface EnhancedHybridChunks {
  _id: Id<"enhancedHybridChunks">;
  documentId: Id<"documents">;
  content: string;
  embedding: number[];
  tierClassification: 'tier1' | 'tier2' | 'tier3';
  metadata: Record<string, any>;
}

interface Tier3Analytics {
  _id: Id<"tier3Analytics">;
  documentId: Id<"documents">;
  chunkId: Id<"enhancedHybridChunks">;
  // 100+ fields of advanced analytics including network data, market intelligence, etc.
}
```

#### Current AI Capabilities

- **OCR Processing**: Mistral API for document text extraction
- **Enhanced Processing**: OpenAI for document analysis and chunking
- **Vector Embeddings**: OpenAI embeddings for semantic search
- **3-Tier Intelligence**: Tiered extraction system (metrics, strategic intel, advanced analytics)
- **Basic Chat**: Simple chat message storage (limited functionality)

#### Identified Gaps

- No interactive chat interface
- Limited conversational capabilities
- No context management across conversations
- No integration with portfolio data for insights
- No proactive assistance capabilities
- No multi-modal interaction (text + visualizations)

### 2.2 Technical Requirements Analysis

#### Required AI Capabilities

1. **Conversational AI**
   - Multi-turn conversations with context
   - Intelligent conversation flow management
   - Context-aware responses
   - Personality and tone customization
   - Follow-up question generation

2. **Document Intelligence Integration**
   - RAG using existing vector search
   - Document-specific Q&A capabilities
   - Cross-document analysis
   - Summary and insight generation
   - Citation and source attribution

3. **Portfolio Intelligence**
   - Investment analysis using portfolio data
   - Performance insights and recommendations
   - Market trend analysis
   - Risk assessment capabilities
   - Opportunity identification

4. **Proactive Assistance**
   - Insight notifications
   - Trend alerts
   - Recommendation engine
   - Automated analysis triggers
   - Personalized suggestions

#### Required Technical Components

- **Conversation Management**: Complex state management for conversations
- **Context Engine**: Advanced context management and retrieval
- **AI Orchestration**: Multi-agent coordination
- **Streaming Interface**: Real-time response streaming
- **Error Handling**: Robust error handling and fallbacks

### 2.3 Dependencies and Prerequisites

#### Existing Dependencies (from package.json)

```json
{
  "dependencies": {
    "openai": "^6.0.0",
    "@mistralai/mistralai": "^1.10.0",
    "convex": "^1.24.2",
    "react": "^19.0.0",
    "react-markdown": "^10.1.0",
    "lucide-react": "^0.544.0"
  }
}
```

#### Additional Dependencies Needed

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-toast": "^1.2.15",
    "framer-motion": "^10.16.4",
    "react-intersection-observer": "^9.5.2",
    "date-fns": "^2.30.0",
    "clsx": "^2.1.1",
    "sonner": "^2.0.3"
  }
}
```

## 3. Technical Requirements & Specifications

### 3.1 Functional Requirements

#### Core Features

1. **Interactive Chat Interface**
   - Real-time message streaming
   - Message history and conversation persistence
   - Rich text and markdown support
   - File attachment and document reference
   - Typing indicators and read receipts

2. **Context-Aware Responses**
   - Conversation memory and context management
   - Portfolio data integration for personalized responses
   - Document context using RAG with existing vector search
   - User preference and interaction history learning
   - Multi-turn conversation understanding

3. **Document Intelligence**
   - Ask questions about uploaded documents
   - Cross-document analysis and comparison
   - Document summarization and key insights
   - Citation and source attribution
   - Visual data extraction and analysis

4. **Portfolio Intelligence**
   - Investment performance analysis
   - Risk assessment and recommendations
   - Market trend analysis and insights
   - Portfolio optimization suggestions
   - Competitive landscape analysis

5. **Proactive Assistance**
   - Insight notifications and alerts
   - Trend and opportunity identification
   - Automated report generation
   - Personalized recommendations
   - Action item suggestions

#### Advanced Features

1. **Multi-Modal Interaction**
   - Chart and graph generation in responses
   - Interactive data visualizations
   - Document preview and highlighting
   - Image analysis and interpretation
   - Table and structured data extraction

2. **Collaboration Features**
   - Shared conversations with team members
   - Insight sharing and annotation
   - Collaborative analysis sessions
   - Threaded discussions
   - Team knowledge base integration

3. **Personalization**
   - Custom AI personality and tone
   - User preference learning
   - Specialized domain knowledge
   - Custom prompt templates
   - Personalized insight thresholds

### 3.2 Data Model Requirements

#### Chat Schema Extensions

```typescript
// Enhanced chat conversations table
interface ChatConversations {
  _id: Id<"chatConversations">;
  userId: Id<"users">;
  title: string;
  status: "active" | "archived" | "shared";
  context: {
    portfolioContext?: PortfolioContext;
    documentContext?: DocumentContext[];
    userPreferences?: UserPreferences;
  };
  metadata: {
    messageCount: number;
    lastActivity: number;
    tags?: string[];
    category?: string;
  };
  createdAt: number;
  updatedAt: number;
}

// Enhanced chat messages table
interface ChatMessages {
  _id: Id<"chatMessages">;
  conversationId: Id<"chatConversations">;
  userId: Id<"users">;
  role: "user" | "assistant" | "system";
  content: string;
  contentType: "text" | "markdown" | "chart" | "table" | "image";
  attachments?: MessageAttachment[];
  citations?: Citation[];
  metadata: {
    tokens?: number;
    processingTime?: number;
    model?: string;
    temperature?: number;
    confidence?: number;
  };
  reactions?: MessageReaction[];
  threadId?: string;
  createdAt: number;
}

// Message attachments
interface MessageAttachment {
  id: string;
  type: "document" | "chart" | "image" | "data";
  name: string;
  url?: string;
  data?: any;
  metadata?: Record<string, any>;
}

// Citations for sources
interface Citation {
  id: string;
  source: {
    type: "document" | "portfolio_data" | "external";
    id: string;
    title: string;
    snippet: string;
    url?: string;
  };
  confidence: number;
  relevanceScore: number;
}

// AI context cache for performance
interface AIContextCache {
  _id: Id<"aiContextCache">;
  userId: Id<"users">;
  contextType: "portfolio" | "document" | "conversation";
  contextKey: string;
  contextData: any;
  embeddings?: number[];
  expiresAt: number;
  createdAt: number;
}

// AI insights and recommendations
interface AIInsights {
  _id: Id<"aiInsights">;
  userId: Id<"users">;
  type:
    | "portfolio_performance"
    | "risk_alert"
    | "opportunity"
    | "trend"
    | "recommendation";
  title: string;
  description: string;
  confidence: number;
  priority: "low" | "medium" | "high" | "critical";
  data?: any;
  actionItems?: string[];
  status: "new" | "viewed" | "acted_upon" | "dismissed";
  expiresAt: number;
  createdAt: number;
}
```

#### Context Management Types

```typescript
interface PortfolioContext {
  totalValue: number;
  companies: CompanySummary[];
  recentPerformance: PerformanceMetrics;
  riskProfile: RiskProfile;
  investmentStrategy: string;
  focusAreas: string[];
}

interface DocumentContext {
  documentId: Id<"documents">;
  title: string;
  type: string;
  keyInsights: string[];
  relevantSections: string[];
  lastAnalyzed: number;
}

interface UserPreferences {
  aiPersonality: "professional" | "friendly" | "analytical" | "concise";
  focusAreas: string[];
  notificationThresholds: {
    performance: number;
    risk: number;
    opportunities: number;
  };
  responseStyle: "detailed" | "concise" | "bullets" | "narrative";
  dataVisualization: boolean;
  proactiveInsights: boolean;
}
```

### 3.3 API Specifications

#### Required Convex Functions

```typescript
// Chat conversation management
export const createConversation = mutation({
  args: {
    title: v.string(),
    context: v.optional(
      v.object({
        portfolioContext: v.optional(v.any()),
        documentIds: v.optional(v.array(v.id("documents"))),
        userPreferences: v.optional(v.any()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Create new chat conversation with initial context
  },
});

export const getConversation = query({
  args: {
    conversationId: v.id("chatConversations"),
    includeMessages: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get conversation with optional message history
  },
});

export const getUserConversations = query({
  args: {
    status: v.optional(
      v.union(v.literal("active"), v.literal("archived"), v.literal("shared"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get user's conversations with filtering
  },
});

// Message handling
export const sendMessage = mutation({
  args: {
    conversationId: v.id("chatConversations"),
    content: v.string(),
    attachments: v.optional(v.array(v.any())),
    contextOverride: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Process user message and generate AI response
    // This will call the AI orchestration service
  },
});

export const streamMessageResponse = action({
  args: {
    conversationId: v.id("chatConversations"),
    messageId: v.id("chatMessages"),
    context: v.any(),
  },
  handler: async (ctx, args) => {
    // Stream AI response using OpenAI streaming API
  },
});

// Context and intelligence
export const getConversationContext = query({
  args: {
    conversationId: v.id("chatConversations"),
    includePortfolio: v.optional(v.boolean()),
    includeDocuments: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Build comprehensive context for AI responses
  },
});

export const searchDocumentsForContext = query({
  args: {
    query: v.string(),
    conversationId: v.id("chatConversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Search documents using existing vector search
    // Return relevant chunks for context
  },
});

export const generatePortfolioInsights = query({
  args: {
    userId: v.id("users"),
    insightTypes: v.optional(v.array(v.string())),
    timeRange: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate AI-powered portfolio insights
  },
});

// AI orchestration
export const orchestrateAIResponse = action({
  args: {
    conversationId: v.id("chatConversations"),
    userMessage: v.string(),
    context: v.any(),
    tools: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Main AI orchestration function
    // Determines which AI capabilities to use
    // Coordinates multiple AI calls if needed
  },
});

// Insights and recommendations
export const getAIInsights = query({
  args: {
    userId: v.id("users"),
    types: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("viewed"),
        v.literal("acted_upon"),
        v.literal("dismissed")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get AI-generated insights for user
  },
});

export const dismissInsight = mutation({
  args: {
    insightId: v.id("aiInsights"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Mark insight as dismissed
  },
});
```

## 4. Implementation Plan

### 4.1 Phase 1: Core Chat Infrastructure (Week 1-3)

#### 4.1.1 File Structure Setup

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ConversationList.tsx
│   │   ├── ChatSidebar.tsx
│   │   └── TypingIndicator.tsx
│   ├── ai/
│   │   ├── AIAvatar.tsx
│   │   ├── InsightCard.tsx
│   │   ├── SuggestedQuestions.tsx
│   │   └── ProactiveInsights.tsx
│   └── ui/
│       ├── MarkdownRenderer.tsx
│       ├── ChartRenderer.tsx
│       ├── AttachmentPreview.tsx
│       └── CitationTooltip.tsx
├── pages/
│   ├── ChatPage.tsx
│   └── ChatHistoryPage.tsx
├── hooks/
│   ├── useChat.ts
│   ├── useConversation.ts
│   ├── useStreamResponse.ts
│   └── useAIInsights.ts
├── services/
│   ├── chatService.ts
│   ├── aiOrchestrationService.ts
│   ├── contextService.ts
│   └── insightService.ts
├── utils/
│   ├── chatUtils.ts
│   ├── promptTemplates.ts
│   └── responseFormatters.ts
└── types/
    ├── chat.ts
    ├── ai.ts
    └── conversation.ts
```

#### 4.1.2 Core Chat Interface Implementation

```typescript
// src/components/chat/ChatInterface.tsx
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatSidebar } from "./ChatSidebar";
import { TypingIndicator } from "./TypingIndicator";
import { useStreamResponse } from "@/hooks/useStreamResponse";

interface ChatInterfaceProps {
  conversationId?: string;
  className?: string;
}

export function ChatInterface({ conversationId, className }: ChatInterfaceProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useQuery(api.queries.getConversation, {
    conversationId: conversationId as any,
    includeMessages: true
  });

  const { streamResponse, isStreaming } = useStreamResponse();
  const sendMessage = useMutation(api.mutations.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async (content: string, attachments?: any[]) => {
    if (!content.trim()) return;

    setIsTyping(true);

    try {
      // Send user message
      const messageId = await sendMessage({
        conversationId: conversationId as any,
        content,
        attachments
      });

      // Stream AI response
      await streamResponse({
        conversationId: conversationId as any,
        messageId,
        context: {
          conversationHistory: conversation?.messages || [],
          portfolioContext: conversation?.context?.portfolioContext,
          documentContext: conversation?.context?.documentContext
        }
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Conversation not found</h2>
          <p className="text-gray-600">Please select or start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full ${className}`}>
      {/* Sidebar */}
      <ChatSidebar
        conversationId={conversationId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{conversation.title}</h1>
              <p className="text-sm text-gray-600">
                AI Investment Assistant
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Status indicators, settings, etc. */}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList
            messages={conversation.messages || []}
            isStreaming={isStreaming}
          />
          {(isTyping || isStreaming) && (
            <TypingIndicator />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isStreaming}
            placeholder="Ask about your portfolio, documents, or investment insights..."
          />
        </div>
      </div>
    </div>
  );
}

// src/components/chat/MessageInput.tsx
import { useState, useRef } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: any[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message..."
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex items-end gap-2">
      <button
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
        title="Attach file"
        disabled={disabled}
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          rows={1}
        />
      </div>

      <button
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
        title="Voice input"
        disabled={disabled}
        onMouseDown={() => setIsRecording(true)}
        onMouseUp={() => setIsRecording(false)}
        onTouchStart={() => setIsRecording(true)}
        onTouchEnd={() => setIsRecording(false)}
      >
        <Mic className={`w-5 h-5 ${isRecording ? 'text-red-500' : ''}`} />
      </button>

      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}

// src/components/chat/MessageList.tsx
import { MessageBubble } from "./MessageBubble";
import { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}
      {isStreaming && (
        <div className="flex justify-start">
          <div className="bg-gray-100  p-3 max-w-md">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 4.1.3 Message Components

```typescript
// src/components/chat/MessageBubble.tsx
import { Avatar } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { CitationTooltip } from "@/components/ui/CitationTooltip";
import { ChatMessage } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start space-x-2 max-w-2xl ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
        {/* Avatar */}
        {isAssistant && (
          <Avatar className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center">
            AI
          </Avatar>
        )}
        {isUser && (
          <Avatar className="w-8 h-8 bg-gray-500 text-white flex items-center justify-center">
            U
          </Avatar>
        )}

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? "text-right" : ""}`}>
          <div className={`inline-block  px-4 py-2 ${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-900"
          }`}>
            {message.contentType === "markdown" ? (
              <MarkdownRenderer
                content={message.content}
                className={`${isUser ? "text-white" : "text-gray-900"}`}
              />
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}

            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.citations.map((citation) => (
                  <CitationTooltip key={citation.id} citation={citation} />
                ))}
              </div>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="bg-white/10 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className={`mt-1 text-xs text-gray-500 ${isUser ? "text-right" : ""}`}>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            {message.metadata?.tokens && (
              <span className="ml-2">
                {message.metadata.tokens} tokens
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/ui/MarkdownRenderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={`prose max-w-none ${className}`}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {children}
            </td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

### 4.2 Phase 2: AI Orchestration and Context Management (Week 4-6)

#### 4.2.1 AI Orchestration Service

```typescript
// src/services/aiOrchestrationService.ts
import { OpenAI } from "openai";

export class AIOrchestrationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async orchestrateResponse(params: {
    conversationId: string;
    userMessage: string;
    context: ConversationContext;
    tools?: string[];
  }): Promise<AIResponse> {
    const { conversationId, userMessage, context, tools = [] } = params;

    // Determine intent and required capabilities
    const intent = await this.determineIntent(userMessage, context);

    // Build context-aware prompt
    const prompt = await this.buildPrompt(userMessage, context, intent);

    // Select appropriate AI capabilities
    const aiCapabilities = this.selectCapabilities(intent, tools);

    // Generate response using selected capabilities
    const response = await this.generateResponse(prompt, aiCapabilities);

    return response;
  }

  private async determineIntent(
    message: string,
    context: ConversationContext
  ): Promise<Intent> {
    // Use GPT-4 for intent classification
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an intent classifier for a VC portfolio AI assistant.
          Classify the user's intent into one of these categories:
          - portfolio_query: Questions about portfolio performance, companies, investments
          - document_analysis: Questions about uploaded documents, specific document content
          - market_insights: Market trends, competitive analysis, industry insights
          - risk_assessment: Risk analysis, portfolio risk, company-specific risks
          - opportunity_analysis: Investment opportunities, market gaps, growth potential
          - general_assistance: General help, navigation, feature explanations
          - proactive_insight: Unsolicited insights and recommendations

          Return JSON with: { intent: string, confidence: number, entities: string[] }`,
        },
        {
          role: "user",
          content: `User message: "${message}"
          Context: ${JSON.stringify(context.conversationHistory.slice(-2))}
          Portfolio context available: ${!!context.portfolioContext}
          Document context available: ${!!context.documentContext?.length}`,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      type: result.intent,
      confidence: result.confidence,
      entities: result.entities || [],
      requiresContext: this.intentRequiresContext(result.intent),
    };
  }

  private async buildPrompt(
    userMessage: string,
    context: ConversationContext,
    intent: Intent
  ): Promise<string> {
    let prompt = "";

    // System prompt with persona and capabilities
    prompt += this.getSystemPrompt(intent.type);

    // Conversation context
    if (context.conversationHistory.length > 0) {
      prompt += "\n\nRecent conversation:\n";
      context.conversationHistory.slice(-5).forEach((msg) => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    // Portfolio context
    if (context.portfolioContext && intent.requiresContext.portfolio) {
      prompt += "\n\nPortfolio context:\n";
      prompt += JSON.stringify(context.portfolioContext, null, 2);
    }

    // Document context
    if (context.documentContext && intent.requiresContext.documents) {
      prompt += "\n\nRelevant document excerpts:\n";
      context.documentContext.forEach((doc) => {
        prompt += `From "${doc.title}":\n${doc.relevantContent}\n\n`;
      });
    }

    // User message
    prompt += `\n\nUser: ${userMessage}`;
    prompt += "\n\nAssistant: ";

    return prompt;
  }

  private getSystemPrompt(intentType: string): string {
    const basePrompt = `You are an AI assistant for a Venture Capital Portfolio Operating System.
    You help VCs analyze their portfolio, understand documents, and make investment decisions.
    You have access to portfolio data, uploaded documents, and market intelligence.
    Always be helpful, accurate, and cite your sources when referencing specific information.
    If you're unsure about something, admit it and suggest ways to find the information.
    Focus on actionable insights and data-driven recommendations.`;

    const intentSpecificPrompts = {
      portfolio_query: `
        ${basePrompt}

        For portfolio queries:
        - Use actual portfolio data when available
        - Provide specific metrics and performance data
        - Suggest comparative analysis with benchmarks
        - Highlight both strengths and areas for improvement
        - Recommend specific actions based on data`,

      document_analysis: `
        ${basePrompt}

        For document analysis:
        - Reference specific documents and sections
        - Provide accurate quotes when relevant
        - Synthesize information across multiple documents
        - Highlight key insights and action items
        - Suggest follow-up analysis or questions`,

      market_insights: `
        ${basePrompt}

        For market insights:
        - Provide current market trends and data
        - Reference reliable sources and data
        - Connect trends to portfolio companies
        - Identify opportunities and risks
        - Suggest strategic implications`,

      risk_assessment: `
        ${basePrompt}

        For risk assessment:
        - Identify specific risk factors
        - Provide risk levels and mitigation strategies
        - Consider both portfolio and company-specific risks
        - Suggest monitoring and early warning indicators
        - Recommend contingency plans`,

      opportunity_analysis: `
        ${basePrompt}

        For opportunity analysis:
        - Identify specific investment opportunities
        - Provide market size and growth potential
        - Assess competitive landscape
        - Suggest due diligence areas
        - Recommend next steps for evaluation`,
    };

    return (
      intentSpecificPrompts[intentType as keyof typeof intentSpecificPrompts] ||
      basePrompt
    );
  }

  private selectCapabilities(
    intent: Intent,
    tools: string[]
  ): AICapabilities[] {
    const capabilities: AICapabilities[] = [];

    // Always include basic conversation
    capabilities.push(AICapabilities.CONVERSATION);

    // Add capabilities based on intent
    switch (intent.type) {
      case "portfolio_query":
        capabilities.push(AICapabilities.PORTFOLIO_ANALYSIS);
        if (
          intent.entities.some((e) =>
            ["performance", "metrics", "returns"].includes(e)
          )
        ) {
          capabilities.push(AICapabilities.DATA_VISUALIZATION);
        }
        break;

      case "document_analysis":
        capabilities.push(AICapabilities.DOCUMENT_RAG);
        if (
          intent.entities.some((e) => ["chart", "table", "data"].includes(e))
        ) {
          capabilities.push(AICapabilities.DATA_EXTRACTION);
        }
        break;

      case "market_insights":
        capabilities.push(AICapabilities.MARKET_ANALYSIS);
        capabilities.push(AICapabilities.WEB_SEARCH);
        break;

      case "risk_assessment":
        capabilities.push(AICapabilities.RISK_ANALYSIS);
        capabilities.push(AICapabilities.PORTFOLIO_ANALYSIS);
        break;

      case "opportunity_analysis":
        capabilities.push(AICapabilities.MARKET_ANALYSIS);
        capabilities.push(AICapabilities.OPPORTUNITY_SCORING);
        break;
    }

    // Add explicitly requested tools
    if (tools.includes("visualization")) {
      capabilities.push(AICapabilities.DATA_VISUALIZATION);
    }
    if (tools.includes("research")) {
      capabilities.push(AICapabilities.WEB_SEARCH);
    }

    return capabilities;
  }

  private async generateResponse(
    prompt: string,
    capabilities: AICapabilities[]
  ): Promise<AIResponse> {
    // Use GPT-4-turbo for complex responses
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    });

    const content = response.choices[0].message.content || "";

    // Parse response for structured data
    const parsedResponse = this.parseResponse(content, capabilities);

    return {
      content,
      citations: parsedResponse.citations,
      visualizations: parsedResponse.visualizations,
      suggestedQuestions: parsedResponse.suggestedQuestions,
      followUpActions: parsedResponse.followUpActions,
      metadata: {
        model: "gpt-4o-mini",
        tokens: response.usage?.total_tokens,
        processingTime: Date.now(),
        capabilities,
      },
    };
  }

  private parseResponse(
    content: string,
    capabilities: AICapabilities[]
  ): ParsedResponse {
    // Parse response for citations, charts, suggested questions, etc.
    const citations: Citation[] = [];
    const visualizations: Visualization[] = [];
    const suggestedQuestions: string[] = [];
    const followUpActions: string[] = [];

    // Extract citations (format: [Source: Document Name])
    const citationRegex = /\[Source: ([^\]]+)\]/g;
    let match;
    while ((match = citationRegex.exec(content)) !== null) {
      citations.push({
        id: `citation-${citations.length}`,
        source: {
          type: "document",
          id: match[1],
          title: match[1],
          snippet: "",
        },
        confidence: 0.9,
        relevanceScore: 0.8,
      });
    }

    // Extract suggested questions
    const questionRegex = /(?:Suggested|Follow-up) questions?[:\s]*([^.\n]+)/gi;
    while ((match = questionRegex.exec(content)) !== null) {
      suggestedQuestions.push(match[1].trim());
    }

    // Extract visualizations (simplified)
    if (capabilities.includes(AICapabilities.DATA_VISUALIZATION)) {
      const chartRegex = /\[Chart: ([^\]]+)\]/g;
      while ((match = chartRegex.exec(content)) !== null) {
        visualizations.push({
          type: "chart",
          title: match[1],
          data: null, // Would be populated with actual chart data
        });
      }
    }

    return {
      citations,
      visualizations,
      suggestedQuestions,
      followUpActions,
    };
  }

  private intentRequiresContext(intentType: string): ContextRequirements {
    const requirements = {
      portfolio_query: { portfolio: true, documents: false, market: false },
      document_analysis: { portfolio: false, documents: true, market: false },
      market_insights: { portfolio: false, documents: false, market: true },
      risk_assessment: { portfolio: true, documents: false, market: true },
      opportunity_analysis: {
        portfolio: false,
        documents: false,
        market: true,
      },
      general_assistance: { portfolio: false, documents: false, market: false },
      proactive_insight: { portfolio: true, documents: true, market: true },
    };

    return (
      requirements[intentType as keyof typeof requirements] || {
        portfolio: false,
        documents: false,
        market: false,
      }
    );
  }
}

// Type definitions
interface ConversationContext {
  conversationHistory: ChatMessage[];
  portfolioContext?: PortfolioContext;
  documentContext?: DocumentContext[];
  userPreferences?: UserPreferences;
}

interface Intent {
  type: string;
  confidence: number;
  entities: string[];
  requiresContext: ContextRequirements;
}

interface ContextRequirements {
  portfolio: boolean;
  documents: boolean;
  market: boolean;
}

enum AICapabilities {
  CONVERSATION = "conversation",
  PORTFOLIO_ANALYSIS = "portfolio_analysis",
  DOCUMENT_RAG = "document_rag",
  MARKET_ANALYSIS = "market_analysis",
  RISK_ANALYSIS = "risk_analysis",
  OPPORTUNITY_SCORING = "opportunity_scoring",
  DATA_VISUALIZATION = "data_visualization",
  DATA_EXTRACTION = "data_extraction",
  WEB_SEARCH = "web_search",
}

interface AIResponse {
  content: string;
  citations: Citation[];
  visualizations: Visualization[];
  suggestedQuestions: string[];
  followUpActions: string[];
  metadata: {
    model: string;
    tokens?: number;
    processingTime: number;
    capabilities: AICapabilities[];
  };
}

interface ParsedResponse {
  citations: Citation[];
  visualizations: Visualization[];
  suggestedQuestions: string[];
  followUpActions: string[];
}

interface Visualization {
  type: "chart" | "table" | "graph";
  title: string;
  data: any;
}

interface Citation {
  id: string;
  source: {
    type: string;
    id: string;
    title: string;
    snippet: string;
    url?: string;
  };
  confidence: number;
  relevanceScore: number;
}
```

#### 4.2.2 Context Service

```typescript
// src/services/contextService.ts
export class ContextService {
  async buildConversationContext(params: {
    conversationId: string;
    includePortfolio?: boolean;
    includeDocuments?: boolean;
    userId: string;
  }): Promise<ConversationContext> {
    const {
      conversationId,
      includePortfolio = true,
      includeDocuments = true,
      userId,
    } = params;

    // Get conversation history
    const conversationHistory =
      await this.getConversationHistory(conversationId);

    // Build portfolio context
    let portfolioContext;
    if (includePortfolio) {
      portfolioContext = await this.buildPortfolioContext(userId);
    }

    // Build document context
    let documentContext;
    if (includeDocuments) {
      documentContext = await this.buildDocumentContext(conversationHistory);
    }

    // Get user preferences
    const userPreferences = await this.getUserPreferences(userId);

    return {
      conversationHistory,
      portfolioContext,
      documentContext,
      userPreferences,
    };
  }

  private async buildPortfolioContext(
    userId: string
  ): Promise<PortfolioContext> {
    // Get user's portfolio data from Convex
    const portfolioData = await this.fetchPortfolioData(userId);

    return {
      totalValue: portfolioData.totalValue || 0,
      companies: portfolioData.companies || [],
      recentPerformance: portfolioData.recentPerformance || {
        totalReturn: 0,
        annualizedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
      },
      riskProfile: portfolioData.riskProfile || {
        overallRisk: "medium",
        diversificationScore: 0.7,
        concentrationRisk: 0.3,
      },
      investmentStrategy: portfolioData.strategy || "balanced",
      focusAreas: portfolioData.focusAreas || [],
    };
  }

  private async buildDocumentContext(
    conversationHistory: ChatMessage[]
  ): Promise<DocumentContext[]> {
    // Extract recent queries and find relevant documents
    const recentQueries = conversationHistory
      .filter((msg) => msg.role === "user")
      .slice(-3)
      .map((msg) => msg.content);

    if (recentQueries.length === 0) return [];

    // Search for relevant documents using vector search
    const relevantDocuments = await this.searchRelevantDocuments(recentQueries);

    return relevantDocuments.map((doc) => ({
      documentId: doc.id,
      title: doc.title,
      type: doc.type,
      keyInsights: doc.keyInsights || [],
      relevantSections: doc.relevantSections || [],
      lastAnalyzed: doc.lastAnalyzed || Date.now(),
    }));
  }

  private async searchRelevantDocuments(queries: string[]): Promise<any[]> {
    // Use existing Convex vector search to find relevant documents
    const allResults = [];

    for (const query of queries) {
      const results = await this.vectorSearch(query);
      allResults.push(...results);
    }

    // Deduplicate and rank results
    const uniqueResults = this.deduplicateResults(allResults);
    return uniqueResults.slice(0, 5); // Top 5 most relevant documents
  }

  private async vectorSearch(query: string): Promise<any[]> {
    // Implementation using Convex vector search
    // This would use the existing enhancedHybridChunks table
    // Return relevant document chunks with their parent documents
    return [];
  }

  private deduplicateResults(results: any[]): any[] {
    const seen = new Set();
    return results.filter((result) => {
      const key = result.documentId;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
```

### 4.3 Phase 3: Document Intelligence Integration (Week 7-9)

#### 4.3.1 Document RAG Implementation

```typescript
// src/services/documentRAGService.ts
export class DocumentRAGService {
  async searchDocuments(
    query: string,
    options: {
      userId: string;
      conversationId?: string;
      limit?: number;
      documentTypes?: string[];
      dateRange?: { start: number; end: number };
    }
  ): Promise<DocumentSearchResult[]> {
    const {
      userId,
      conversationId,
      limit = 5,
      documentTypes,
      dateRange,
    } = options;

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);

    // Search vector database
    const vectorResults = await this.searchVectorDatabase({
      embedding: queryEmbedding,
      userId,
      limit: limit * 2, // Get more to rerank
      filters: {
        documentTypes,
        dateRange,
      },
    });

    // Rerank results using more sophisticated scoring
    const rerankedResults = await this.rerankResults(query, vectorResults);

    // Add document context and metadata
    const enrichedResults = await this.enrichResults(rerankedResults, {
      conversationId,
      userId,
    });

    return enrichedResults.slice(0, limit);
  }

  async getDocumentContext(
    documentId: string,
    query: string
  ): Promise<DocumentContext> {
    // Get full document
    const document = await this.getDocument(documentId);

    // Find most relevant sections
    const relevantSections = await this.findRelevantSections(document, query);

    // Extract key insights
    const keyInsights = await this.extractKeyInsights(relevantSections);

    return {
      documentId,
      title: document.title,
      type: document.type,
      keyInsights,
      relevantSections: relevantSections.map((section) => ({
        id: section.id,
        content: section.content,
        relevanceScore: section.score,
        page: section.pageNumber,
      })),
      lastAnalyzed: Date.now(),
    };
  }

  async generateDocumentSummary(
    documentId: string,
    options: {
      focus?: string[];
      length?: "brief" | "detailed" | "comprehensive";
    }
  ): Promise<DocumentSummary> {
    const { focus = [], length = "detailed" } = options;

    // Get document content
    const document = await this.getDocument(documentId);

    // Generate summary using GPT-4
    const summaryPrompt = this.buildSummaryPrompt(document, focus, length);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: summaryPrompt }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const summary = response.choices[0].message.content || "";

    // Extract key points and action items
    const keyPoints = await this.extractKeyPoints(summary);
    const actionItems = await this.extractActionItems(summary);

    return {
      documentId,
      summary,
      keyPoints,
      actionItems,
      length,
      focus,
      generatedAt: Date.now(),
    };
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });

    return response.data[0].embedding;
  }

  private async searchVectorDatabase(params: {
    embedding: number[];
    userId: string;
    limit: number;
    filters?: any;
  }): Promise<VectorSearchResult[]> {
    // Use Convex's vector search functionality
    // Search in enhancedHybridChunks table
    const results = await this.convex.query(api.queries.vectorSearchChunks, {
      embedding: params.embedding,
      userId: params.userId,
      limit: params.limit,
      filters: params.filters,
    });

    return results.map((result) => ({
      chunkId: result._id,
      documentId: result.documentId,
      content: result.content,
      score: result.score,
      metadata: result.metadata,
    }));
  }

  private async rerankResults(
    query: string,
    results: VectorSearchResult[]
  ): Promise<RankedResult[]> {
    // Use cross-encoder reranking for better relevance
    const rerankPrompt = `
    Query: "${query}"

    Documents to rank:
    ${results
      .map(
        (result, index) => `${index + 1}. ${result.content.slice(0, 200)}...`
      )
      .join("\n")}

    Rank these documents by relevance to the query. Return JSON with:
    {
      "rankings": [
        {"index": 1, "score": 0.95, "reason": "Highly relevant..."},
        {"index": 3, "score": 0.80, "reason": "Somewhat relevant..."}
      ]
    }`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: rerankPrompt }],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const rankings = JSON.parse(response.choices[0].message.content || "{}");

    // Apply rankings to results
    const rankedResults = results.map((result, index) => {
      const ranking = rankings.rankings.find((r) => r.index === index + 1);
      return {
        ...result,
        rerankedScore: ranking?.score || 0,
        rerankingReason: ranking?.reason || "",
      };
    });

    // Sort by reranked score
    return rankedResults.sort((a, b) => b.rerankedScore - a.rerankedScore);
  }

  private async enrichResults(
    results: RankedResult[],
    context: { conversationId?: string; userId: string }
  ): Promise<DocumentSearchResult[]> {
    const enrichedResults = [];

    for (const result of results) {
      // Get document metadata
      const document = await this.getDocument(result.documentId);

      // Check if this document has been referenced in recent conversations
      const conversationContext = context.conversationId
        ? await this.getConversationContext(
            context.conversationId,
            result.documentId
          )
        : null;

      enrichedResults.push({
        documentId: result.documentId,
        title: document.title,
        type: document.type,
        uploadDate: document.uploadDate,
        relevanceScore: result.rerankedScore,
        snippet: result.content.slice(0, 200) + "...",
        keyInsights: await this.extractQuickInsights(result.content),
        previouslyReferenced: !!conversationContext,
        lastReferenced: conversationContext?.lastReferenced,
        metadata: {
          chunkId: result.chunkId,
          originalScore: result.score,
          rerankingReason: result.rerankingReason,
          documentMetadata: document.metadata,
        },
      });
    }

    return enrichedResults;
  }

  private buildSummaryPrompt(
    document: any,
    focus: string[],
    length: string
  ): string {
    const lengthInstructions = {
      brief: "Provide a concise 2-3 paragraph summary",
      detailed: "Provide a comprehensive summary with key details and insights",
      comprehensive: "Provide an in-depth analysis covering all major aspects",
    };

    let prompt = `Please summarize the following document. ${lengthInstructions[length as keyof typeof lengthInstructions]}.\n\n`;

    if (focus.length > 0) {
      prompt += `Focus particularly on: ${focus.join(", ")}.\n\n`;
    }

    prompt += `Document title: ${document.title}\n`;
    prompt += `Document type: ${document.type}\n\n`;
    prompt += `Content:\n${document.content}\n\n`;

    prompt += `Please structure your response to include:
    1. Executive Summary
    2. Key Points
    3. Important Data/Metrics
    4. Action Items or Recommendations
    5. Areas that may need follow-up`;

    return prompt;
  }
}

// Type definitions
interface DocumentSearchResult {
  documentId: string;
  title: string;
  type: string;
  uploadDate: number;
  relevanceScore: number;
  snippet: string;
  keyInsights: string[];
  previouslyReferenced: boolean;
  lastReferenced?: number;
  metadata: {
    chunkId: string;
    originalScore: number;
    rerankingReason: string;
    documentMetadata: any;
  };
}

interface VectorSearchResult {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
  metadata: any;
}

interface RankedResult extends VectorSearchResult {
  rerankedScore: number;
  rerankingReason: string;
}

interface DocumentSummary {
  documentId: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  length: string;
  focus: string[];
  generatedAt: number;
}
```

#### 4.3.2 Document Analysis Components

```typescript
// src/components/chat/DocumentInsights.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";

interface DocumentInsightsProps {
  documents: DocumentSearchResult[];
  onViewDocument: (documentId: string) => void;
  onAskAboutDocument: (documentId: string, question: string) => void;
}

export function DocumentInsights({
  documents,
  onViewDocument,
  onAskAboutDocument
}: DocumentInsightsProps) {
  if (documents.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Relevant Documents</h3>

      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.documentId} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h4 className="font-medium">{doc.title}</h4>
                  <Badge variant="secondary">{doc.type}</Badge>
                  {doc.previouslyReferenced && (
                    <Badge variant="outline" className="text-green-600">
                      Previously discussed
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{doc.snippet}</p>

                {doc.keyInsights.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium mb-1">Key Insights:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {doc.keyInsights.slice(0, 3).map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Relevance: {Math.round(doc.relevanceScore * 100)}%</span>
                    <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDocument(doc.documentId)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAskAboutDocument(
                        doc.documentId,
                        `Tell me more about the key insights from ${doc.title}`
                      )}
                    >
                      Ask about this
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// src/components/ai/SuggestedQuestions.tsx
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
  onAskQuestion: (question: string) => void;
}

export function SuggestedQuestions({ questions, onAskQuestion }: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200  p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h4 className="font-medium text-yellow-800">Suggested Questions</h4>
      </div>

      <div className="space-y-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full text-left justify-start h-auto py-2 px-3 text-sm bg-white/50 hover:bg-white/80 border border-yellow-200 rounded-md"
            onClick={() => onAskQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

### 4.4 Phase 4: Portfolio Intelligence and Proactive Insights (Week 10-12)

#### 4.4.1 Portfolio Intelligence Integration

```typescript
// src/services/portfolioIntelligenceService.ts
export class PortfolioIntelligenceService {
  async analyzePortfolioQuery(
    query: string,
    context: PortfolioContext
  ): Promise<PortfolioAnalysis> {
    // Parse the query to understand what portfolio information is needed
    const queryIntent = await this.parsePortfolioQuery(query);

    let analysis: PortfolioAnalysis = {
      query,
      intent: queryIntent.type,
      data: {},
      insights: [],
      recommendations: [],
      visualizations: [],
    };

    // Execute specific analysis based on intent
    switch (queryIntent.type) {
      case "performance_overview":
        analysis = await this.analyzePerformance(context, queryIntent);
        break;
      case "risk_analysis":
        analysis = await this.analyzeRisk(context, queryIntent);
        break;
      case "company_details":
        analysis = await this.analyzeCompany(context, queryIntent);
        break;
      case "comparison":
        analysis = await this.analyzeComparison(context, queryIntent);
        break;
      case "optimization":
        analysis = await this.analyzeOptimization(context, queryIntent);
        break;
      default:
        analysis = await this.analyzeGeneralPortfolio(context, queryIntent);
    }

    return analysis;
  }

  private async analyzePerformance(
    context: PortfolioContext,
    intent: PortfolioQueryIntent
  ): Promise<PortfolioAnalysis> {
    const performance = context.recentPerformance;
    const companies = context.companies;

    // Generate performance insights
    const insights = [
      {
        type: "return_analysis",
        title: "Portfolio Returns",
        description: `Your portfolio has generated a ${performance.totalReturn > 0 ? "positive" : "negative"} return of ${performance.totalReturn.toFixed(2)}%`,
        data: {
          totalReturn: performance.totalReturn,
          annualizedReturn: performance.annualizedReturn,
          volatility: performance.volatility,
          sharpeRatio: performance.sharpeRatio,
        },
      },
      {
        type: "top_performers",
        title: "Top Performing Companies",
        description: `${companies.filter((c) => c.return > 0).length} companies are showing positive returns`,
        data: {
          companies: companies
            .sort((a, b) => b.return - a.return)
            .slice(0, 5)
            .map((c) => ({
              name: c.name,
              return: c.return,
              value: c.currentValue,
            })),
        },
      },
    ];

    // Generate recommendations
    const recommendations = [];
    if (performance.totalReturn < 0) {
      recommendations.push({
        type: "action",
        title: "Review Underperformers",
        description:
          "Consider reviewing investment thesis for companies with negative returns",
        priority: "medium",
      });
    }

    if (performance.volatility > 0.25) {
      recommendations.push({
        type: "risk_management",
        title: "High Volatility Detected",
        description:
          "Portfolio shows high volatility - consider diversification strategies",
        priority: "high",
      });
    }

    // Generate visualizations
    const visualizations = [
      {
        type: "return_chart",
        title: "Portfolio Performance Over Time",
        data: {
          // Time series data for portfolio returns
        },
      },
      {
        type: "company_performance",
        title: "Individual Company Performance",
        data: {
          companies: companies.map((c) => ({
            name: c.name,
            return: c.return,
            value: c.currentValue,
            allocation: c.allocation,
          })),
        },
      },
    ];

    return {
      query: intent.query,
      intent: intent.type,
      data: {
        performance,
        companies,
      },
      insights,
      recommendations,
      visualizations,
    };
  }

  private async analyzeRisk(
    context: PortfolioContext,
    intent: PortfolioQueryIntent
  ): Promise<PortfolioAnalysis> {
    const riskProfile = context.riskProfile;
    const companies = context.companies;

    // Risk analysis insights
    const insights = [
      {
        type: "overall_risk",
        title: "Portfolio Risk Profile",
        description: `Your portfolio has an overall risk level of ${riskProfile.overallRisk}`,
        data: riskProfile,
      },
      {
        type: "concentration_risk",
        title: "Concentration Analysis",
        description: `Portfolio concentration risk score: ${(riskProfile.concentrationRisk * 100).toFixed(1)}%`,
        data: {
          concentrationRisk: riskProfile.concentrationRisk,
          topCompanies: companies
            .sort((a, b) => b.allocation - a.allocation)
            .slice(0, 3)
            .map((c) => ({ name: c.name, allocation: c.allocation })),
        },
      },
    ];

    // Risk recommendations
    const recommendations = [];
    if (riskProfile.concentrationRisk > 0.4) {
      recommendations.push({
        type: "diversification",
        title: "High Concentration Risk",
        description:
          "Consider diversifying across more companies to reduce concentration risk",
        priority: "high",
      });
    }

    if (riskProfile.diversificationScore < 0.5) {
      recommendations.push({
        type: "diversification",
        title: "Low Diversification",
        description:
          "Portfolio lacks sufficient diversification across industries or stages",
        priority: "medium",
      });
    }

    return {
      query: intent.query,
      intent: intent.type,
      data: { riskProfile, companies },
      insights,
      recommendations,
      visualizations: [
        {
          type: "risk_matrix",
          title: "Risk-Return Profile",
          data: companies.map((c) => ({
            name: c.name,
            risk: c.riskScore,
            return: c.return,
            value: c.currentValue,
          })),
        },
      ],
    };
  }

  async generateProactiveInsights(userId: string): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Get current portfolio data
    const portfolioData = await this.getPortfolioData(userId);

    // Generate various types of proactive insights

    // Performance anomalies
    const performanceAnomalies =
      await this.detectPerformanceAnomalies(portfolioData);
    insights.push(...performanceAnomalies);

    // Market opportunities
    const marketOpportunities =
      await this.identifyMarketOpportunities(portfolioData);
    insights.push(...marketOpportunities);

    // Risk alerts
    const riskAlerts = await this.generateRiskAlerts(portfolioData);
    insights.push(...riskAlerts);

    // Portfolio optimization suggestions
    const optimizationSuggestions =
      await this.generateOptimizationSuggestions(portfolioData);
    insights.push(...optimizationSuggestions);

    // Prioritize insights
    return insights
      .sort((a, b) => this.getInsightPriority(b) - this.getInsightPriority(a))
      .slice(0, 10); // Top 10 insights
  }

  private async detectPerformanceAnomalies(
    portfolioData: any
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    const companies = portfolioData.companies;

    for (const company of companies) {
      // Detect significant performance changes
      const recentPerformance = company.recentReturns;
      const baselinePerformance = company.baselineReturns;

      if (Math.abs(recentPerformance - baselinePerformance) > 0.2) {
        insights.push({
          type: "performance_anomaly",
          title: `Significant Performance Change: ${company.name}`,
          description: `${company.name} has shown a ${recentPerformance > baselinePerformance ? "positive" : "negative"} performance deviation of ${Math.abs(recentPerformance - baselinePerformance).toFixed(2)}% from baseline`,
          confidence: 0.8,
          priority: recentPerformance < baselinePerformance ? "high" : "medium",
          data: {
            company: company.name,
            recentPerformance,
            baselinePerformance,
            deviation: recentPerformance - baselinePerformance,
          },
          actionItems: [
            "Review company fundamentals",
            "Analyze market conditions affecting the company",
            "Consider portfolio rebalancing if needed",
          ],
        });
      }
    }

    return insights;
  }

  private async identifyMarketOpportunities(
    portfolioData: any
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Analyze market trends and identify opportunities
    const marketAnalysis = await this.analyzeMarketTrends(
      portfolioData.focusAreas
    );

    for (const trend of marketAnalysis.trends) {
      if (trend.opportunityScore > 0.7) {
        insights.push({
          type: "opportunity",
          title: `Market Opportunity: ${trend.sector}`,
          description: `${trend.description} This aligns with your portfolio focus on ${trend.relatedFocusAreas.join(", ")}`,
          confidence: trend.confidence,
          priority: "medium",
          data: trend,
          actionItems: [
            "Research companies in this sector",
            "Evaluate investment criteria alignment",
            "Consider due diligence on potential targets",
          ],
        });
      }
    }

    return insights;
  }
}

// Type definitions
interface PortfolioAnalysis {
  query: string;
  intent: string;
  data: any;
  insights: PortfolioInsight[];
  recommendations: PortfolioRecommendation[];
  visualizations: PortfolioVisualization[];
}

interface PortfolioInsight {
  type: string;
  title: string;
  description: string;
  data: any;
}

interface PortfolioRecommendation {
  type: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

interface PortfolioVisualization {
  type: string;
  title: string;
  data: any;
}

interface PortfolioQueryIntent {
  type: string;
  entities: string[];
  timeframe?: string;
  metrics?: string[];
  companies?: string[];
}

interface AIInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  priority: "low" | "medium" | "high" | "critical";
  data?: any;
  actionItems?: string[];
}
```

#### 4.4.2 Proactive Insights Component

```typescript
// src/components/ai/ProactiveInsights.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, TrendingUp, AlertTriangle, Target } from "lucide-react";

interface ProactiveInsightsProps {
  insights: AIInsight[];
  onInsightAction: (insightId: string, action: string) => void;
  onDismissInsight: (insightId: string) => void;
}

export function ProactiveInsights({
  insights,
  onInsightAction,
  onDismissInsight
}: ProactiveInsightsProps) {
  const [filter, setFilter] = useState<"all" | "opportunities" | "risks" | "performance">("all");

  const filteredInsights = insights.filter(insight => {
    if (filter === "all") return true;
    return insight.type.includes(filter);
  });

  const getInsightIcon = (type: string) => {
    if (type.includes("opportunity")) return <Target className="w-5 h-5 text-green-600" />;
    if (type.includes("risk") || type.includes("alert")) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (type.includes("performance")) return <TrendingUp className="w-5 h-5 text-blue-600" />;
    return <Bell className="w-5 h-5 text-gray-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Proactive Insights
          <Badge variant="secondary">{insights.length}</Badge>
        </h3>

        <div className="flex gap-2">
          {(["all", "opportunities", "risks", "performance"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="capitalize"
            >
              {filterType}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className={`p-4 border-2 ${getPriorityColor(insight.priority)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getInsightIcon(insight.type)}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

                  {insight.actionItems && insight.actionItems.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2">Suggested Actions:</h5>
                      <ul className="text-sm space-y-1">
                        {insight.actionItems.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInsightAction(insight.id, "investigate")}
                    >
                      Investigate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInsightAction(insight.id, "discuss")}
                    >
                      Discuss with AI
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismissInsight(insight.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredInsights.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No {filter === "all" ? "" : filter} insights available</p>
            <p className="text-sm mt-2">
              Check back later for new insights and recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 5. Code Change Overview

### 5.1 New Files to Create

#### Core Chat Components

```typescript
// src/components/chat/ChatInterface.tsx
export function ChatInterface({
  conversationId,
  className,
}: ChatInterfaceProps) {
  // Main chat interface implementation from Phase 1.1.2
}

// src/components/chat/MessageList.tsx
export function MessageList({ messages, isStreaming }: MessageListProps) {
  // Message list with streaming support
}

// src/components/chat/MessageBubble.tsx
export function MessageBubble({ message }: MessageBubbleProps) {
  // Individual message bubble with markdown rendering and citations
}

// src/components/chat/MessageInput.tsx
export function MessageInput({
  onSendMessage,
  disabled,
  placeholder,
}: MessageInputProps) {
  // Message input with file attachment and voice input
}

// src/components/chat/ConversationList.tsx
export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: ConversationListProps) {
  // Sidebar conversation list
}

// src/components/chat/TypingIndicator.tsx
export function TypingIndicator() {
  // Animated typing indicator for streaming responses
}
```

#### AI Components

```typescript
// src/components/ai/AIAvatar.tsx
export function AIAvatar({ status, className }: AIAvatarProps) {
  // AI assistant avatar with status indicators
}

// src/components/ai/InsightCard.tsx
export function InsightCard({
  insight,
  onAction,
  onDismiss,
}: InsightCardProps) {
  // Individual insight card for proactive recommendations
}

// src/components/ai/SuggestedQuestions.tsx
export function SuggestedQuestions({
  questions,
  onAskQuestion,
}: SuggestedQuestionsProps) {
  // Suggested questions component from Phase 3.3.2
}

// src/components/ai/ProactiveInsights.tsx
export function ProactiveInsights({
  insights,
  onInsightAction,
  onDismissInsight,
}: ProactiveInsightsProps) {
  // Proactive insights panel from Phase 4.4.2
}
```

#### UI Components

```typescript
// src/components/ui/MarkdownRenderer.tsx
export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  // Markdown renderer with syntax highlighting from Phase 1.1.3
}

// src/components/ui/ChartRenderer.tsx
export function ChartRenderer({ type, data, config }: ChartRendererProps) {
  // Dynamic chart rendering for AI responses
}

// src/components/ui/AttachmentPreview.tsx
export function AttachmentPreview({ attachment }: AttachmentPreviewProps) {
  // File attachment preview component
}

// src/components/ui/CitationTooltip.tsx
export function CitationTooltip({ citation }: CitationTooltipProps) {
  // Citation tooltip with source information
}
```

#### Services

```typescript
// src/services/aiOrchestrationService.ts
export class AIOrchestrationService {
  // Main AI orchestration service from Phase 2.2.1
}

// src/services/contextService.ts
export class ContextService {
  // Context management service from Phase 2.2.2
}

// src/services/documentRAGService.ts
export class DocumentRAGService {
  // Document RAG service from Phase 3.3.1
}

// src/services/portfolioIntelligenceService.ts
export class PortfolioIntelligenceService {
  // Portfolio intelligence service from Phase 4.4.1
}

// src/services/chatService.ts
export class ChatService {
  // Chat service for conversation management
}

// src/services/insightService.ts
export class InsightService {
  // Insight generation and management service
}
```

#### Hooks

```typescript
// src/hooks/useChat.ts
export function useChat(conversationId?: string) {
  // Main chat hook with message management
}

// src/hooks/useConversation.ts
export function useConversation(conversationId: string) {
  // Conversation-specific hook
}

// src/hooks/useStreamResponse.ts
export function useStreamResponse() {
  // Streaming response hook from Phase 1.1.2
}

// src/hooks/useAIInsights.ts
export function useAIInsights(userId: string) {
  // Hook for proactive insights management
}
```

#### Pages

```typescript
// src/pages/ChatPage.tsx
export function ChatPage() {
  // Main chat page with full chat interface
}

// src/pages/ChatHistoryPage.tsx
export function ChatHistoryPage() {
  // Chat history and conversation management page
}
```

#### Type Definitions

```typescript
// src/types/chat.ts
export interface ChatMessage {
  _id: string;
  conversationId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  contentType: "text" | "markdown" | "chart" | "table" | "image";
  attachments?: MessageAttachment[];
  citations?: Citation[];
  metadata: MessageMetadata;
  reactions?: MessageReaction[];
  threadId?: string;
  createdAt: number;
}

// src/types/ai.ts
export interface AIResponse {
  content: string;
  citations: Citation[];
  visualizations: Visualization[];
  suggestedQuestions: string[];
  followUpActions: string[];
  metadata: AIResponseMetadata;
}

// src/types/conversation.ts
export interface ConversationContext {
  conversationHistory: ChatMessage[];
  portfolioContext?: PortfolioContext;
  documentContext?: DocumentContext[];
  userPreferences?: UserPreferences;
}
```

#### Utility Functions

```typescript
// src/utils/chatUtils.ts
export function formatTimestamp(timestamp: number): string {
  // Format timestamps for display
}

export function truncateMessage(message: string, maxLength: number): string {
  // Truncate messages for preview
}

export function calculateReadingTime(content: string): number {
  // Calculate estimated reading time
}

// src/utils/promptTemplates.ts
export const PROMPT_TEMPLATES = {
  portfolio_analysis: "...",
  document_summary: "...",
  risk_assessment: "...",
  opportunity_analysis: "...",
};

// src/utils/responseFormatters.ts
export function formatAIResponse(response: AIResponse): FormattedResponse {
  // Format AI responses for display
}

export function extractCitations(content: string): Citation[] {
  // Extract citations from AI responses
}
```

### 5.2 Existing Files to Modify

#### Route Configuration Updates

```typescript
// src/App.tsx (existing file)
// BEFORE:
<Routes>
  <Route path="/" element={<OverviewPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentManagement />} />
  <Route path="/fund/:fundId" element={<FundDashboard />} />
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
  <Route path="/network" element={<NetworkIntelligencePage />} />
</Routes>

// AFTER:
<Routes>
  <Route path="/" element={<OverviewPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentManagement />} />
  <Route path="/fund/:fundId" element={<FundDashboard />} />
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
  <Route path="/network" element={<NetworkIntelligencePage />} />
  <Route path="/chat" element={<ChatPage />} />
  <Route path="/chat/:conversationId" element={<ChatPage />} />
  <Route path="/chat-history" element={<ChatHistoryPage />} />
</Routes>
```

#### Navigation Updates

```typescript
// src/components/Navigation.tsx (existing file)
// Add new navigation items:
const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Companies", href: "/companies" },
  { name: "Network", href: "/network" },
  { name: "AI Assistant", href: "/chat" },
  { name: "Documents", href: "/documents" },
  { name: "Analytics", href: "/analytics" },
];
```

#### Package Dependencies Update

```json
// package.json (add to dependencies)
{
  "dependencies": {
    // ... existing dependencies
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-toast": "^1.2.15",
    "framer-motion": "^10.16.4",
    "react-intersection-observer": "^9.5.2",
    "date-fns": "^2.30.0",
    "clsx": "^2.1.1",
    "sonner": "^2.0.3",
    "react-syntax-highlighter": "^15.5.0"
  }
}
```

### 5.3 Backend Functions to Add

#### Convex Query Functions

```typescript
// convex/queries.ts (add to existing file)
export const getConversation = query({
  args: {
    conversationId: v.id("chatConversations"),
    includeMessages: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { conversationId, includeMessages = false } = args;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return null;

    let result: any = { ...conversation };

    if (includeMessages) {
      const messages = await ctx.db
        .query("chatMessages")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", conversationId)
        )
        .order("asc")
        .collect();

      result.messages = messages;
    }

    return result;
  },
});

export const getUserConversations = query({
  args: {
    status: v.optional(
      v.union(v.literal("active"), v.literal("archived"), v.literal("shared"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { status, limit = 50 } = args;
    const userId = await getAuthUserId(ctx);

    if (!userId) return [];

    let query = ctx.db
      .query("chatConversations")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }

    return await query.order("desc").take(limit);
  },
});

export const getConversationContext = query({
  args: {
    conversationId: v.id("chatConversations"),
    includePortfolio: v.optional(v.boolean()),
    includeDocuments: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const {
      conversationId,
      includePortfolio = true,
      includeDocuments = true,
    } = args;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return null;

    const context: ConversationContext = {
      conversationHistory: [],
    };

    // Get conversation history
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(10);

    context.conversationHistory = messages.reverse();

    // Get portfolio context if requested
    if (includePortfolio) {
      const portfolioData = await getPortfolioContext(ctx, conversation.userId);
      context.portfolioContext = portfolioData;
    }

    // Get document context if requested
    if (includeDocuments && context.conversationHistory.length > 0) {
      const documentContext = await getDocumentContext(
        ctx,
        context.conversationHistory
      );
      context.documentContext = documentContext;
    }

    return context;
  },
});

export const searchDocumentsForContext = query({
  args: {
    query: v.string(),
    conversationId: v.id("chatConversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { query, conversationId, limit = 5 } = args;

    // Get conversation to determine user
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return [];

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Search for relevant chunks
    const chunks = await ctx.db
      .query("enhancedHybridChunks")
      .withIndex("by_embedding", (q) => q.eq("userId", conversation.userId))
      .take(limit * 2); // Get more to rerank

    // Filter and rank results (simplified)
    const relevantChunks = chunks
      .filter((chunk) =>
        chunk.content.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);

    // Get document details for chunks
    const documentIds = [
      ...new Set(relevantChunks.map((chunk) => chunk.documentId)),
    ];
    const documents = await Promise.all(
      documentIds.map((docId) => ctx.db.get(docId))
    );

    return relevantChunks.map((chunk) => {
      const document = documents.find((doc) => doc?._id === chunk.documentId);
      return {
        chunkId: chunk._id,
        documentId: chunk.documentId,
        title: document?.fileName || "Unknown Document",
        content: chunk.content,
        relevanceScore: 0.8, // Simplified scoring
        metadata: chunk.metadata,
      };
    });
  },
});

export const getAIInsights = query({
  args: {
    userId: v.id("users"),
    types: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("viewed"),
        v.literal("acted_upon"),
        v.literal("dismissed")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, types, status, limit = 20 } = args;

    let query = ctx.db
      .query("aiInsights")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (types && types.length > 0) {
      query = query.filter((q) =>
        q.or(...types.map((type) => q.eq(q.field("type"), type)))
      );
    }

    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }

    return await query.order("desc").take(limit);
  },
});
```

#### Convex Mutation Functions

```typescript
// convex/mutations.ts (add to existing file)
export const createConversation = mutation({
  args: {
    title: v.string(),
    context: v.optional(
      v.object({
        portfolioContext: v.optional(v.any()),
        documentIds: v.optional(v.array(v.id("documents"))),
        userPreferences: v.optional(v.any()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const conversationId = await ctx.db.insert("chatConversations", {
      userId,
      title: args.title,
      status: "active",
      context: args.context || {},
      metadata: {
        messageCount: 0,
        lastActivity: Date.now(),
        tags: [],
        category: "general",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { conversationId };
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("chatConversations"),
    content: v.string(),
    attachments: v.optional(v.array(v.any())),
    contextOverride: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { conversationId, content, attachments, contextOverride } = args;

    // Verify conversation ownership
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found or access denied");
    }

    // Create user message
    const messageId = await ctx.db.insert("chatMessages", {
      conversationId,
      userId,
      role: "user",
      content,
      contentType: "text",
      attachments: attachments || [],
      metadata: {
        tokens: content.split(/\s+/).length,
        timestamp: Date.now(),
      },
      createdAt: Date.now(),
    });

    // Update conversation metadata
    await ctx.db.patch(conversationId, {
      "metadata.messageCount": conversation.metadata.messageCount + 1,
      "metadata.lastActivity": Date.now(),
      updatedAt: Date.now(),
    });

    // Trigger AI response (this would be an action)
    await ctx.scheduler.runAfter(0, api.actions.generateAIResponse, {
      conversationId,
      messageId,
      context: contextOverride,
    });

    return { messageId };
  },
});

export const streamMessageResponse = action({
  args: {
    conversationId: v.id("chatConversations"),
    messageId: v.id("chatMessages"),
    context: v.any(),
  },
  handler: async (ctx, args) => {
    const { conversationId, messageId, context } = args;

    // Get conversation and message details
    const conversation = await ctx.runQuery(api.queries.getConversation, {
      conversationId,
      includeMessages: true,
    });

    if (!conversation) throw new Error("Conversation not found");

    // Build full context for AI
    const fullContext = await ctx.runQuery(api.queries.getConversationContext, {
      conversationId,
      includePortfolio: true,
      includeDocuments: true,
    });

    // Get user message
    const userMessage = conversation.messages?.find((m) => m._id === messageId);
    if (!userMessage) throw new Error("User message not found");

    // Generate AI response using orchestration service
    const aiService = new AIOrchestrationService();
    const response = await aiService.orchestrateResponse({
      conversationId,
      userMessage: userMessage.content,
      context: fullContext,
      tools: ["portfolio_analysis", "document_rag", "market_insights"],
    });

    // Create assistant message
    await ctx.runMutation(api.mutations.createAIMessage, {
      conversationId,
      response,
      context: fullContext,
    });

    return response;
  },
});

export const createAIMessage = mutation({
  args: {
    conversationId: v.id("chatConversations"),
    response: v.any(),
    context: v.any(),
  },
  handler: async (ctx, args) => {
    const { conversationId, response, context } = args;

    const messageId = await ctx.db.insert("chatMessages", {
      conversationId,
      userId: context.conversationHistory[0]?.userId, // Get from first message
      role: "assistant",
      content: response.content,
      contentType: "markdown",
      citations: response.citations,
      metadata: {
        tokens: response.metadata.tokens,
        processingTime: response.metadata.processingTime,
        model: response.metadata.model,
        confidence: 0.9,
      },
      createdAt: Date.now(),
    });

    // Update conversation last activity
    await ctx.db.patch(conversationId, {
      "metadata.lastActivity": Date.now(),
      updatedAt: Date.now(),
    });

    // Generate suggested questions for next interaction
    if (response.suggestedQuestions && response.suggestedQuestions.length > 0) {
      await ctx.db.insert("conversationSuggestions", {
        conversationId,
        questions: response.suggestedQuestions,
        createdAt: Date.now(),
      });
    }

    return { messageId };
  },
});

export const dismissInsight = mutation({
  args: {
    insightId: v.id("aiInsights"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const insight = await ctx.db.get(args.insightId);
    if (!insight || insight.userId !== userId) {
      throw new Error("Insight not found or access denied");
    }

    await ctx.db.patch(args.insightId, {
      status: "dismissed",
      metadata: {
        ...insight.metadata,
        dismissedAt: Date.now(),
        dismissalReason: args.reason,
      },
    });

    return { success: true };
  },
});
```

#### Convex Actions

```typescript
// convex/actions.ts (add to existing file)
export const generateAIResponse = action({
  args: {
    conversationId: v.id("chatConversations"),
    messageId: v.id("chatMessages"),
    context: v.any(),
  },
  handler: async (ctx, args) => {
    // This is the main AI orchestration action
    // It coordinates multiple AI calls and handles streaming

    const { conversationId, messageId, context } = args;

    // Initialize AI services
    const orchestrationService = new AIOrchestrationService();
    const documentRAGService = new DocumentRAGService();
    const portfolioService = new PortfolioIntelligenceService();

    // Get conversation details
    const conversation = await ctx.runQuery(api.queries.getConversation, {
      conversationId,
      includeMessages: true,
    });

    if (!conversation) throw new Error("Conversation not found");

    // Get user message
    const userMessage = conversation.messages?.find((m) => m._id === messageId);
    if (!userMessage) throw new Error("User message not found");

    // Build context
    const fullContext = await ctx.runQuery(api.queries.getConversationContext, {
      conversationId,
      includePortfolio: true,
      includeDocuments: true,
    });

    try {
      // Generate AI response
      const response = await orchestrationService.orchestrateResponse({
        conversationId,
        userMessage: userMessage.content,
        context: fullContext,
        tools: ["portfolio_analysis", "document_rag", "market_insights"],
      });

      // Create assistant message
      await ctx.runMutation(api.mutations.createAIMessage, {
        conversationId,
        response,
        context: fullContext,
      });

      // Generate proactive insights if needed
      if (Math.random() < 0.3) {
        // 30% chance to generate insights
        await ctx.runAction(api.actions.generateProactiveInsights, {
          userId: conversation.userId,
          trigger: "conversation_response",
        });
      }

      return response;
    } catch (error) {
      console.error("AI response generation failed:", error);

      // Create error message
      await ctx.runMutation(api.mutations.createAIMessage, {
        conversationId,
        response: {
          content:
            "I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.",
          citations: [],
          visualizations: [],
          suggestedQuestions: [
            "Can you help me understand my portfolio performance?",
            "What are the key insights from my recent documents?",
            "Are there any risks I should be aware of?",
          ],
          followUpActions: [],
          metadata: {
            model: "error",
            processingTime: Date.now(),
            error: error.message,
          },
        },
        context: fullContext,
      });

      throw error;
    }
  },
});

export const generateProactiveInsights = action({
  args: {
    userId: v.id("users"),
    trigger: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, trigger } = args;

    const portfolioService = new PortfolioIntelligenceService();

    // Generate insights
    const insights = await portfolioService.generateProactiveInsights(userId);

    // Store insights in database
    for (const insight of insights) {
      await ctx.runMutation(api.mutations.storeInsight, {
        userId,
        insight,
        trigger,
      });
    }

    return { insightsGenerated: insights.length };
  },
});
```

### 5.4 Schema Extensions

#### New Tables for Chat and AI

```typescript
// convex/schema.ts (add to existing schema)
// Chat conversations table
chatConversations: defineTable({
  userId: v.id("users"),
  title: v.string(),
  status: v.union(v.literal("active"), v.literal("archived"), v.literal("shared")),
  context: v.object({
    portfolioContext: v.optional(v.any()),
    documentContext: v.optional(v.array(v.any())),
    userPreferences: v.optional(v.any())
  }),
  metadata: v.object({
    messageCount: v.number(),
    lastActivity: v.number(),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string())
  }),
  createdAt: v.number(),
  updatedAt: v.number()
})
  .index("by_user", ["userId"])
  .index("by_status", ["status"])
  .index("by_lastActivity", ["metadata.lastActivity"]),

// Enhanced chat messages table
chatMessages: defineTable({
  conversationId: v.id("chatConversations"),
  userId: v.id("users"),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  content: v.string(),
  contentType: v.union(
    v.literal("text"),
    v.literal("markdown"),
    v.literal("chart"),
    v.literal("table"),
    v.literal("image")
  ),
  attachments: v.optional(v.array(v.object({
    id: v.string(),
    type: v.union(
      v.literal("document"),
      v.literal("chart"),
      v.literal("image"),
      v.literal("data")
    ),
    name: v.string(),
    url: v.optional(v.string()),
    data: v.optional(v.any()),
    metadata: v.optional(v.record(v.string(), v.any()))
  }))),
  citations: v.optional(v.array(v.object({
    id: v.string(),
    source: v.object({
      type: v.union(
        v.literal("document"),
        v.literal("portfolio_data"),
        v.literal("external")
      ),
      id: v.string(),
      title: v.string(),
      snippet: v.string(),
      url: v.optional(v.string())
    }),
    confidence: v.number(),
    relevanceScore: v.number()
  }))),
  metadata: v.object({
    tokens: v.optional(v.number()),
    processingTime: v.optional(v.number()),
    model: v.optional(v.string()),
    temperature: v.optional(v.number()),
    confidence: v.optional(v.number())
  }),
  reactions: v.optional(v.array(v.object({
    userId: v.id("users"),
    type: v.string(),
    createdAt: v.number()
  }))),
  threadId: v.optional(v.string()),
  createdAt: v.number()
})
  .index("by_conversation", ["conversationId"])
  .index("by_conversation_created", ["conversationId", "createdAt"])
  .index("by_user", ["userId"]),

// AI context cache table
aiContextCache: defineTable({
  userId: v.id("users"),
  contextType: v.union(
    v.literal("portfolio"),
    v.literal("document"),
    v.literal("conversation")
  ),
  contextKey: v.string(),
  contextData: v.any(),
  embeddings: v.optional(v.array(v.float64())),
  expiresAt: v.number(),
  createdAt: v.number()
})
  .index("by_user_type", ["userId", "contextType"])
  .index("by_key", ["contextKey"])
  .index("by_expires", ["expiresAt"]),

// AI insights and recommendations table
aiInsights: defineTable({
  userId: v.id("users"),
  type: v.union(
    v.literal("portfolio_performance"),
    v.literal("risk_alert"),
    v.literal("opportunity"),
    v.literal("trend"),
    v.literal("recommendation"),
    v.literal("performance_anomaly"),
    v.literal("market_opportunity")
  ),
  title: v.string(),
  description: v.string(),
  confidence: v.number(),
  priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
  data: v.optional(v.any()),
  actionItems: v.optional(v.array(v.string())),
  status: v.union(v.literal("new"), v.literal("viewed"), v.literal("acted_upon"), v.literal("dismissed")),
  metadata: v.optional(v.record(v.string(), v.any())),
  expiresAt: v.number(),
  createdAt: v.number()
})
  .index("by_user", ["userId"])
  .index("by_user_status", ["userId", "status"])
  .index("by_type", ["type"])
  .index("by_priority", ["priority"])
  .index("by_expires", ["expiresAt"]),

// Conversation suggestions table
conversationSuggestions: defineTable({
  conversationId: v.id("chatConversations"),
  questions: v.array(v.string()),
  context: v.optional(v.any()),
  createdAt: v.number()
})
  .index("by_conversation", ["conversationId"])
  .index("by_created", ["createdAt"]),
```

## 6. Task Completion Tracking

### 6.1 Implementation Timeline

| Phase   | Tasks                                      | Duration | Status     |
| ------- | ------------------------------------------ | -------- | ---------- |
| Phase 1 | Core chat infrastructure, UI components    | 3 weeks  | ⏳ Pending |
| Phase 2 | AI orchestration, context management       | 3 weeks  | ⏳ Pending |
| Phase 3 | Document intelligence integration, RAG     | 3 weeks  | ⏳ Pending |
| Phase 4 | Portfolio intelligence, proactive insights | 3 weeks  | ⏳ Pending |

### 6.2 Mandatory Workflows

#### Testing Strategy

- **Unit Tests**: AI service testing, component testing
- **Integration Tests**: AI orchestration testing, context management testing
- **E2E Tests**: Complete chat conversation flows
- **AI Response Testing**: Quality and accuracy validation
- **Performance Testing**: Response time and scalability testing

#### Quality Assurance

- **AI Response Quality**: Validate AI accuracy and relevance
- **Context Management**: Verify context building and retrieval
- **Conversation Flow**: Test multi-turn conversations
- **Document Integration**: Verify document RAG functionality
- **User Experience**: Test complete chat workflows

#### Documentation Requirements

- **AI Integration Documentation**: AI services and orchestration documentation
- **API Documentation**: Chat and AI function documentation
- **User Guide**: Chat assistant usage guide
- **Developer Documentation**: AI customization and extension guide

### 6.3 Success Metrics

#### Technical Metrics

- **Response Time**: < 3 seconds for AI responses
- **Streaming Latency**: < 500ms for first token
- **Context Accuracy**: > 90% relevant context inclusion
- **Citation Accuracy**: > 95% accurate source attribution
- **System Reliability**: > 99% uptime

#### User Experience Metrics

- **Conversation Success**: > 85% successful query resolution
- **User Satisfaction**: > 4.5/5 on AI assistant interactions
- **Feature Adoption**: > 70% of users use advanced features
- **Task Completion**: > 90% success rate for complex queries
- **User Retention**: > 80% return usage within 7 days

#### Business Metrics

- **Decision Support**: 40% improvement in investment decision speed
- **Data Utilization**: 60% increase in document usage
- **User Engagement**: 50% increase in time spent in platform
- **Support Reduction**: 30% reduction in support ticket volume
- **Insight Generation**: 25% increase in discovered insights

### 6.4 Risk Assessment and Mitigation

#### Technical Risks

- **API Costs**: Implement usage monitoring and cost controls
- **Response Quality**: Implement confidence scoring and fallback mechanisms
- **Context Limits**: Implement context management and compression
- **Performance**: Implement caching and optimization
- **AI Model Changes**: Implement abstraction layer for model flexibility

#### User Experience Risks

- **Complex Interactions**: Provide guided onboarding and tutorials
- **Response Accuracy**: Implement confidence indicators and source citations
- **Privacy Concerns**: Implement clear data usage policies and controls
- **Learning Curve**: Provide contextual help and suggestions
- **Trust Issues**: Provide transparency in AI reasoning

#### Business Risks

- **Cost Management**: Monitor and optimize AI API usage
- **Data Privacy**: Ensure compliance with data protection regulations
- **Competitive Differentiation**: Focus on unique value propositions
- **User Adoption**: Provide comprehensive onboarding and support
- **ROI Justification**: Track business impact and value generation

### 6.5 Handover and Deployment

#### Deployment Checklist

- [ ] AI services tested and validated
- [ ] All conversation flows working correctly
- [ ] Context management verified
- [ ] Document integration tested
- [ ] Portfolio intelligence working
- [ ] Proactive insights generating correctly
- [ ] Error handling implemented
- [ ] Monitoring configured
- [ ] Usage tracking implemented
- [ ] Documentation completed

#### Post-deployment Monitoring

- **AI Performance**: Monitor response quality and accuracy
- **Usage Analytics**: Track feature adoption and user behavior
- **Cost Monitoring**: Monitor AI API usage and costs
- **Error Tracking**: Monitor errors and exceptions
- **User Feedback**: Collect and analyze user feedback
- **Business Impact**: Track business metrics and ROI

#### Maintenance Plan

- **Regular Updates**: Update AI models and capabilities
- **Quality Assurance**: Monitor response quality and accuracy
- **Cost Optimization**: Optimize AI usage and costs
- **Feature Enhancement**: Add new AI capabilities
- **User Support**: Provide ongoing support and training
- **Documentation Updates**: Keep documentation up to date

## 7. AI Agent Instructions

### 7.1 Mandatory AI Agent Workflows

#### Agent Coordinator Instructions

- **Coordinate AI Implementation**: Ensure all AI services work together
- **Quality Assurance**: Validate AI response quality and accuracy
- **Integration Testing**: Test AI integration with existing systems
- **Performance Monitoring**: Monitor AI performance and user experience
- **Documentation**: Ensure comprehensive AI documentation

#### TypeScript Specialist Instructions

- **Type Safety**: Ensure strict TypeScript for AI services
- **AI Service Types**: Define proper types for AI responses
- **Error Handling**: Implement robust error handling for AI
- **Performance**: Optimize TypeScript for AI performance
- **Testing**: Write comprehensive AI service tests

#### UI/UX Architect Instructions

- **Conversational UI**: Design intuitive chat interface
- **User Experience**: Focus on natural conversation flow
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first chat interface
- **Visual Feedback**: Provide clear AI response indicators

#### Security Auditor Instructions

- **Data Privacy**: Secure AI data handling and storage
- **API Security**: Secure AI API integration
- **Access Control**: Implement proper access controls
- **Data Validation**: Validate AI inputs and outputs
- **Compliance**: Ensure compliance with AI regulations

### 7.2 Code Quality Standards

#### AI Service Standards

- **Response Quality**: Ensure high-quality AI responses
- **Context Management**: Proper context building and management
- **Error Handling**: Robust error handling and fallbacks
- **Performance**: Optimize for fast response times
- **Testing**: Comprehensive AI service testing

#### Chat Interface Standards

- **Usability**: Intuitive and easy-to-use chat interface
- **Accessibility**: Screen reader compatible
- **Responsive**: Works on all device sizes
- **Performance**: Smooth and responsive interactions
- **Real-time**: Real-time message streaming

#### Integration Standards

- **Data Flow**: Proper data flow between components
- **API Integration**: Clean and efficient API integration
- **Error Handling**: Proper error handling across services
- **Performance**: Optimized data loading and caching
- **Security**: Secure data handling and access

### 7.3 Testing Requirements

#### AI Service Testing

- **Unit Tests**: Test individual AI service methods
- **Integration Tests**: Test AI service integration
- **Response Quality**: Test AI response quality and accuracy
- **Performance Tests**: Test AI response times
- **Edge Cases**: Test edge cases and error conditions

#### Chat Interface Testing

- **Component Tests**: Test chat components
- **Integration Tests**: Test chat flow integration
- **Usability Tests**: Test user interface usability
- **Performance Tests**: Test interface performance
- **Accessibility Tests**: Test accessibility compliance

#### E2E Testing

- **Conversation Flows**: Test complete conversation flows
- **Multi-turn Conversations**: Test context persistence
- **Document Integration**: Test document analysis features
- **Portfolio Intelligence**: Test portfolio analysis features
- **Error Scenarios**: Test error handling and recovery

### 7.4 Documentation Requirements

#### Technical Documentation

- **AI Services Documentation**: Document all AI services
- **API Documentation**: Document chat and AI APIs
- **Integration Guide**: Document AI integration patterns
- **Architecture Documentation**: Document system architecture
- **Troubleshooting Guide**: Document common issues

#### User Documentation

- **User Guide**: Create comprehensive user guide
- **Feature Documentation**: Document chat features
- **Tutorial**: Create step-by-step tutorials
- **Best Practices**: Document chat best practices
- **FAQ**: Create frequently asked questions

#### Developer Documentation

- **Setup Guide**: Create AI development setup guide
- **Customization Guide**: Document AI customization
- **API Reference**: Create API reference documentation
- **Extension Guide**: Document AI extension patterns
- **Testing Guide**: Create AI testing guide

## 8. Conclusion

### 8.1 Summary

This comprehensive task document outlines the implementation of an AI Chat Assistant for the VC Portfolio OS. The solution uses a hybrid agentic approach that combines conversational AI, document intelligence, portfolio analysis, and proactive assistance to provide users with a sophisticated AI-powered investment assistant.

### 8.2 Key Deliverables

- **Interactive Chat Interface**: Real-time conversational AI with streaming responses
- **AI Orchestration Service**: Sophisticated AI service coordination and context management
- **Document Intelligence Integration**: Advanced RAG capabilities with existing document processing
- **Portfolio Intelligence**: AI-powered portfolio analysis and insights
- **Proactive Assistance**: Automated insight generation and recommendations

### 8.3 Success Criteria

- **Technical**: Fast response times, accurate AI responses, reliable system performance
- **User Experience**: Natural conversations, high satisfaction, easy adoption
- **Business**: Improved decision making, increased engagement, reduced support costs
- **Innovation**: Competitive differentiation through advanced AI capabilities

### 8.4 Next Steps

1. **Review and Approval**: Review this task document and get approval
2. **Phase 1 Implementation**: Begin with core chat infrastructure
3. **AI Service Development**: Develop AI orchestration and context management
4. **Integration Testing**: Test AI integration with existing systems
5. **User Testing**: Conduct comprehensive user testing
6. **Deployment and Monitoring**: Deploy to production and monitor performance

This implementation will provide a sophisticated AI assistant that transforms how VCs interact with their portfolio data, making investment analysis more accessible, efficient, and insightful through natural language interactions.

---

**Task Document Status**: ✅ Complete
**Version**: 1.0
**Created**: 2025-10-07
**Last Updated**: 2025-10-07
**Next Review**: 2025-10-14
