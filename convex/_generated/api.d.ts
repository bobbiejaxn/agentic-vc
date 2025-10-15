/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentExtractionResults from "../agentExtractionResults.js";
import type * as auth from "../auth.js";
import type * as authQueries from "../authQueries.js";
import type * as chunkingTests from "../chunkingTests.js";
import type * as conversations from "../conversations.js";
import type * as documents from "../documents.js";
import type * as enhancedChunking from "../enhancedChunking.js";
import type * as enhancedHybridChunks from "../enhancedHybridChunks.js";
import type * as enhancedProcessing from "../enhancedProcessing.js";
import type * as funds from "../funds.js";
import type * as messages from "../messages.js";
import type * as mistral from "../mistral.js";
import type * as mistralOCR from "../mistralOCR.js";
import type * as portfolioCompanies from "../portfolioCompanies.js";
import type * as users from "../users.js";
import type * as vectorSearch from "../vectorSearch.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  agentExtractionResults: typeof agentExtractionResults;
  auth: typeof auth;
  authQueries: typeof authQueries;
  chunkingTests: typeof chunkingTests;
  conversations: typeof conversations;
  documents: typeof documents;
  enhancedChunking: typeof enhancedChunking;
  enhancedHybridChunks: typeof enhancedHybridChunks;
  enhancedProcessing: typeof enhancedProcessing;
  funds: typeof funds;
  messages: typeof messages;
  mistral: typeof mistral;
  mistralOCR: typeof mistralOCR;
  portfolioCompanies: typeof portfolioCompanies;
  users: typeof users;
  vectorSearch: typeof vectorSearch;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
