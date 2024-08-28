import { useEffect, useState } from "react";

function useWebSocket(url) {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onmessage = event => {
      const newState = JSON.parse(event.data);
      setGameState(newState);
    }

    return () => socket.close();
  }, [url]);

  const sendMove = (column, player) => {
    if (ws) {
      const message = JSON.stringify({
        action: 'move',
        column,
        player
      });
      ws.send(message);
    }
  };

  return { gameState, sendMove };
}

export default useWebSocket;