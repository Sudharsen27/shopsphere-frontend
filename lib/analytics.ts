import { track as vercelTrack } from "@vercel/analytics";

type AllowedPropertyValues = string | number | boolean | null | undefined;

export function trackEvent(name: string, properties?: Record<string, AllowedPropertyValues>) {
  try {
    // Vercel Analytics supports calling track on client.
    // Guarding keeps server renders safe if imported somewhere unexpected.
    if (typeof window === "undefined") return;
    vercelTrack(name, properties);
  } catch {
    // never break UX due to analytics
  }
}

