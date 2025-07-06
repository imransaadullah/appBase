import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '../../../utils/constants';

let socket: Socket | null = null;

export const initSocket = (userId?: string) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: {
      userId,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = (event: string, data: any) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not initialized');
  }
};

export const onEvent = (event: string, callback: (data: any) => void) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.warn('Socket not initialized');
  }
};

export const offEvent = (event: string, callback?: (data: any) => void) => {
  if (socket) {
    socket.off(event, callback);
  }
}; 