"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateResponse = internalAction({
  args: {
    documentId: v.id("documents"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.runQuery(internal.processing.searchRelevantChunks, {
      documentId: args.documentId,
      query: args.userMessage,
    });

    const context = chunks.map((c) => c.content).join("\n\n");

    const prompt = `You are a financial analyst assistant. Answer the user's question based on the following document context. Be concise and accurate.

Context:
${context}

User Question: ${args.userMessage}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
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
