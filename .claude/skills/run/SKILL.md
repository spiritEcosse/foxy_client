---
name: run
description: Use when launching or running the foxy_client dev server — covers correct startup command and port configuration
---

# Running foxy_client

## Dev server

```bash
npm run dev
```

This reads `vite.config.ts` automatically, which sets port **5174** and `host: true`:

```ts
server: {
    host: true,
    port: 5174
}
```

App is available at: http://localhost:5174/

## Important: never pass `--port` explicitly

```bash
# ❌ WRONG — CLI flag overrides vite.config.ts
npm run dev -- --port 5173

# ✅ CORRECT — config file is used as-is
npm run dev
```

CLI `--port` takes precedence over `vite.config.ts`. Always use plain `npm run dev` so the configured port is respected.

## Sentry warnings on startup

The following warnings are harmless — `VITE_APP_SENTRY_DSN` is intentionally empty in development:

```
[sentry-vite-plugin] Warning: No auth token provided.
```
