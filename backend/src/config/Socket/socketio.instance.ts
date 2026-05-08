import { Server } from 'socket.io';

let _io: Server;

export const setIO = (io: Server) => {
  _io = io;
};

export const getIO = (): Server => {
  if (!_io) throw new Error('Socket.IO not initialized');
  return _io;
};