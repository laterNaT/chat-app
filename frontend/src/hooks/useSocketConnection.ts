import { useEffect } from "react";
import { Socket } from "socket.io-client";

/**
 * Hook to connect and disconnect Socket
 * @param socket Socket
 * @returns void
 *
 */
export const useSocketConnection = (socket: Socket) => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);
};
