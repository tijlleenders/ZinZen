# Git Conventions

Before merging code into the main branch, it undergoes a thorough peer review to ensure quality and readiness for deployment. Your code submissions should be crafted for clarity and ease of review.

## Committing Process

- **Small Commits:** Make commits small and logical, easy to understand and follow.
- **Review Before Committing:** Before committing, review each file for temporary or test code, warnings, formatting issues, and unnecessary packages.
- **Frequent Commits:** Commit often to track progress and create a transparent history of your work.
- **Early Pull Requests:** Make PRs as soon as possible to integrate changes quickly and reduce conflicts.

## Before Pushing Your Code

- **No Warnings:** Ensure there are no warnings in your code. The development and main branches should be free of warnings to make it easier to spot new issues introduced by recent code changes.

## Branching Convention

- **Naming Format:** Use the format `[developer shortcut]/[issue number]/[meaningful name]`, like `alice/411/fix-budgets-on-weekends`.
- **Developer Specific:** Branches should be developed by the assigned developer only to maintain clarity in the development process.
- **Merging and Deletion:** Once finished, branches should be merged into the main branch after PR review and then deleted.
- **Collaborating on Branches:** If you need to work on another developer's branch, create a new branch from it using the same naming convention.
