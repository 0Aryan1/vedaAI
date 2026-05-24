'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket(): Socket | null {
  // Prevent socket initialization during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  // Create singleton socket instance
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000',
      {
        autoConnect: false,
        transports: ['websocket', 'polling'],
      }
    );
  }

  return socket;
}

export function connectSocket(): void {
  const s = getSocket();

  if (!s) return;

  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  const s = getSocket();

  if (!s) return;

  if (s.connected) {
    s.disconnect();
  }
}

export function joinJobRoom(jobId: string): void {
  const s = getSocket();

  if (!s) return;

  s.emit('join:job', jobId);
}

export function onJobStarted(
  callback: (payload: {
    jobId: string;
    assignmentId: string;
  }) => void
): void {
  const s = getSocket();

  if (!s) return;

  s.on('job:started', callback);
}

export function onJobProgress(
  callback: (payload: {
    jobId: string;
    percentage: number;
    message: string;
  }) => void
): void {
  const s = getSocket();

  if (!s) return;

  s.on('job:progress', callback);
}

export function onJobCompleted(
  callback: (payload: {
    jobId: string;
    assignmentId: string;
    paperId: string;
  }) => void
): void {
  const s = getSocket();

  if (!s) return;

  s.on('job:completed', callback);
}

export function onJobFailed(
  callback: (payload: {
    jobId: string;
    error: string;
  }) => void
): void {
  const s = getSocket();

  if (!s) return;

  s.on('job:failed', callback);
}

export function offAllListeners(): void {
  const s = getSocket();

  if (!s) return;

  s.offAny();
}

// Export function reference, NOT execution
export default getSocket;