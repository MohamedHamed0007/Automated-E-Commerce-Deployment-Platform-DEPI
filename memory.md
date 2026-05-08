# ShipSphere Memory

This file is a handoff memory for any AI model that needs to work on this repository.
Read this before making changes. Treat it as the current source of truth for project structure, active flows, and known caveats.

Generated from the codebase on 2026-03-31.

## 1. Project Summary

ShipSphere is a full-stack logistics/shipping aggregator:

- Users can register/login.
- A logged-in user can create a shipment.
- The backend compares live courier rates through Shippo.
- The user selects a rate and pays through Stripe.
- After Stripe payment succeeds, the backend buys the shipping label from Shippo and stores tracking info.
- The user can then view shipment history and track the shipment.

There is also backend support for admin/user chat and Socket.IO, but the current frontend chat widget is still a mock UI and is not wired to the real chat backend.

## 2. Repo Layout

There is no root app runner. The repo is split into two separate apps:

- `backend/` = Express + TypeScript + MongoDB + Shippo + Stripe + Socket.IO
- `frontend/` = React + Vite + TypeScript + Redux Toolkit + React Router + Tailwind + Stripe Elements

## 3. How To Run

### Backend

- Working directory: `backend/`
- Command: `npm run dev`
- Entry point: `src/server.ts`
- Default port from code: `5000` unless overridden by env
- Env loader expects:
  - `backend/env/.env.dev` for development
  - `backend/env/.env.prod` for production

Important backend env keys referenced in code:

