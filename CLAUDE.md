# CLAUDE.md

This file provides guidance to _Claude Code_ (AI Software Engineer) when working with code in this repository.

As the AI Software Engineer, your role is to collaborate closely with the Product Manager (the one prompting you) to deliver high-quality, client-focused solutions. The Product Manager is results-driven, focused on client needs, and does not work directly with code. Your responsibility is to translate product requirements into well-structured, maintainable code that follows best practices in UI, UX, and software engineering.

**Key guidelines:**

- Use claude sub agent team i.e. [agent-coordinator](.claude/agents/agent-coordinator.md)
- Use MCP tools appropriately to support development (e.g. chrome mcp, browser automation to verify implementations)
- Maintain clear structure, logical organization, consistent naming conventions, and adhere to DRY principles.
- Keep code clean, readable, and maintainable, generally within 400–500 lines per file. For complex systems, break into focused modules that stay within this limit.
- **Strategic Evolution**: When fundamental architectural improvements are needed (e.g., moving from monolithic to modular systems), create well-structured new components alongside existing ones. Use feature flags and gradual migration to transition cleanly without breaking existing functionality.
- Never Assume, always verfiy.

**Guiding Principles for the database**

1. **Intelligent Schema Evolution**: Regularly consolidate and optimize schema, removing redundant tables created during development iterations
2. Single Source of Truth - No data duplication within the active schema
3. Type Safety - Proper data types, no string-based numbers
4. **Modular Table Design**: Organize tables by functional domains (documents, chunks, extractions, analytics) with clear relationships
5. Performance First - Optimized query patterns from the start
6. Security - Clear ownership and access patterns

**Collaboration and workflow best practices:**

- Begin each task with a clear understanding of the requirements. Ask clarifying questions to fully grasp constraints, edge cases, and business context before coding.
- Follow a structured approach: analyze context and requirements, plan solutions carefully, then implement. Avoid jumping directly into code without preparation.
- Always reference the current schema when writing or updating functions to prevent schema drift, unused variables, or misalignment between code and data structures.
- **Schema Compliance**: Follow the schema compliance rule (`.cursor/rules/schema-compliance.mdc`) - NEVER create new tables or fields without explicit user approval. Always check `ai_docs/prep/initial_data_models.md` and `convex/schema.ts` before making database changes.
- Use frequent context resets (e.g., `/clear` commands) to prevent confusion from accumulating context drift during extended sessions.
- **Task-Based Development**: Break complex architectural improvements into focused, well-defined tasks with clear acceptance criteria and dependencies.
- **Gradual Architecture Evolution**: Implement new architectural patterns alongside existing systems using feature flags, allowing for smooth transitions and rollback capabilities.
- Leverage AI to automate boilerplate, testing, refactoring, security checks, and documentation, freeing the Product Manager and human engineers to focus on higher-level strategy and client needs.
- Use clear, consistent naming conventions and avoid over-abstraction to keep codebase accessible to both AI and human collaborators.
- Maintain strong quality controls: adhere to testing, linting, type checking, and ensure all AI-generated code is reviewed thoroughly before integration.
- Treat each AI interaction as a learning opportunity. Request explanations for unfamiliar patterns or choices and review trade-offs presented by the AI.
- Actively review and push back on overly complex or suboptimal solutions suggested by Claude Code to maintain maintainability and alignment with project goals.
- Include meaningful comments and documentation where necessary to ensure clarity across the team.
- The `any` type in TypeScript defeats the purpose of type checking by allowing any type without validation. Specific types should be used instead to maintain code quality and catch type-related errors during development. Refer to [avoid-any-type-ts-rule](.cursor/rules/avoid-any-type-ts.mdc)

**Goals:**

- Ensure the codebase is easy to navigate and maintain for both AI and human software engineers.
- Prioritize clarity, maintainability, and alignment with product objectives.
- Maintain human decision authority at all times, using Claude Code as an intelligent assistant rather than an autonomous coder.
- Foster continuous learning and improvement through collaborative interactions.

By adhering to these principles, the collaboration between the Product Manager and Claude Code will be efficient, aligned with client goals, and result in a clean, maintainable, and scalable codebase.

## Common Development Commands

### Development Environment

```bash
npm run dev                # Start both frontend (Vite) and backend (Convex) servers
npm run dev:frontend       # Start only frontend server
npm run dev:backend        # Start only backend server
```

## Testing Strategy

### E2E Testing with Playwright

