In Convex, choosing between queries, mutations, and actions—and deciding whether to make a function internal or external—is essential for clean, secure, and scalable software engineering. Here’s a practical guide to help both AI systems and junior devs consistently decide which to use for every use case.[1][2][3][4][5][6]

---

### Query, Mutation, and Action: Key Differences

| Function Type | Use Case                 | Side Effects |  DB Writes   | Calls External APIs | Transactional | Public/Private | Realtime |
| :-----------: | :----------------------- | :----------: | :----------: | :-----------------: | :-----------: | :------------: | :------: |
|     Query     | Read data                |      No      |      No      |         No          |      Yes      | Usually Public |   Yes    |
|   Mutation    | Change/write data        |    Yes\*     |     Yes      |         No          |      Yes      | Public/Private |   Yes    |
|    Action     | External APIs, workflows |     Yes      | Via mutation |         Yes         |      No       |  Private\*\*   |    No    |

- \*Mutations must be side-effect free except for DB changes (no network calls).
- \*\*Actions should usually be "internal"—not directly callable by clients.

---

### How to Decide

#### 1. When to use **query**

- Fetch/read-only data from the database.
- No side effects—just return data (e.g., get user info, list items).
- Should be idempotent: always returns same result for same input.
- Can be public or private based on sensitivity.

#### 2. When to use **mutation**

- Write/change database data, such as insert, update, or delete operations.
- No network requests (mutations are transactional and deterministic).
- Use for most user interactions that edit app state.
- Can be public (called directly by frontend) or internal (if sensitive).

#### 3. When to use **action**

- Needs to call external APIs or use Node.js libs (fetch, Stripe, LLMs, etc).
- Needs to run workflows (e.g., queueing, file uploads, email sending).
- Non-transactional: side effects cannot be rolled back.
- Should be kept **internal**—don’t expose directly to the client.
- Often scheduled by a mutation, not called directly.

---

### Internal vs External (Public vs Private)

- **External (public):** Functions exposed to the client (can call from React via `useMutation`, `useQuery`, etc.).
- **Internal (private):** Only callable by other server functions—hide from frontend, add extra validation, or prevent direct invocation by users.[1]

---

### Patterns and Best Practices

- **Internal mutations/actions:** Use for sensitive operations (e.g., billing, admin tasks). Only call these from other backend logic, never directly from the client.
- **Queries:** Most are public, but hide if they expose secrets.
- **Actions:** Always internal unless there’s a trusted, secure reason to expose (rare). Schedule them from mutations or call via workflows.[3][1]
- **Argument validation:** Always add for all function types.[7]

---

### Practical Example

Suppose you want to process payments after a user creates an order:

```typescript
// mutation: called from frontend
export const createOrder = mutation({
  args: { items: v.array(v.string()) },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", { items: args.items });
    // Schedule the action to call external API (payment)
    await ctx.scheduler.runAfter(0, internal.processPayment, { orderId });
    return orderId;
  },
});

// action: INTERNAL, calls the payment API
export const processPayment = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    // call Stripe or other API here
    // update DB status asynchronously as needed
  },
});
```

- Never call `processPayment` directly from the client; always via mutation scheduling.[8][5]

---

### Quick Reference Table

| If you need...            | Use...          | Public?  |
| ------------------------- | --------------- | -------- |
| To read data              | Query           | Usually  |
| To write DB data          | Mutation        | Often    |
| To call an API/send email | Action          | Internal |
| To combine flows          | Mutation+Action | Internal |

---

AI and junior devs should always follow these patterns for Convex software:[2][5][6][7][3][1]

- Use queries for simple reads, mutations for transactional writes, and actions for workflows/external IO.
- Mark sensitive or complex workflow functions as internal so only backend logic can trigger them, protecting security and business flow semantics.In Convex, the choice between **query**, **mutation**, and **action** is not arbitrary—it mirrors classic backend engineering best practices to ensure predictable, secure, and maintainable software. Below is a guide for junior developers and AI coding assistants to apply these distinctions systematically, for both internal (backend-only) and external (client-facing) functions.[5][6][2][7][3][1]

