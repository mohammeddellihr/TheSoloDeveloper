# Task 2: Enable Next.js standalone output

**Status:** DONE

## What I implemented

Added `output: "standalone"` to `next.config.ts` to enable Next.js standalone build output mode. This produces a self-contained build in `.next/standalone` that includes only the server files needed to run the app (~15-20MB), required for Docker deployment.

## Files changed

- `next.config.ts` — Replaced placeholder comment with `output: "standalone"`

## Verification

- `npm run build` succeeded
- `.next/standalone` directory confirmed to exist after build
- No TypeScript errors

## Self-review

- Implementation matches the plan spec exactly
- Clean, minimal change — only the config option added
- Follows existing code conventions

## Concerns

- Git was not available in this environment, so the commit step was skipped. The user should run:
  ```
  git add next.config.ts
  git commit -m "feat: enable Next.js standalone output for Docker"
  ```
