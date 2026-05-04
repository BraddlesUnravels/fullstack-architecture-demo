# Copilot review instructions

When reviewing pull requests in this repository, focus on:

## Correctness

- Identify logic bugs, edge cases, race conditions, and incorrect assumptions.
- Check whether changed code handles null, undefined, empty arrays, failed fetches, and invalid user input.
- Flag changes that introduce hidden breaking changes.

## Bun / TypeScript

- Prefer Bun-native commands and APIs where appropriate.
- Check that dependency changes are reflected in `bun.lock`.
- Prefer explicit types for public functions, API boundaries, and exported objects.
- Avoid unnecessary `any`.
- Check that async code correctly awaits promises.

## Testing

- Suggest tests for new behavior, bug fixes, and edge cases.
- Prefer `bun test` compatible tests.
- Point out missing regression tests when a bug fix is made.

## Security

- Flag unsafe use of environment variables, secrets, tokens, eval-like behavior, user-controlled paths, SQL injection risks, and unsafe shell execution.
- Do not suggest logging secrets or sensitive user data.

## Style

- Keep feedback concise and actionable.
- Prefer comments that explain the risk and suggest a specific fix.
- Do not comment on trivial formatting unless it affects readability or correctness.
