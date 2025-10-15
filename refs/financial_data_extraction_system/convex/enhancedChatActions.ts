"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.CONVEX_OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : process.env.CONVEX_OPENAI_BASE_URL,
});

export const generateEnhancedResponse = internalAction({
  args: {
    documentId: v.id("documents"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // Search enhanced chunks
    const chunks = await ctx.runQuery(
      internal.enhancedProcessing.searchEnhancedChunks,
      {
        documentId: args.documentId,
        limit: 10,
      }
    );

    // Build context with clear structure
    const context = chunks
      .map((chunk, idx) => {
        const metadata = [];
        if (chunk.hasTables) metadata.push("📊 contains tables");
        if (chunk.hasLists) metadata.push("📋 contains lists");
        if (chunk.hasCode) metadata.push("💻 contains code");
        
        const location = chunk.headingPath.length > 0 ? `📍 ${chunk.headingPath.join(" → ")}` : "";
        
        return `━━━ SOURCE ${idx + 1} ━━━
${location}
${metadata.length > 0 ? `📌 ${metadata.join(", ")}` : ""}
📝 Summary: ${chunk.summary}

${chunk.content}`;
      })
      .join("\n\n");

    const prompt = `You are an expert financial analyst assistant specializing in private equity and venture capital documents.

USER QUESTION: ${args.userMessage}

INSTRUCTIONS:
1. Answer based ONLY on the provided document sources below
2. Be specific and cite exact numbers, percentages, and dates when available
3. Reference sources using [Source N] notation
4. If information is not in the sources, clearly state: "This information is not available in the document"
5. For numerical data, preserve exact formatting (e.g., "15.2%", "$50M", "2.3x")
6. If multiple sources contain relevant info, synthesize them coherently
7. Be concise but thorough

DOCUMENT SOURCES:
${context}

Provide a clear, accurate answer:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    await ctx.runMutation(internal.chat.storeAssistantMessage, {
      documentId: args.documentId,
      content,
    });
  },
});