- `PORT`
- `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_ACCESS_EXPIRE`
- `JWT_REFRESH_EXPIRE`
- `JWT_RESET_PASSWORD_EXPIRE`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`
- `API_PREFIX`
- `SHIPPO_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- email-related vars (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`)

### Frontend

- Working directory: `frontend/`
- Command: `npm run dev`
- Entry point: `src/main.tsx`

Important frontend env keys referenced in code:

- `VITE_STRIPE_PUBLISHABLE_KEY`

### Important Local Mismatch

The frontend Axios base URL is hardcoded to:

- `http://localhost:3000/api/v1`

But the backend default port is:

- `5000`

Before local development, align these or requests will fail.

## 4. Backend Architecture

### Backend Boot Flow

- `backend/src/server.ts`
  - creates Express app
  - calls `bootstrap(app)`
  - creates HTTP server
  - attaches Socket.IO via `createSocketServer`
- `backend/src/app.ts`
  - configures CORS
  - sets raw body parser for Stripe webhook
  - sets JSON parsing and cookies
  - connects MongoDB
  - mounts routes through `routerHandler`
  - installs global error handler
- `backend/src/utils/RouterHandler/routerHandler.ts`
  - mounts all API groups using `env.API_PREFIX`

### Mounted API Groups

Assume final API shape is:

- `${API_PREFIX}/auth`
- `${API_PREFIX}/chatApi`
- `${API_PREFIX}/user`
- `${API_PREFIX}/admin`
- `${API_PREFIX}/payments`
- `${API_PREFIX}/stripe`
- `${API_PREFIX}/shipment`

### Backend Route Map

#### Auth

Files:

- `backend/src/routes/Auth/auth.routes.ts`
- `backend/src/controllers/auth/auth.controller.ts`
- `backend/src/Services/auth/auth.service.ts`

Endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`
- `POST /auth/logout`

Notes:

- login returns `accessToken` in JSON response
- refresh token is stored in an HTTP-only cookie

#### User Profile

Files:

- `backend/src/routes/User/user.routes.ts`
- `backend/src/controllers/user/user.controller.ts`
- `backend/src/Services/user/user.service.ts`

Endpoints:

- `GET /user/profile`
- `PUT /user/profile`
- `POST /user/change-password`

#### Shipment

Files:

- `backend/src/routes/Shipment/shipment.routes.ts`
- `backend/src/controllers/shipment/shipment.controller.ts`
- `backend/src/Services/shipment/shipment.service.ts`
- `backend/src/Services/tracking/tracking.services.ts`
- `backend/src/Services/commission/commission.service.ts`

Endpoints:

- `POST /shipment`
- `GET /shipment`
- `GET /shipment/:id`
- `POST /shipment/:id/compare`
- `POST /shipment/:id/select-rate`
- `GET /shipment/:id/track`

#### Payment / Stripe

Files:

- `backend/src/routes/Payment/payment.routes.ts`
- `backend/src/routes/Payment/stripe.routes.ts`
- `backend/src/controllers/payment/payment.controller.ts`
- `backend/src/controllers/payment/stripe.webhook.controller.ts`
- `backend/src/Services/payment/payment.service.ts`
- `backend/src/config/Payment/stripe.ts`

Endpoints:

- `POST /payments`
- `POST /payments/confirm`
- `POST /stripe/webhook`

#### Chat

Files:

- `backend/src/routes/Chat/chat.routes.ts`
- `backend/src/controllers/chat/chat.controller.ts`
- `backend/src/Services/chat/chat.service.ts`
- `backend/src/sockets/Auth/auth.socket.ts`
- `backend/src/sockets/Chat/chat.socket.ts`

Endpoints:

- `POST /chatApi`
- `GET /chatApi`
- `GET /chatApi/all`
- `GET /chatApi/:chatId`
- `GET /chatApi/:chatId/messages`
- `POST /chatApi/messages`
- `PATCH /chatApi/:chatId/read`
- `PATCH /chatApi/:chatId/close`

#### Admin

Files:

- `backend/src/routes/Admin/admin.routes.ts`
- `backend/src/controllers/admin/admin.controller.ts`
- `backend/src/Services/admin/admin.services.ts`

Endpoints:

- `GET /admin/chats`
- `GET /admin/chats/:chatId`
- `GET /admin/users`
- `DELETE /admin/users/:id`

## 5. Backend Data Model Summary

### User

File:

- `backend/src/config/DB/Models/User/user.models.ts`

Important fields:

- `fullName`
- `email`
- `passwordHash`
- `role`
- `isBlocked`
- `isVerified`
- `phone`
- `address`
- `refreshTokens`
- `resetPasswordToken`
- `resetPasswordExpires`
- `stripeCustomerId`
- `lastLogin`

### Shipment

File:

- `backend/src/config/DB/Models/Shipment/Shipment.models.ts`

Important fields:

- `userId`
- `package`
- `senderAddress`
- `receiverAddress`
- `comparisonResults`
- `shippoShipmentId`
- `selectedRate`
- `status`
- `paidOn`
- `trackingNumber`
- `trackingUrl`
- `labelUrl`

Shipment statuses:

- `draft`
- `compared`
- `booked`
- `cancelled`

### Payment

File:

- `backend/src/config/DB/Models/Payment/Payment.model.ts`

Important fields:

- `shipmentId`
- `userId`
- `amount`
- `currency`
- `status`
- `stripePaymentIntentId`
- `idempotencyKey`
- `paidAt`

### Chat

File:

- `backend/src/config/DB/Models/Chat/Chat.model.ts`

Important fields:

- `participants`
- `shipmentRef`
- `isOpen`

### Message

File:

- `backend/src/config/DB/Models/Message/Message.model.ts`

Important fields:

- `chat`
- `sender`
- `senderType`
- `content`
- `read`

### Tracking

File:

- `backend/src/config/DB/Models/Tracking/tracking.models.ts`

Important note:

- a Tracking model exists, but the current runtime tracking flow mainly uses live Shippo tracking data through `tracking.services.ts`

## 6. Main Backend Business Logic

### Shipment Flow

Core file:

- `backend/src/Services/shipment/shipment.service.ts`

How it works:

1. `createShipment` stores a draft shipment.
2. `compareRates` calls Shippo shipments API and stores rate options in `comparisonResults`.
3. `selectRate` stores the chosen rate in `selectedRate`.
4. Payment is created through Stripe.
5. Stripe webhook handles `payment_intent.succeeded`.
6. Webhook buys the label from Shippo.
7. Shipment is updated with:
   - `trackingNumber`
   - `trackingUrl`
   - `labelUrl`
   - `status = booked`
   - `paidOn`

### Payment Flow

Relevant files:

- `backend/src/controllers/payment/payment.controller.ts`
- `backend/src/controllers/payment/stripe.webhook.controller.ts`
- `backend/src/Services/payment/payment.service.ts`

How it works:

1. Frontend calls `POST /payments` with `shipmentId`.
2. Backend validates shipment ownership and selected rate.
3. Backend creates a Payment record and Stripe PaymentIntent.
4. Frontend confirms payment with Stripe Elements.
5. Webhook receives success/failure.
6. On success, backend books shipment label with Shippo.

### Tracking Flow

Core file:

- `backend/src/Services/tracking/tracking.services.ts`

Behavior:

- supports both Mongo shipment IDs and tracking numbers
- special dev shortcut: if input starts with `SHIPPO_`, tracking is requested directly from Shippo simulation flow

## 7. Frontend Architecture

### Frontend Boot Flow

- `frontend/src/main.tsx`
  - creates React root
  - injects Redux store into Axios layer
  - wraps app with `Provider`
- `frontend/src/App.tsx`
  - applies theme class to `<html>`
  - initializes session by dispatching `getProfile()`
  - renders `RouterProvider`
- `frontend/src/routes.tsx`
  - main route tree used by the actual app

### Frontend Layouts

- `frontend/src/Layouts/MainLayout.tsx`
  - public-facing layout
  - includes top navbar and footer
- `frontend/src/Layouts/Auth.tsx`
  - protected dashboard layout
  - includes sidebar and current mock chat widget

### Main Frontend Route Tree

Public routes:

- `/`
- `/about`
- `/contact`
- `/login`
- `/signup`
- `/forgot`

Protected routes under `/user`:

- `/user`
- `/user/billing`
- `/user/newshipment`
- `/user/compare/:shipmentId`
- `/user/payment/:shipmentId`
- `/user/paymentSuccess/:shipmentId`
- `/user/tracking/:trackingNumber`
- `/user/profile`
- `/user/settings`
- `/user/subscription`
- `/user/help`
- `/user/history`

404 route:

- handled by `frontend/src/app/pages/NotFound.tsx`

### Active Frontend Runtime Files

Use these first when modifying the running app:

- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/routes.tsx`
- `frontend/src/Layouts/*`
- `frontend/src/pages/*`
- `frontend/src/redux/*`
- `frontend/src/api/axiosInstance.ts`
- `frontend/src/components/*`

## 8. Frontend State Management

Store file:

- `frontend/src/redux/store.tsx`

Active slices:

- `auth`
- `shipment`
- `tracking`
- `payment`
- `theme`
- `navigation`

### Auth State

Files:

- `frontend/src/redux/slices/authSlice.ts`
- `frontend/src/redux/thunk/loginThunk.ts`
- `frontend/src/redux/thunk/profileThunk.ts`

Behavior:

- login stores `user` and `accessToken` in Redux
- app boot calls `getProfile()`
- Axios interceptor refreshes token on `401` by calling `/auth/refresh-token`

### Shipment State

Files:

- `frontend/src/redux/slices/shipmentSlice.ts`
- `frontend/src/redux/thunk/shipmentThunk.ts`

Used by:

- dashboard
- history
- new shipment
- compare
- payment
- tracking
- payment success

### Payment State

Files:

- `frontend/src/redux/slices/paymentSlice.ts`
- `frontend/src/redux/thunk/paymentThunk.ts`

Stores:

- `clientSecret`
- `paymentId`
- `paymentIntentId`

### Tracking State

Files:

- `frontend/src/redux/slices/trackingSlice.ts`
- `frontend/src/redux/thunk/trackingThunk.ts`

### Theme State

Files:

- `frontend/src/redux/themeRedux/themeSlice.tsx`

Behavior:

- theme is applied as `light` or `dark` on document root
- current theme is saved in `localStorage`

## 9. Core User Flow In The Frontend

### Auth

Files:

- `frontend/src/pages/Login/Login.tsx`
- `frontend/src/pages/Signup/Signup.tsx`
- `frontend/src/pages/Login/ForgotPassword.tsx`

Behavior:

- Login page uses thunk `loginUser`
- Signup page uses thunk `registerUser`
- Forgot Password page is currently only UI/mock and does not call backend

### Shipment Creation

File:

- `frontend/src/pages/NewShipment/NewShipment.tsx`

Behavior:

- multi-step form
- on final submit dispatches `createShipment`
- after success navigates to `/user/compare/:shipmentId`

### Rate Comparison

File:

- `frontend/src/pages/Compare/Compare.tsx`

Behavior:

- dispatches `compareRates(shipmentId)` on mount
- shows results from `shipmentSlice.rates`
- selecting a rate dispatches `selectRate`
- then navigates to `/user/payment/:shipmentId`

### Payment

Files:

- `frontend/src/pages/Payment/Payment.tsx`
- `frontend/src/components/StripePaymentForm/StripePaymentForm.tsx`

Behavior:

- fetches shipment by ID
- creates payment intent through backend
- renders Stripe `PaymentElement`
- on client-side success navigates to `/user/paymentSuccess/:shipmentId`

### Payment Success

File:

- `frontend/src/app/pages/PaymentSuccess.tsx`

Behavior:

- fetches shipment again
- shows tracking number, selected rate, label download if available

### Tracking

File:

- `frontend/src/pages/TrackingPage/TrackingPage.tsx`

Behavior:

- fetches tracking info through `getTracking`
- also tries to fetch shipment details via `getShipmentById`
- displays timeline/history cards

### Dashboard and History

Files:

- `frontend/src/pages/Dashboard/Dashboard.tsx`
- `frontend/src/pages/History/History.tsx`

Behavior:

- both depend on `getUserShipments()`
- dashboard shows recent shipments and quick actions
- history allows filtering and CSV export on client side

### Profile

File:

- `frontend/src/pages/Profile/Profile.tsx`

Behavior:

- edits profile fields
- dispatches `updateProfile`

### Static or Mostly Local-State Pages

These pages currently look real but are not deeply integrated with backend data:

- `frontend/src/pages/Settings/Settings.tsx`
  - stores settings in `localStorage`
  - password section is UI-only
- `frontend/src/pages/Billing/Billing.tsx`
  - static/mock invoice data
- `frontend/src/pages/SubscriptionPlans/Subscription.tsx`
  - static pricing UI
- `frontend/src/pages/Help/Help.tsx`
  - static FAQ + mock support form/chat

## 10. Where To Edit For Common Requests

Use this section as the fastest navigation guide.

### If the request is about landing page / marketing pages

Edit:

- `frontend/src/pages/Home/Home.tsx`
- `frontend/src/components/sections/*`
- `frontend/src/Layouts/Navbar.tsx`
- `frontend/src/Layouts/Footer.tsx`

### If the request is about login / signup / auth UI

Edit:

- `frontend/src/pages/Login/Login.tsx`
- `frontend/src/pages/Signup/Signup.tsx`
- `frontend/src/pages/Login/ForgotPassword.tsx`
- `frontend/src/redux/slices/authSlice.ts`
- `frontend/src/redux/thunk/loginThunk.ts`
- `frontend/src/redux/thunk/profileThunk.ts`

Backend side:

- `backend/src/routes/Auth/auth.routes.ts`
- `backend/src/controllers/auth/auth.controller.ts`
- `backend/src/Services/auth/auth.service.ts`
- `backend/src/middleware/Auth/auth.middleware.ts`

### If the request is about shipment form fields or validation

Frontend:

- `frontend/src/pages/NewShipment/NewShipment.tsx`
- `frontend/src/redux/thunk/shipmentThunk.ts`
- `frontend/src/redux/slices/shipmentSlice.ts`
- `frontend/src/types/index.ts`

Backend:

- `backend/src/Validation/Shipment/shipment.validation.ts`
- `backend/src/controllers/shipment/shipment.controller.ts`
- `backend/src/Services/shipment/shipment.service.ts`
- `backend/src/config/DB/Models/Shipment/Shipment.models.ts`

### If the request is about courier comparison, pricing, or commission

Frontend:

- `frontend/src/pages/Compare/Compare.tsx`

Backend:

- `backend/src/Services/shipment/shipment.service.ts`
- `backend/src/Services/commission/commission.service.ts`

Optional older helper:

- `backend/src/Services/carrier/carrier.service.ts`

### If the request is about payment / Stripe / payment confirmation

Frontend:

- `frontend/src/pages/Payment/Payment.tsx`
- `frontend/src/components/StripePaymentForm/StripePaymentForm.tsx`
- `frontend/src/redux/thunk/paymentThunk.ts`
- `frontend/src/redux/slices/paymentSlice.ts`

Backend:

- `backend/src/controllers/payment/payment.controller.ts`
- `backend/src/controllers/payment/stripe.webhook.controller.ts`
- `backend/src/Services/payment/payment.service.ts`
- `backend/src/config/Payment/stripe.ts`

### If the request is about tracking or shipment status

Frontend:

- `frontend/src/pages/TrackingPage/TrackingPage.tsx`
- `frontend/src/redux/thunk/trackingThunk.ts`
- `frontend/src/redux/slices/trackingSlice.ts`

Backend:

- `backend/src/Services/tracking/tracking.services.ts`
- `backend/src/controllers/shipment/shipment.controller.ts`
- `backend/src/config/DB/Models/Shipment/Shipment.models.ts`

### If the request is about profile/account data

Frontend:

- `frontend/src/pages/Profile/Profile.tsx`
- `frontend/src/redux/thunk/profileThunk.ts`

Backend:

- `backend/src/routes/User/user.routes.ts`
- `backend/src/controllers/user/user.controller.ts`
- `backend/src/Services/user/user.service.ts`

### If the request is about dashboard or shipment history

Frontend:

- `frontend/src/pages/Dashboard/Dashboard.tsx`
- `frontend/src/pages/History/History.tsx`
- `frontend/src/redux/thunk/shipmentThunk.ts`

Backend:

- `backend/src/Services/shipment/shipment.service.ts`
- `backend/src/controllers/shipment/shipment.controller.ts`

### If the request is about admin chats or admin user management

Backend:

- `backend/src/routes/Admin/admin.routes.ts`
- `backend/src/controllers/admin/admin.controller.ts`
- `backend/src/Services/admin/admin.services.ts`
- `backend/src/routes/Chat/chat.routes.ts`
- `backend/src/Services/chat/chat.service.ts`

Important note:

- there is no complete admin frontend panel in the current codebase

### If the request is about real chat UI

Current frontend mock:

- `frontend/src/components/ChatWidget/ChatWidget.tsx`

Real backend chat system:

- `backend/src/routes/Chat/chat.routes.ts`
- `backend/src/Services/chat/chat.service.ts`
- `backend/src/sockets/Auth/auth.socket.ts`
- `backend/src/sockets/Chat/chat.socket.ts`
- `backend/src/config/Socket/Socket.server.ts`

If you want real chat, do not keep extending the current mock widget. Build against the backend chat routes/socket stack.

## 11. Active vs Legacy / Placeholder Areas

### Alternative UI Tree In `frontend/src/app`

This folder exists, but the running app does not primarily use it.

What is actively used from it:

- `frontend/src/app/pages/PaymentSuccess.tsx`
- `frontend/src/app/pages/NotFound.tsx`

What is mostly alternative/unwired:

- `frontend/src/app/routes.ts`
- `frontend/src/app/components/*`

### Duplicate UI Primitives

There are multiple component locations:

- `frontend/src/components/*`
- `frontend/src/components/ui/*`
- `frontend/src/app/components/*`
- `frontend/src/app/components/ui/*`

For the live shipment/dashboard flow, start with:

- `frontend/src/components/*`

### Placeholder / Empty / Unused Backend Areas

These exist but are not active sources of core runtime behavior:

- `backend/src/Services/webhook/webhook.service.ts` (empty)
- `backend/src/Services/cancel/cancel.service.ts` (empty)
- `backend/src/routes/webhooks/webhook.routes.ts` (empty)
- `backend/src/Tests/*` (currently empty)

### Other Stray Repo Artifacts

These look like accidental or leftover files, not runtime code:

- `backend/git`
- `frontend/et --hard 31b9a03`

Also:

- `frontend/README.md` contains unresolved merge conflict markers, so do not trust it as documentation

## 12. Known Bugs / Inconsistencies / Gotchas

These are important. Any future AI should be careful around them.

1. Frontend base URL and backend port do not match.
   - frontend uses `http://localhost:3000/api/v1`
   - backend defaults to `5000`

2. Stripe return URL mismatch.
   - `StripePaymentForm` uses `/user/paymentSuccess`
   - actual router expects `/user/paymentSuccess/:shipmentId`
   - non-redirect flow still navigates correctly from `Payment.tsx`

3. Tracking route parameter is inconsistent.
   - route path name is `trackingNumber`
   - some navigations pass shipment Mongo `_id`
   - backend tracking service supports both ID and tracking number
   - but `TrackingPage` also calls `getShipmentById(trackingNumber)`, which only works if the param is actually a Mongo ID

4. Sidebar expects `localStorage` keys that are never set in the current app.
   - `lastTrackingNumber`
   - `lastShipmentId`

5. Logout in the sidebar is incomplete.
   - it only removes `localStorage.token`
   - it does not call backend logout
   - it does not clear Redux auth state

6. Auth utilities are duplicated.
   - `backend/src/utils/Token/token.utils.ts`
   - `backend/src/utils/JWT/jwt.util.ts`
   - be careful because auth service and auth middleware do not rely on the same helper file

7. JWT payload shape is inconsistent for sockets.
   - auth service tokens include `userId`
   - socket auth expects `id`
   - real-time chat auth may break until unified

8. Payment status values are inconsistent.
   - payment model enum is `pending | succeeded | failed`
   - `markPaymentSucceeded` writes `"paid"`

9. Role naming is inconsistent in a few places.
   - user model supports `user`, `admin`, `customer`, `driver`
   - frontend auth types mostly assume `user`
   - chat/message flows often refer to `customer`

10. Forgot-password frontend is only a mock page.
   - it does not call backend `/auth/forgot-password`
   - backend sends reset links to `${FRONTEND_URL}/auth/reset-password/:token`
   - there is no matching frontend reset-password route/page right now

11. ChatWidget in the frontend is not the real chat system.
   - it stores messages only in local component state
   - no REST calls
   - no Socket.IO client

12. Several pages are “real-looking” but currently static/local only.
   - settings
   - billing
   - subscription
   - help

13. Some files contain encoding issues in comments or UI copy.
   - functionality matters more than comment text in those files

14. The frontend has a legacy navigation slice/hook that is not the real router.
   - `frontend/src/redux/navigateRedux/navigateSlice.tsx`
   - `frontend/src/redux/hookredux.tsx` has a broken helper referencing `lastClicked`

## 13. Files Most Likely To Matter First

When a request is unclear, inspect these first:

### Backend

- `backend/src/server.ts`
- `backend/src/app.ts`
- `backend/src/utils/RouterHandler/routerHandler.ts`
- `backend/src/Services/shipment/shipment.service.ts`
- `backend/src/Services/payment/payment.service.ts`
- `backend/src/controllers/payment/stripe.webhook.controller.ts`
- `backend/src/Services/tracking/tracking.services.ts`
- `backend/src/Services/auth/auth.service.ts`
- `backend/src/middleware/Auth/auth.middleware.ts`
- `backend/src/config/DB/Models/Shipment/Shipment.models.ts`
- `backend/src/config/DB/Models/User/user.models.ts`

### Frontend

- `frontend/src/routes.tsx`
- `frontend/src/App.tsx`
- `frontend/src/api/axiosInstance.ts`
- `frontend/src/redux/store.tsx`
- `frontend/src/redux/slices/authSlice.ts`
- `frontend/src/redux/slices/shipmentSlice.ts`
- `frontend/src/redux/slices/paymentSlice.ts`
- `frontend/src/redux/slices/trackingSlice.ts`
- `frontend/src/pages/NewShipment/NewShipment.tsx`
- `frontend/src/pages/Compare/Compare.tsx`
- `frontend/src/pages/Payment/Payment.tsx`
- `frontend/src/pages/TrackingPage/TrackingPage.tsx`
- `frontend/src/pages/Dashboard/Dashboard.tsx`
- `frontend/src/pages/History/History.tsx`

## 14. Practical Guidance For Future AI Models

1. First decide whether the request is:
   - frontend-only
   - backend-only
   - full-stack

2. For almost any feature touching user flows, check both:
   - the page/component
   - the thunk/slice
   - the backend route/controller/service/model

3. If modifying shipment/payment/tracking, review these together:
   - `frontend/src/pages/NewShipment/NewShipment.tsx`
   - `frontend/src/pages/Compare/Compare.tsx`
   - `frontend/src/pages/Payment/Payment.tsx`
   - `frontend/src/pages/TrackingPage/TrackingPage.tsx`
   - `backend/src/Services/shipment/shipment.service.ts`
   - `backend/src/controllers/payment/stripe.webhook.controller.ts`
   - `backend/src/Services/tracking/tracking.services.ts`

4. Do not assume `frontend/src/app/*` is the main app. It is mostly an alternate tree.

5. Do not trust `frontend/README.md` for architecture decisions.

6. If implementing real support chat, build on the backend chat/socket stack, not on the current mock widget.

7. If fixing auth, normalize the token utilities and payload shape before expanding features.

8. If fixing tracking UX, unify whether the app routes with shipment `_id` or real `trackingNumber`.

9. If fixing payment flow, verify both the client redirect path and the Stripe webhook path.

10. If asked to add tests, note that the test folders exist but are currently empty and there is no backend `test` script in `package.json`.

## 15. Short Handoff Prompt For Another AI

If you want to give this project to another model, send this file and say:

> Read `memory.md` first. This repo is ShipSphere, a logistics aggregator with a React/Vite frontend in `frontend/` and an Express/TypeScript backend in `backend/`. Use the file map in `memory.md` to find the exact area to modify, and be careful with the known inconsistencies section before changing auth, payment, tracking, chat, or route parameters.
