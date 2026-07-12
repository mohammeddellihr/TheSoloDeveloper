# Dockerfile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a production-ready Alpine-based Docker image for TheSoloDeveloper issue tracker with ephemeral SQLite storage.

**Architecture:** Multi-stage Dockerfile with three stages: deps (compile native modules), builder (Next.js standalone build), runner (Alpine final image). SQLite database is ephemeral inside the container.

**Tech Stack:** Docker, Next.js 16, Node.js 20, Alpine Linux, better-sqlite3

## Global Constraints

- Base image: `node:20` for build stages, `node:20-alpine` for runner
- Next.js standalone output mode required
- SQLite database is ephemeral (no volume mount)
- Port: 3000
- No comments in Dockerfile or .dockerignore

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `.dockerignore` | Create | Exclude unnecessary files from build context |
| `next.config.ts` | Modify | Add `output: 'standalone'` |
| `Dockerfile` | Create | Multi-stage build |

---

### Task 1: Create `.dockerignore`

**Files:**
- Create: `.dockerignore`

**Interfaces:**
- Consumes: None (standalone config file)
- Produces: Docker build context exclusion rules

- [ ] **Step 1: Create .dockerignore**

```
node_modules
.next
.git
data.db
data.db-shm
data.db-wal
*.md
.env*
install.bat
run.bat
.superpowers
```

- [ ] **Step 2: Commit**

```bash
git add .dockerignore
git commit -m "chore: add .dockerignore"
```

---

### Task 2: Enable Next.js standalone output

**Files:**
- Modify: `next.config.ts:3-5`

**Interfaces:**
- Consumes: None (config change)
- Produces: Standalone build output in `.next/standalone`

- [ ] **Step 1: Add output: 'standalone' to next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Build succeeds, `.next/standalone` directory is created

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: enable Next.js standalone output for Docker"
```

---

### Task 3: Create Dockerfile

**Files:**
- Create: `Dockerfile`

**Interfaces:**
- Consumes: `.dockerignore` (Task 1), standalone output (Task 2)
- Produces: Docker image `thesoleodeveloper`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:20 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] **Step 2: Commit**

```bash
git add Dockerfile
git commit -m "feat: add multi-stage Alpine Dockerfile"
```

---

### Task 4: Test Docker build

**Files:**
- None (verification task)

**Interfaces:**
- Consumes: Dockerfile (Task 3)
- Produces: Verified working Docker image

- [ ] **Step 1: Build Docker image**

Run: `docker build -t thesoleodeveloper .`
Expected: Build completes successfully

- [ ] **Step 2: Check image size**

Run: `docker images thesoleodeveloper`
Expected: Image size under 200MB

- [ ] **Step 3: Run container and test**

Run: `docker run -d --name test-app -p 3000:3000 thesoleodeveloper`
Expected: Container starts, app accessible at http://localhost:3000

- [ ] **Step 4: Cleanup**

Run: `docker stop test-app && docker rm test-app`

---

## Success Criteria

- [ ] `.dockerignore` excludes unnecessary files
- [ ] `next.config.ts` has `output: 'standalone'`
- [ ] `Dockerfile` builds successfully
- [ ] Image size is under 200MB
- [ ] App starts and serves on port 3000
- [ ] `better-sqlite3` works correctly in the container
