import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
  board: Array(6).fill(null).map(() => Array(7).fill(null)),
  currentPlayer: 'player1'
}

wss.on('connection', ws => {
  console.log('New connection');

  ws.on('message', message => {
    const data = JSON.parse(message);

    // Process game moves
    if (data.type === 'move') {
      // update game state
      const { column,  player } = data;
      // logic to update board and change turn

      // Broadcast updated game state to all clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(gameState));
        }
      });
    }
  });

  // Send initial game state to the new client
  ws.send(JSON.stringify(gameState));
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
})