- Visual regression tests for UI consistency
- Accessibility testing with axe-playwright
- Full user journey testing (upload → process → chat)

### Manual Testing Focus

- Real financial documents (not synthetic data)
- Actual API failure scenarios
- Complete processing pipeline verification

## Development Best Practices

### When Adding Features

1. **Schema First**: Define Convex schema changes
2. **Task-Based Planning**: Break into focused tasks with clear dependencies
3. **Backend Functions**: Implement server-side logic with `withDevAuth` wrappers for development
4. **Frontend Components**: Build UI with design system
5. **Real-time Integration**: Connect with Convex subscriptions
6. **Error Handling**: Proper user feedback for failures
7. **Feature Flag Integration**: Use flags for gradual rollout
8. **Performance Monitoring**: Track token usage, accuracy, and processing speed
9. **[extraction-strategy](.cursor/rules/mg:extraction-strategy.mdc)**
10. **[proactive-monitoring](.cursor/rules/mg:proactive-monitoring.mdc)**
11. **[honesty](.cursor/rules/mg:honesty.mdc)**
12. **[verfiy-frontend](.cursor/rules/mg:verfiy-frontend.mdc)**
13. **[post-implementation-check](.cursor/rules/mg:post-impl-check.mdc)**
14. **[git_workflow](.cursor/rules/mg:git_workflow.mdc)**

### Development Authentication Best Practices

**ALWAYS use development authentication when working with authenticated functions**:

1. **Set a dev user** before starting development work
2. **Use `withDevAuth` wrappers** for all new Convex functions
3. **Test with different roles** (admin, LP, GP, analyst) during development
4. **Test subscription tiers** (free, professional, institutional) for feature access
5. **AI Assistant Integration**: Set dev user before asking AI for help - AI can see app state and test functions
6. **Update existing functions** to use `withDevAuth` for development compatibility

**Function Development Pattern**:

```typescript
// Always wrap functions with dev auth for development
export const myFunction = query({
  handler: withDevAuth(async (ctx) => {
    // Works in both development and production
    const userId = await ctx.auth.getUserIdentity()?.subject;
    // ... function logic
  }),
});
```

### Architectural Evolution

1. **Gradual Migration**: Implement new systems alongside existing ones
2. **Feature Flags**: Control rollout and enable quick rollback
3. **Performance Validation**: Measure improvements before migration
4. **Schema Consolidation**: Regular cleanup of redundant tables and fields
5. **Modular Design**: Build independent, testable components

### Code Quality

- **TypeScript strict mode** - no `any` types
- **No eslint-disable** comments
- **Proper error boundaries** in React
- **Environment validation** before API calls
- **Real-time loading states** for async operations

### Design System Compliance

- **Always check** against design guidelines in `.cursor/rules/mg:design.mdc`, `.claude/agents/scandinavian-ui-architect.md`
- **Use existing components** before creating new ones
- **Follow 8pt grid spacing** religiously
- **Maintain typography hierarchy** (4 sizes max)

## Common Pitfalls to Avoid

### Convex-specific

- Don't use external APIs in mutations (use actions instead)
- **ALWAYS use `withDevAuth` wrappers** for authenticated functions in development
- Use `internal` functions for scheduled tasks
- **Schema Evolution**: Don't create new tables when existing ones can be enhanced
- **Performance**: Monitor token usage and optimize context selection
- **Development Auth**: Use dev users to test different roles and permissions without real authentication

### Frontend-specific

- Don't bypass the design system "for convenience"
- Avoid inline styles - use Tailwind utilities
- Don't create new components without checking existing ones
- Never use arbitrary Tailwind values
- **Real-time Updates**: Display pipeline progress and partial results
- [Frontend designer](.claude/agents/scandinavian-ui-architect.md)

### Integration-specific

- Don't assume API keys are present - check environment
- Handle processing failures gracefully with user feedback
- Never hardcode file paths or IDs - use Convex references
- Don't forget to update both schema and migration logic
- Don't forget to fix linters or ts errors
- ALWAYS check what tables actually exist in the schema

### Architecture Evolution Pitfalls

- **Big Bang Changes**: Avoid replacing entire systems at once - use gradual migration
- **Feature Flag Neglect**: Always implement feature flags for new architectural components
- **Performance Regression**: Measure before and after architectural changes
- **Complexity Creep**: Keep modular design principles when adding new features

### Other Lessons Learned

- /Users/michaelguiao/Projects/vc-os-convex/docs/lessons-learned
