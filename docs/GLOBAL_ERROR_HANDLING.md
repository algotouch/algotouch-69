# Global Error Handling

This document describes the error boundary strategy used in AlgoTouch.

## Global boundary

`App.tsx` wraps the application's `<Routes>` component in `ErrorBoundary` from `src/components/errors`. Any uncaught error in route components will surface through this boundary and render a default fallback.

## Page specific boundaries

Pages can still include their own `ErrorBoundary` components when they need custom fallback UI or recovery behavior. If a page has no custom fallback it should rely on the global boundary instead of wrapping its content repeatedly.

## Development notes

When adding new routes or pages, ensure they work with the global error boundary. Provide custom fallbacks only when the page requires special handling or messaging.
