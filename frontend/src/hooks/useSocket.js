import { useEffect, useState } from 'react';
import { socket } from '../App';

export const useSocket = (event, handler) => {
  useEffect(() => {
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [event, handler]);
};

export const useSocketEmit = () => {
  return (event, data) => socket.emit(event, data);
};
