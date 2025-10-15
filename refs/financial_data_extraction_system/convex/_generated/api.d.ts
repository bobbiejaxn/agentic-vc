/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as chatActions from "../chatActions.js";
import type * as documents from "../documents.js";
import type * as enhancedChat from "../enhancedChat.js";
import type * as enhancedChatActions from "../enhancedChatActions.js";
import type * as enhancedProcessing from "../enhancedProcessing.js";
import type * as enhancedProcessingActions from "../enhancedProcessingActions.js";
import type * as http from "../http.js";
import type * as markdownParser from "../markdownParser.js";
import type * as metrics from "../metrics.js";
import type * as processing from "../processing.js";
import type * as processingActions from "../processingActions.js";
import type * as router from "../router.js";
import type * as smartChunking from "../smartChunking.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chat: typeof chat;
  chatActions: typeof chatActions;
  documents: typeof documents;
  enhancedChat: typeof enhancedChat;
  enhancedChatActions: typeof enhancedChatActions;
  enhancedProcessing: typeof enhancedProcessing;
  enhancedProcessingActions: typeof enhancedProcessingActions;
  http: typeof http;
  markdownParser: typeof markdownParser;
  metrics: typeof metrics;
  processing: typeof processing;
  processingActions: typeof processingActions;
  router: typeof router;
  smartChunking: typeof smartChunking;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
