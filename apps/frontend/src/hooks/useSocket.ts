import { useCallback, useEffect, useRef, useState } from "react";

type UseSocketOptions = {
  url: string;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: MessageEvent) => void;
  reconnectms?: number;
};

export const useSocket = ({
  url,
  onOpen,
  onClose,
  onError,
  onMessage,
  reconnectms = 5000,
}: UseSocketOptions) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = useCallback(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = (event) => {
      setIsConnected(true);
      onOpen?.(event);
    };

    socket.onclose = (event) => {
      setIsConnected(false);
      onClose?.(event);

      if (!event.wasClean) {
        setTimeout(() => {
          connect();
        }, reconnectms);
      }
    };

    socket.onerror = (event) => {
      onError?.(event);
    };

    socket.onmessage = (event) => {
      onMessage?.(event);
    };
  }, [url, onOpen, onClose, onError, onMessage, reconnectms]);

  useEffect(() => {
    connect();

    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.send(message);
      } else {
        console.error("Socket is not connected");
      }
    },
    [isConnected]
  );

  return {
    sendMessage,
    isConnected,
  };
};
