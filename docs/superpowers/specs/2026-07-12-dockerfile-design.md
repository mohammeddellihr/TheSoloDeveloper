# Dockerfile Design

**Date:** 2026-07-12  
**Status:** Approved  
**Scope:** Production Docker image for TheSoloDeveloper issue tracker

## Context

TheSoloDeveloper is a Next.js 16 App Router project with SQLite (better-sqlite3) for data storage. Currently there is no Docker configuration. The goal is to create a production-ready Docker image that is as lightweight as possible.

## Requirements

- Production-only Dockerfile
- Lightweight image (Alpine-based)
- SQLite database persisted via volume mount
- Handle better-sqlite3 native module compilation

## Approach: Alpine Multi-stage Build

### Dockerfile Structure

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| `deps` | `node:20` | Install dependencies, compile native modules |
| `builder` | `node:20` | Build Next.js with standalone output |
| `runner` | `node:20-alpine` | Final slim image |

### Why Multi-stage

1. `better-sqlite3` requires native compilation (node-gyp, gcc, make, python3)
2. These build tools are NOT needed in the final image
3. Build in `node:20` (has all tools), copy only the compiled `.node` binary to Alpine

### Why Standalone Output

Next.js standalone output mode (`output: 'standalone'` in next.config.ts):
- Copies only the server files needed to run the app (~15-20MB)
- Does NOT include the full `.next` build output (~200MB+)
- Official Next.js recommendation for Docker deployments

### SQLite Storage

- SQLite database is ephemeral — stored inside the container
- Data is lost when the container is removed
- No volume mount required

## Files to Create/Modify

### 1. `Dockerfile` (new)

Multi-stage build with three stages as described above.

### 2. `.dockerignore` (new)

Exclude from build context:
- `node_modules/`
- `.next/`
- `.git/`
- `data.db*`
- `*.md`
- `.env*`

### 3. `next.config.ts` (modify)

Add `output: 'standalone'` to the Next.js configuration.

## Image Size Estimate

- Alpine base: ~50MB
- Node.js runtime: ~80MB
- Standalone output: ~15-20MB
- Native module (better-sqlite3): ~2MB
- **Total: ~150MB** (vs ~1GB+ for full Node image)

## Usage

```bash
# Build
docker build -t thesoleodeveloper .

# Run
docker run -p 3000:3000 thesoleodeveloper
```

## Trade-offs

| Concern | Decision | Rationale |
|---------|----------|-----------|
| Alpine vs Debian | Alpine | ~150MB vs ~1GB+, minimal attack surface |
| Standalone vs full | Standalone | Official recommendation, much smaller |
| Storage | Ephemeral | User confirmed, no persistence needed |

## Risks

1. **Native module compatibility:** The compiled `better-sqlite3` binary from `node:20` (Debian) should work on `node:20-alpine` (musl libc) because Alpine's Node image includes glibc compatibility. If issues arise, fallback to Debian-slim base.

2. **Next.js standalone limitations:** Standalone output doesn't include static assets by default. This app is server-rendered (no static export), so this is fine.

## Success Criteria

- [ ] Docker image builds successfully
- [ ] Image size is under 200MB
- [ ] App starts and serves on port 3000
- [ ] `better-sqlite3` works correctly in the container
