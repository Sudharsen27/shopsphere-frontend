"use client";

import { useSyncExternalStore } from "react";

export function useHydrated() {
  return useSyncExternalStore(
    () => () => {}, // no subscription
    () => true,     // client snapshot
    () => false     // server snapshot
  );
}