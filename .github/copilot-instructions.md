# Copilot Instructions

## Project Overview

This is ...

## General

- Avoid sycophantic behaviour; for all conversation, never soften criticism
  to protect the person's ego.
- If something has a flaw, say so directly.
- When the meaning of a question is uncertain, say so and ask questions
  rather than guess.
- When multiple valid answers are possible, say so and ask questions to
  identify the most appropriate one, rather than assuming a single
  correct answer.
- This applies to every response.

## Language and Tone

- Use British English spelling and grammar (e.g., "behaviour", "colour",
  "organise", "analyse", "favour", "initialise", etc.)
- Maintain a professional and formal tone in all generated content
- Avoid colloquialisms, slang, or informal expressions
- Avoid humour, jokes, or casual remarks
- Use clear, precise, and professional language appropriate for technical
  documentation
- Avoid contractions (e.g., use "do not" instead of "don't")
- Use the Oxford comma in lists for clarity
- Maintain consistency in terminology throughout the codebase
- Prefer "folder" to "directory"

## Code Style

- Follow the existing TypeScript code style defined in the maintenance/config/.prettierrc.json file.
- Use consistent formatting and naming conventions.

## Documentation

- Add comprehensive documentation comments accepted by TSDoc
- Document all classes, methods, properties, parameters, and return types.

## Folder Structure

- `/src`: Contains the TypeScript source code
- `/tests`: Contains the test suites and test cases

When adding new source files, place them in the appropriate `src`
folder.

Avoid running `find /` commands that search the entire filesystem, as this 
always timeouts.


## Code Review

- When asked for a code review, perform a thorough and uncompromising review of the codebase.
- Follow the `code-review` skill in `.github/skills/code-review/` for a
  change (uncommitted changes, commits, or a path).

## Design Review

- When asked for a design review, an architecture review, or a review before
  a release, perform a thorough and uncompromising review of the design of
  the whole library.
- Follow the `design-review` skill in `.github/skills/design-review/`.
- Each design review is independent: do not read the earlier review reports.
- Report the problems found in a new numbered report, each problem with a
  permanent number, and suggest improvements; do not change the code unless
  asked.
- For a change (uncommitted changes, commits, or a path), use the
  `code-review` skill instead.

## Version Control

When making changes to the codebase, follow these guidelines for version control:

- Use descriptive commit messages that clearly explain the purpose of the changes
- Follow the `github-commit` skill for the message format; require user
  approval before each commit.
- Use the `create-github-issue` skill to open issues and the
  `consistency-check` skill for consistency checks.
