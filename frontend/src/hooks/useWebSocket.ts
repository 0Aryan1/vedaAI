"use client";

import type { JobStatusPayload } from "@/types/websocket";

export function useWebSocket(onStatus?: (payload: JobStatusPayload) => void) {
  return {
    isConnected: false,
    emitLocalStatus: onStatus,
  };
}
