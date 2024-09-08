import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import { checkWinnerFrom } from '../src/logic/board.js'

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)

let rooms = {}

io.on('connection', socket => {
  console.log('Client connected', socket.id)
  socket.on('createRoom', roomCode => {
    console.log('roomCode', roomCode)
    
    rooms[roomCode] = {
      board: Array(42).fill(null),
      currentPlayer: 'red',
      winner: null
    }
    
    socket.join(roomCode)
    console.log(`Room created: ${roomCode}`)
    
    socket.emit('gameState', rooms[roomCode])
  })
  socket.on('joinRoom', roomCode => {
    if(rooms[roomCode]) {
      socket.join(roomCode)
      console.log(`Player joined room: ${roomCode}`)
      
      socket.emit('gameState', rooms[roomCode])
    } else {
      socket.emit('Error:', 'Room not found')
    }
  })
  
  socket.on('makeMove', ({ column, player, roomCode }) => {
    const room = rooms[roomCode]
    if(!room) return
    
    if (player !== room.currentPlayer || room.winner) return
    
    const  newBoard = [...room.board]
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
      currentPlayer: 'yellow',
      winner: null
    }
    
    io.to(roomCode).emit('gameState', rooms[roomCode])
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id)
  })
})

server.listen(4000, () => {
  console.log('Server running at', 4000)
})