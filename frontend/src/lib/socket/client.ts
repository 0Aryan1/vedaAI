'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket(): Socket {
  // Prevent socket initialization during SSR
  if (typeof window === 'undefined') {
    throw new Error('Socket only available in browser');
  }

  // Create singleton socket instance
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';
    
    socket = io(url, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
    });

    socket.on('disconnect', () => {
    });

    socket.on('connect_error', (err: Error) => {
      console.error('[Socket] Connection error:', err.message);
    });
  }

  return socket;
}

export function connectSocket(): void {
  if (typeof window === 'undefined') return;
  getSocket().connect();
}

export function disconnectSocket(): void {
  // Intentionally do nothing — socket persists for the lifetime of the browser session
  // The socket should NOT be destroyed on hook cleanup, only event listeners
}

export function joinJobRoom(jobId: string): void {
  if (typeof window === 'undefined') return;
  getSocket().emit('join:job', jobId);
}

export function onJobStarted(
  callback: (payload: {
    jobId: string;
    assignmentId: string;
  }) => void
): () => void {
  const s = getSocket();
  s.on('job:started', (data) => {
    callback(data);
  });
  return () => {
    s.off('job:started', callback);
  };
}

export function onJobProgress(
  callback: (payload: {
    jobId: string;
    percentage: number;
    message: string;
  }) => void
): () => void {
  const s = getSocket();
  s.on('job:progress', (data) => {
    callback(data);
  });
  return () => {
    s.off('job:progress', callback);
  };
}

export function onJobCompleted(
  callback: (payload: {
    jobId: string;
    assignmentId: string;
    paperId: string;
  }) => void
): () => void {
  const s = getSocket();
  s.on('job:completed', (data) => {
    callback(data);
  });
  return () => {
    s.off('job:completed', callback);
  };
}

export function onJobFailed(
  callback: (payload: {
    jobId: string;
    error: string;
  }) => void
): () => void {
  const s = getSocket();
  s.on('job:failed', (data) => {
    callback(data);
  });
  return () => {
    s.off('job:failed', callback);
  };
}

export function offAllListeners(): void {
  // Intentionally do nothing — individual listeners are cleaned up via returned cleanup functions
}

export default getSocket;