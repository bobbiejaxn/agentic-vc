# Lessons Learned & Insights

This directory is a continuously updated knowledge base for documenting issues encountered during development, along with their solutions and key takeaways. Its purpose is to help the team avoid repeating mistakes and to facilitate knowledge sharing.

---

## Naming Convention for Files and Folders

- **Folder Naming:**  
  Use lowercase, hyphen-separated names for folders that group related issues by category or technology.  
  _Example:_ `typescript-errors`, `deployment-issues`, `database-migrations`

- **File Naming:**  
  Use lowercase, hyphen-separated names for individual issue files. The file name should briefly summarize the issue or lesson.  
  _Example:_ `avoid-any-type.md`, `env-variable-mismatch.md`, `missing-index-error.md`

- **Structure:**
  - Place each issue as a separate Markdown file inside the appropriate category folder.
  - If an issue does not fit an existing category, create a new folder following the above convention.

---

## How to Use

For each issue, create a new folder or file under `/docs/lessons-learned` according to its category and the naming conventions above. Use the following template for each entry:

### Title

_A brief, descriptive summary of the issue or lesson._

### Issue

_Describe the problem or challenge, including relevant context, symptoms, and how it was discovered._

### Root Cause

_Explain the underlying cause of the issue, if identified._

### Solution / Fix

_Outline the steps taken to resolve the issue. Include code snippets, configuration changes, or process updates as appropriate._

### Lessons Learned

_Summarize the main takeaways, best practices, or preventive measures for the future._

---

## Example Entry

**File:** `typescript-errors/avoid-any-type.md`

### Title

TypeScript: Avoiding the `any` Type

### Issue

A function was using the `any` type for parameters and return values, which resulted in missed type errors and runtime bugs.

### Root Cause

The absence of strict type annotations allowed unsafe code to bypass linting and type checks.

### Solution / Fix

Replaced all `any` types with specific interfaces and union types. Enabled `strict: true` in `tsconfig.json`.

### Lessons Learned

- Always use specific types instead of `any`.
- Enable strict mode in TypeScript for improved type safety.
- Review code for type safety during code reviews.

---

Continue to add new entries in this folder as you encounter and resolve issues during development, following the naming conventions above.
