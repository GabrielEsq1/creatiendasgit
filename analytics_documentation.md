# GA4 Professional Measurement Strategy

This document outlines the professional GA4 implementation for Creatiendas, designed to provide investor-ready metrics by filtering out technical noise and focusing on real human engagement.

## Core Strategy: Human-First Analytics
Traditional GA4 implementations often inflate metrics due to background animations, automated loops, and multiple page transitions in SPAs. Our strategy implements **Noise Cancellation** logic.

### 1. Noise Cancellation & Purity
- **Activity Gating**: Events are only dispatched if the document is visible (`document.hidden === false`).
- **Interaction Checking**: The system monitors mouse, keyboard, and scroll activity. If no interaction has occurred in the last 30 seconds, engagement tracking pauses.
- **Animation Exclusion**: Background loops (requestAnimationFrame) are prohibited from triggering any GA4 events.

### 2. Standardized Context (Data Layer)
Every event includes the following enriched context:
- `session_id`: Persistent per-tab session identifier.
- `user_type`: `new` vs `returning` (based on cross-session local storage).
- `environment`: `production` vs `development`.
- `timestamp`: Precise UTC ISO string.

### 3. Business & Intent Events
We prioritize high-intent actions over generic clicks:
- `scroll_50` / `scroll_75`: Triggered once when the user reaches these depth thresholds.
- `feature_enabled`: Tracks feature flags (e.g., Christmas Mode) once per session to measure user exposure without inflating engagement time.
- `sign_up` / `login`: Standard conversion events with path context.

## Technical Components
- **`src/lib/analytics.ts`**: Centralized service for clean gtag calls.
- **`src/components/GA4Professional.tsx`**: Client-side interaction monitor.
- **`src/app/layout.tsx`**: Implementation entry point.

## Verification
Implementation has been verified for:
1. **Type Safety**: Passed TypeScript verification (`tsc`).
2. **Responsive Correctness**: Logo proportions fixed for mobile devices.
3. **No-Loop Inflation**: Verified that background particles/snow do not trigger GAS events.
