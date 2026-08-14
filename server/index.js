import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import { checkWinnerFrom } from '../src/logic/board.js'

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
const PORT = Number(process.env.PORT) || 4001

let rooms = {}

const getAvailableColor = room => {
  const takenColors = new Set(Object.values(room.players || {}))
  return ['red', 'yellow'].find(color => !takenColors.has(color)) || null
}

io.on('connection', socket => {
  console.log('Client connected', socket.id)
  socket.on('createRoom', roomCode => {
    console.log('roomCode', roomCode)
    rooms[roomCode] = {
      board: Array(42).fill(null),
      currentPlayer: 'red',
      winner: null,
      started: true,
      players: {
        [socket.id]: 'red'
      }
    }
    
    socket.join(roomCode)
    console.log(`Room created: ${roomCode}`)
    socket.emit('playerColor', 'red')
    socket.emit('gameState', rooms[roomCode])
  })
  socket.on('joinRoom', roomCode => {
    const room = rooms[roomCode]
    if (room) {
      const assignedColor = getAvailableColor(room)

      if (!assignedColor) {
        socket.emit('roomFull', 'Room is full')
        return
      }

      room.players[socket.id] = assignedColor
      socket.join(roomCode)
      console.log(`Player joined room: ${roomCode} as ${assignedColor}`)
      socket.emit('playerColor', assignedColor)
      socket.emit('gameState', room)
    } else {
      // Room hasn't been created/started by the host yet
      console.log(`Player attempted to join non-started room: ${roomCode}`)
      socket.emit('roomNotStarted', 'Room has not been started by the host')
    }
  })
  
  socket.on('makeMove', ({ column, roomCode }) => {
    const room = rooms[roomCode]
    if (!room) return

    const player = room.players[socket.id]
    if (!player || player !== room.currentPlayer || room.winner) return
    
    const newBoard = [...room.board]
    let fallIndex = column
    
    while(fallIndex + 7 < 42 && newBoard[fallIndex + 7] === null) {
      fallIndex += 7
    }
    
    newBoard[fallIndex] = player;
    
    room.board = newBoard
    room.currentPlayer = room.currentPlayer === 'red' ? 'yellow' : 'red'
    
    const winner = checkWinnerFrom(newBoard, fallIndex, player) 
    if(winner) room.winner = winner
    
    io.to(roomCode).emit('gameState', room)
  })
  
  socket.on('resetGame', roomCode => {
    if(!rooms[roomCode]) return
    
    rooms[roomCode] = {
      board: Array(42).fill(null),
      currentPlayer: 'red',
      winner: null,
      started: true
    }
    
    io.to(roomCode).emit('gameState', rooms[roomCode])
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id)
  })
})

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is busy, retrying with ${PORT + 1}`)
    server.listen(PORT + 1, () => {
      console.log('Server running at', PORT + 1)
    })
    return
  }

  throw error
})

server.listen(PORT, () => {
  console.log('Server running at', PORT)
})