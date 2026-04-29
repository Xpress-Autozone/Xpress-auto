# Xpress Autozone — Authentication & Account Management Guide

> **Last Updated**: April 29, 2026  
> **Scope**: Customer-facing auth lifecycle across `Xpress-auto` (frontend) and `xpress-backend` (backend)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Onboarding Flow](#onboarding-flow)
4. [Session Management](#session-management)
5. [Profile Management](#profile-management)
6. [Account Deletion](#account-deletion)
7. [Backend API Reference](#backend-api-reference)
8. [Security Model](#security-model)
9. [Redux State Shape](#redux-state-shape)
10. [File Map](#file-map)
11. [Known Decisions & Trade-offs](#known-decisions--trade-offs)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Xpress-auto (Frontend)                    │
│                                                             │
│  Firebase Client SDK ──► Google Sign-In / Anonymous Auth    │
│  Redux (userSlice)   ──► State: user, orders, auth status  │
│  ProtectedRoute      ──► Guards /account, /onboarding      │
│  mainLayout          ──► onAuthStateChanged listener        │
└──────────────────────────┬──────────────────────────────────┘
                           │ Bearer Token (Firebase ID Token)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 xpress-backend (Express API)                 │
│                                                             │
│  Firebase Admin SDK  ──► Token verification, user mgmt     │
│  authGuard middleware──► Verifies Bearer tokens             │
│  requireRole         ──► RBAC: admin, vendor, customer      │
│  Firestore           ──► User profiles, orders, logs        │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

- **Firebase Auth** is the single source of truth for authentication.
- **Custom Claims** store `role` and `isOnboarded` status directly on the Firebase token.
- **Firestore** stores extended profile data (phone, address, vehicle) that doesn't belong in auth claims.
- **Redux** mirrors Firebase auth state locally for UI reactivity, with `localStorage` persistence for faster cold starts.

---

## Authentication Flow

### Google Sign-In (Primary)

```
User clicks "Continue with Google"
       │
       ▼
   ┌─ Desktop? ──► signInWithPopup(auth, googleProvider)
   │
   └─ Mobile?  ──► signInWithRedirect(auth, googleProvider)
       │                    │
       │                    ▼
       │           getRedirectResult(auth) on next mount
       │
       ▼
   Firebase returns user object
       │
       ▼
   getIdTokenResult(true) → read isOnboarded from custom claims
       │
       ├─ isOnboarded === true  → navigate("/account")
       └─ isOnboarded === false → navigate("/onboarding")
       │
       ▼
   dispatch(signIn(userData))    ← Redux state
   dispatch(fetchUserProfile())  ← Hydrate from Firestore
```

**Files involved**:
- `src/Pages/Auth/Auth.jsx` — Login/signup UI and auth handlers
- `src/Firebase/firebase.js` — Shared Firebase app + auth instance
- `src/Redux/userSlice.js` — Redux actions and state

### Guest / Anonymous Sign-In

```
User clicks "Continue as Guest"
       │
       ▼
   signInAnonymously(auth)
       │
       ▼
   Creates anonymous Firebase user (no email)
       │
       ▼
   dispatch(signIn({ uid, name: "Guest User", email: null, isAnonymous: true }))
       │
       ▼
   navigate("/onboarding")
```

> **Note**: Guest users have `email: null` in both Redux and Firestore. The backend handles this gracefully. Anonymous Firebase Auth records persist until explicitly deleted.

### Auth State Listener (Global)

The `mainLayout.jsx` component sets up a global `onAuthStateChanged` listener that:

1. **On sign-in**: Dispatches `signIn()`, fetches profile + orders, signals `authLoaded()`
2. **On sign-out**: Dispatches `signOut()` to clear Redux state (handles external sign-outs like admin token revocation)
3. **Polls for order updates** every 2 minutes via `setInterval`

```javascript
// mainLayout.jsx — simplified
onAuthStateChanged(auth, async (user) => {
  if (user) {
    dispatch(signIn({...}));
    dispatch(fetchUserProfile(user.uid));
    dispatch(fetchUserOrders());
  } else {
    dispatch(signOut()); // Handles external sign-outs
  }
  dispatch(authLoaded());
});
```

---

## Onboarding Flow

New users must complete a 4-phase onboarding before accessing protected pages.

```
Phase 1: Identity Verification    → Phone number (with country code)
Phase 2: Delivery Logistics       → Shipping address (manual or geolocation)
Phase 3: Vehicle Profiling        → Make, model, year, fuel type (skippable)
Phase 4: Review & Confirm         → Summary of all data, submit
```

### Submit Flow

```
User clicks "Proceed to dashboard"
       │
       ▼
   POST /users/:uid/onboarding
   Body: { isOnboarded: true, phone, address, vehicle }
       │
       ▼
   Backend:
     1. Sets custom claim: isOnboarded = true
     2. Preserves existing role claim
     3. Creates/updates Firestore user doc
       │
       ▼
   Frontend:
     1. Force-refreshes Firebase token (getIdTokenResult(true))
     2. dispatch(updateUser(...))
     3. dispatch(completeOnboarding())
     4. Navigates to /cart (if items) or / (if empty)
```

**Files involved**:
- `src/Pages/Auth/Onboarding.jsx` — Frontend 4-phase form
- `controllers/userController.js` → `updateOnboardingStatus()` — Backend handler

---

## Session Management

### Protected Routes

`ProtectedRoute.jsx` wraps `/account` and `/onboarding`:

```
┌─ isAuthInitialized === false?  → Show loading spinner
├─ isAuthenticated === false?    → Redirect to /login
├─ isOnboarded === false?        → Redirect to /onboarding
├─ isOnboarded && on /onboarding → Redirect to /account
└─ All checks pass               → Render children
```

### Sign-Out

Sign-out is triggered from two places:

1. **MyAccount.jsx** — "Sign Out" button (with confirmation modal)
2. **Onboarding.jsx** — "Exit session" button

Both must call:
```javascript
dispatch(signOut());   // Clear Redux + localStorage
auth.signOut();        // Clear Firebase session
navigate("/");
```

### Redux `signOut` Reducer — Full Cleanup

```javascript
signOut: (state) => {
  state.isAuthenticated = false;
  state.isOnboarded = false;
  state.user = null;
  state.orders = [];
  state.notificationDot = null;
  state.isAuthInitialized = false;
  localStorage.removeItem('user_state');
  localStorage.removeItem('last_seen_statuses');
}
```

---

## Profile Management

### Viewing Profile

```
GET /users/:uid
Authorization: Bearer <token>
```

- Merges Firebase Auth data (email, displayName, photoURL) with Firestore data (phone, address, vehicle, tags)
- **Access control**: Users can only view their own profile. Staff roles (admin, manager, moderator, accountant) can view any profile.

### Updating Profile

```
PUT /users/:uid/profile
Authorization: Bearer <token>
Body: { phone?, address?, vehicle? }
```

- Updates Firestore document only (not Firebase Auth record)
- **Access control**: Same ownership check as viewing

**Frontend handler**: `MyAccount.jsx` → `handleSave()` → dispatches `updateUserProfile()` async thunk

---

## Account Deletion

### Self-Service Flow

```
User clicks "Delete Account"
       │
       ▼
   Confirmation modal: "This will permanently delete..."
       │
       ▼
   DELETE /users/:uid/account
   Authorization: Bearer <token>
   Body: { force: false }
       │
       ├─ Has pending orders?
       │    └─ 409 response with pendingOrders list
       │         │
       │         ▼
       │    Warning modal: "You have X active orders..."
       │         │
       │         ├─ "I understand, delete everything"
       │         │    └─ DELETE /users/:uid/account { force: true }
       │         │
       │         └─ "Wait, take me back"
       │
       └─ No pending orders (or force=true)
            │
            ▼
        1. Delete all user orders (chunked batches of 499)
        2. Delete Firestore user profile doc
        3. Delete Firebase Auth record
            │
            ▼
        200: "Account and all associated data deleted successfully"
```

### Batch Deletion Safety

Firestore limits batch writes to 500 operations. The backend chunks deletions:

```javascript
const BATCH_LIMIT = 499;
if (orderDocs.length <= BATCH_LIMIT) {
  // Single batch: orders + user profile
} else {
  // Multiple batches of 499 for orders
  // Final batch: user profile
}
```

### Admin Deletion

Admins can delete any user via:
```
DELETE /users/:uid
Authorization: Bearer <admin_token>
```
This only deletes the Firebase Auth record (no Firestore cleanup). Use the self-service endpoint for full cleanup.

---

## Backend API Reference

### Auth Routes (`/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ None | Register new user (always `customer` role) |
| POST | `/verify-token` | ❌ None | Verify a Firebase ID token |
| POST | `/custom-token` | ✅ Admin | Generate custom auth token for a UID |
| POST | `/send-verification` | ❌ None | Generate email verification link |
| POST | `/reset-password` | ❌ None | Generate password reset link |
| PUT | `/update-password` | ✅ Bearer | Update user password (self or admin) |
| PUT | `/update-email` | ✅ Bearer | Update user email (self or admin) |
| POST | `/revoke-tokens` | ✅ Bearer | Revoke all refresh tokens (self or admin) |
| GET | `/me` | ✅ Bearer | Get current authenticated user info |

### User Routes (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | ✅ Admin/Manager/Mod | List all users (paginated) |
| GET | `/users/:uid` | ✅ Bearer (self or staff) | Get user by UID |
| POST | `/users/role` | ✅ Admin only | Set user role |
| PUT | `/users/:uid` | ✅ Admin only | Update user auth fields |
| PATCH | `/users/:uid/status` | ✅ Admin only | Enable/disable account |
| PATCH | `/users/:uid/tags` | ✅ Admin/Manager/Mod | Update user tags |
| DELETE | `/users/:uid` | ✅ Admin only | Delete user (auth only) |
| POST | `/users/:uid/onboarding` | ✅ Bearer (self or staff) | Complete onboarding |
| PUT | `/users/:uid/profile` | ✅ Bearer (self or staff) | Update profile |
| DELETE | `/users/:uid/account` | ✅ Bearer (self only) | Delete own account + data |

---

## Security Model

### Authentication Middleware

```javascript
// authCheck.js
export async function authGuard(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = await admin.auth().verifyIdToken(token);
  req.user = decoded;
  req.userRole = decoded.role || null;
  next();
}
```

### Role-Based Access Control

```javascript
export function requireRole(allowedRoles = ["admin"]) {
  return (req, res, next) => {
    if (req.userRole === "admin") return next(); // Admin always passes
    if (allowedRoles.includes(req.userRole)) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
}
```

### Ownership Validation

Endpoints that operate on user data validate `req.user.uid === uid` before proceeding. Staff roles bypass this check:

```javascript
const isStaff = ['admin', 'manager', 'moderator', 'accountant'].includes(req.userRole);
if (req.user.uid !== uid && !isStaff) {
  return res.status(403).json({ message: "Forbidden" });
}
```

### Security Decisions

| Decision | Rationale |
|----------|-----------|
| `/register` forces `role = 'customer'` | Prevents privilege escalation on public endpoint |
| `/custom-token` requires admin auth | Prevents user impersonation |
| Self-role-change blocked | Prevents admin self-lockout |
| `error.message` hidden in production | Prevents information leakage |
| Firestore `ignoreUndefinedProperties: true` | Prevents crashes from optional fields |

---

## Redux State Shape

```javascript
{
  user: {
    isAuthenticated: boolean,
    isOnboarded: boolean,
    isAuthInitialized: boolean,    // true after first onAuthStateChanged fires
    user: {
      uid: string,
      email: string | null,
      name: string,
      photoURL: string | null,
      phone: string | null,
      address: string | null,
      vehicle: { make, model, year, fuelType } | null,
      isAnonymous: boolean         // true for guest users
    } | null,
    orders: Array<Order>,
    loading: boolean,
    error: string | null,
    notificationDot: 'red' | 'yellow' | 'green' | 'blue' | null
  }
}
```

### localStorage Keys

| Key | Purpose | Cleared On |
|-----|---------|------------|
| `user_state` | Persisted auth + user data for fast cold starts | Sign-out |
| `last_seen_statuses` | Tracks which order statuses the user has "seen" | Sign-out |

---

## File Map

### Frontend (`Xpress-auto/xpress-app/src/`)

```
Firebase/
  firebase.js              — Firebase app init, shared auth instance

Redux/
  userSlice.js             — All auth state, async thunks (fetchProfile, fetchOrders, updateProfile)

Pages/Auth/
  Auth.jsx                 — Login/signup page (Google + Guest)
  Onboarding.jsx           — 4-phase onboarding form

Pages/Account/
  MyAccount.jsx            — Profile view/edit, order history, sign-out, delete account

Components/Auth/
  ProtectedRoute.jsx       — Route guard (auth + onboarding checks)

MainLayout/
  mainLayout.jsx           — Global auth listener, order polling, route definitions
```

### Backend (`xpress-backend/Backend-firebase/`)

```
Firebase/
  admin.js                 — Firebase Admin SDK init (Firestore, Auth, Storage)

middleware/
  authCheck.js             — authGuard (token verification) + requireRole (RBAC)

controllers/
  authController.js        — register, verifyToken, createCustomToken, updatePassword, etc.
  userController.js        — getUserById, updateOnboardingStatus, updateProfile, deleteOwnAccount, etc.

routes/
  auth.route.js            — Auth endpoint definitions
  user.route.js            — User endpoint definitions
  router.js                — Route aggregation
```

---

## Known Decisions & Trade-offs

1. **Guest/Anonymous Auth**: Creates real Firebase Auth records that persist. These are not automatically cleaned up. Consider a scheduled Cloud Function to purge stale anonymous accounts.

2. **Token Refresh on Onboarding**: After onboarding completes, the frontend force-refreshes the token via `getIdTokenResult(true)` to pick up the new `isOnboarded` custom claim. There can be a brief delay (< 1s) where the old token is still in use.

3. **Order Polling**: Orders are polled every 2 minutes via `setInterval`. This is a trade-off vs real-time Firestore listeners (which would require the client SDK). The polling approach keeps the backend as the single data gateway.

4. **Email/Password Auth**: Supported alongside Google Sign-In and Anonymous Auth. Users can register with name + email + password, sign in, and reset their password. The Firebase Client SDK handles all email/password operations directly (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `sendPasswordResetEmail`). The backend `/register` endpoint is not used by the frontend — it exists for admin-initiated user creation only.

5. **Notification Dot System**: Order status changes are tracked via `last_seen_statuses` in localStorage. This is per-browser, not per-user on the server. If a user logs in from a new device, all orders appear "new".
