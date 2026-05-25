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
    console.log('[Socket] Initializing with URL:', url);
    
    socket = io(url, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    // Connection lifecycle logging
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (err: Error) => {
      console.error('[Socket] Connection error:', err.message);
    });
  }

  return socket;
}

export function connectSocket(): void {
  if (typeof window === 'undefined') return;
  console.log('[Socket] Connecting to', process.env.NEXT_PUBLIC_WS_URL);
  getSocket().connect();
}

export function disconnectSocket(): void {
  // Intentionally do nothing — socket persists for the lifetime of the browser session
  // The socket should NOT be destroyed on hook cleanup, only event listeners
}

export function joinJobRoom(jobId: string): void {
  if (typeof window === 'undefined') return;
  console.log('[Socket] Joining job room:', jobId);
  getSocket().emit('join:job', jobId);
}

export function onJobStarted(
  callback: (payload: {
    jobId: string;
    assignmentId: string;
  }) => void
): () => void {
  const s = getSocket();
  console.log('[Socket] Registering job:started listener');
  s.on('job:started', (data) => {
    console.log('[Socket] Received job:started:', data);
    callback(data);
  });
  // Return cleanup function that removes THIS specific listener
  return () => {
    console.log('[Socket] Removing job:started listener');
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
  console.log('[Socket] Registering job:progress listener');
  s.on('job:progress', (data) => {
    console.log('[Socket] Received job:progress:', data);
    callback(data);
  });
  // Return cleanup function that removes THIS specific listener
  return () => {
    console.log('[Socket] Removing job:progress listener');
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
  console.log('[Socket] Registering job:completed listener');
  s.on('job:completed', (data) => {
    console.log('[Socket] Received job:completed:', data);
    callback(data);
  });
  // Return cleanup function that removes THIS specific listener
  return () => {
    console.log('[Socket] Removing job:completed listener');
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
  console.log('[Socket] Registering job:failed listener');
  s.on('job:failed', (data) => {
    console.log('[Socket] Received job:failed:', data);
    callback(data);
  });
  // Return cleanup function that removes THIS specific listener
  return () => {
    console.log('[Socket] Removing job:failed listener');
    s.off('job:failed', callback);
  };
}

export function offAllListeners(): void {
  // Intentionally do nothing — individual listeners are cleaned up via returned cleanup functions
}

export default getSocket;