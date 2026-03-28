# Shipment & Tracking Bug Fix Plan

## Context
The shipment & tracking feature is fully implemented (commit `7e6380b`) but all
endpoints return `404` because the shipment router was never registered in the
main router handler. This document describes all bugs and their exact fixes.

---

## BUG 1 — BLOCKING: Shipment router not registered
**File:** `src/utils/RouterHandler/routerHandler.ts`

Add these two lines:
1. Import at the top with the other imports:
   ```typescript
   import shipmentRouter from '../../routes/Shipment/shipment.routes';
   ```
2. Registration inside `routerHandler()`, BEFORE the catch-all `app.use('*', ...)`:
   ```typescript
   app.use(`${env.API_PREFIX}/shipment`, shipmentRouter);
   ```

This single fix unblocks all 6 shipment endpoints.

---

## BUG 2 — Duplicate express.json() middleware
**File:** `src/utils/RouterHandler/routerHandler.ts`

`app.use(express.json())` is called inside `routerHandler()` (line 12).
Check `src/app.ts` — if it already calls `app.use(express.json())`, remove
the duplicate from `routerHandler.ts`.

---

## BUG 3 — CORS misconfiguration
**File:** `src/app.ts`

`credentials: true` combined with `origin: '*'` is invalid (rejected by browsers).
Replace `origin: '*'` with an explicit origin:
```typescript
origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
```

---

## BUG 4 — Health check route may be dead code
**File:** `src/utils/RouterHandler/routerHandler.ts`

Verify the `GET /` health check route (if any) is registered BEFORE the
catch-all `app.use('*', ...)`. If it comes after, it will never be reached.

---

## BUG 5 — Orphaned empty files (delete them)
- `src/controllers/tracking/tracking.controller.ts` (0 bytes — unused)
- `src/Services/tracking/tracking.controller.ts` (0 bytes — unused)

Tracking logic lives in `src/Services/tracking/tracking.services.ts` and is
called from `src/controllers/shipment/shipment.controller.ts` directly.

---

## Files to Modify

| File | Action |
|------|--------|
| `src/utils/RouterHandler/routerHandler.ts` | Add shipmentRouter import + `app.use()` registration; remove duplicate `express.json()` if present in `app.ts` |
| `src/app.ts` | Fix CORS origin; ensure health check is before catch-all |
| `src/controllers/tracking/tracking.controller.ts` | Delete (empty orphan) |
| `src/Services/tracking/tracking.controller.ts` | Delete (empty orphan) |

---

## Verification Steps

After applying all fixes, test in order:

1. `POST /api/v1/auth/login` → get JWT Bearer token
2. `POST /api/v1/shipment` (with Authorization header) → `201`, status: `draft`
3. `GET /api/v1/shipment` → `200`, array of shipments
4. `GET /api/v1/shipment/:id` → `200`, single shipment
5. `POST /api/v1/shipment/:id/compare` → `200`, rates with 10% commission applied
6. `POST /api/v1/shipment/:id/select-rate` `{ "rateId": "..." }` → `200`, status: `booked`
7. `GET /api/v1/shipment/:id/track` → `200`, tracking info from Shippo sandbox

---

## OpenCode Implementation Prompt

Use this prompt with opencode to implement all the fixes above:

```
Read final.md in the project root and implement all bug fixes described in it.

Work in this priority order:

1. BUG 1 (blocking) — Open `src/utils/RouterHandler/routerHandler.ts`.
   Add this import at the top with the other imports:
     import shipmentRouter from '../../routes/Shipment/shipment.routes';
   Then add this line inside the routerHandler() function, BEFORE the
   catch-all app.use('*', ...) line:
     app.use(`${env.API_PREFIX}/shipment`, shipmentRouter);

2. BUG 2 — In `src/utils/RouterHandler/routerHandler.ts`, check if
   app.use(express.json()) exists. Then open `src/app.ts` and check if
   app.use(express.json()) also exists there. If both have it, remove the
   one from routerHandler.ts.

3. BUG 3 — In `src/app.ts`, find the CORS configuration and replace
   origin: '*' with:
     origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000'
   Keep credentials: true.

4. BUG 4 — In `src/utils/RouterHandler/routerHandler.ts`, check if there
   is a health check GET / route. If it exists and is registered AFTER the
   catch-all app.use('*', ...), move it to BEFORE the catch-all.

5. BUG 5 — Delete these two empty files:
   - src/controllers/tracking/tracking.controller.ts
   - src/Services/tracking/tracking.controller.ts

Do not change any other files. After completing all fixes, confirm that
shipmentRouter appears in both the imports section and the app.use() calls
in routerHandler.ts.
```