---

### Convex Function Types: Cheat Sheet

| Type     | Use For                         | Side Effects Allowed | DB Write     | External API Call | Transactional | Expose to Client?        |
| -------- | ------------------------------- | -------------------- | ------------ | ----------------- | ------------- | ------------------------ |
| Query    | Reading Data (pure computation) | No                   | No           | No                | Yes           | Yes, usually             |
| Mutation | Changing Data/State             | Only DB change       | Yes          | No                | Yes           | Yes/No (can be internal) |
| Action   | Workflows, external API calls   | Yes                  | Via mutation | Yes               | No            | No (internal only)       |

---

### Internal vs External

- **External**: Called from the client app (React/Vite/Next.js)—safe, user-facing, never exposes secrets.
- **Internal**: Only used by server code (never exposed to client in API)—for security, complexity, or to avoid race conditions.

---

### When to Use Each

**Use a Query** when:

- You need to fetch/read data (e.g., user list, product catalog).
- The result is deterministic and won't change DB state.
- You want real-time updates in frontend.

**Use a Mutation** when:

- You need to insert, update, or delete data.
- All DB writes must be part of a single atomic transaction.
- Never do IO/network requests in mutations.

**Use an Action** when:

- You need to call external APIs (Stripe, OpenAI, send emails, etc).
- You’re doing async workflows or multi-step jobs (webhooks, file uploads).
- Actions aren’t transactional: failed calls won’t rollback DB changes.

---

#### Typical Flow Pattern

```typescript
// Public mutation: called from client app
export const createOrder = mutation({
  args: { items: v.array(v.string()) },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", { items: args.items });
    // Schedule internal action for payment or email
    await ctx.scheduler.runAfter(0, internal.processPayment, { orderId });
    return orderId;
  },
});

// Internal action: only server calls, triggers external IO
export const processPayment = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    // Call Stripe, update status with runMutation, etc
  },
});
```

- Internal actions should _never_ be exposed to the client, but called by another server function.[7][3][5][1]
- Use argument validators in all functions for type safety.

---

### Key Engineering Principles

- Queries and mutations remain transactional and deterministic; actions sacrifice these properties for flexibility in IO/workflow.[6][3][5][1][7]
- Never let the frontend schedule IO or workflow directly—always trigger actions from a validated mutation.
- Organize internal vs external functions via file structure and API export (mark sensitive actions and mutations “internal”).

---

By following this pattern, junior developers and AI will produce reliable, secure code, with each function type doing exactly what it should—public queries/mutations for user state, internal actions for workflows and external side effects, and argument validation everywhere.[2][3][5][1][7]

[1](https://docs.convex.dev/functions/actions)
[2](https://docs.convex.dev/functions/mutation-functions)
[3](https://stack.convex.dev/ready-for-actions)
[4](https://docs.convex.dev/tutorial/actions)
[5](https://docs.convex.dev/understanding/)
[6](https://www.convex.dev/faq)
[7](https://docs.convex.dev/understanding/best-practices/)
[8](https://www.answeroverflow.com/m/1326606524243644509)
[9](https://docs.convex.dev/functions/query-functions)
[10](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339)
[11](https://hub.continue.dev/uinstinct/convex-rules)
[12](https://dev.to/convexchampions/transactional-email-in-convex-with-bluefox-and-aws-ses-4kpc)
[13](https://hub.continue.dev/ari-m/convex-rules)
[14](https://www.answeroverflow.com/c/1019350475847499849)
[15](https://www.answeroverflow.com/m/1134162924592705537)
[16](https://www.answeroverflow.com/m/1149747831066873856)
[17](https://www.convex.dev/typescript/core-concepts/functions-methods/typescript-return-type)
[18](https://blog.logrocket.com/using-convex-for-state-management/)
[19](https://www.cursorrules.org/article/convex-cursorrules-prompt-file)
