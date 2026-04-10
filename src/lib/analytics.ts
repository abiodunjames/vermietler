/**
 * PostHog event tracking helpers.
 * Usage: import { track, identify } from '../lib/analytics';
 */

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (distinctId: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function track(event: string, properties?: Record<string, unknown>) {
  window.posthog?.capture(event, properties);
}

export function identify(distinctId: string, properties?: Record<string, unknown>) {
  window.posthog?.identify(distinctId, properties);
}
