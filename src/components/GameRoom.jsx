import { useEffect, useState } from "react";
import io from "socket.io-client"
import { Round } from "./Round.jsx";
import { WinnerModal } from "./WinnerModal.jsx";
import { useNavigate, useParams } from "react-router-dom";

const socket = io('/')

function GameRoom() {
  const { roomCode } = useParams() // to code of room enter by user
  const [gameState, setGameState] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!roomCode) return;

    // Entry room with code
    socket.emit('createRoom', roomCode)

    // listen the changes in the state of game from server
    socket.on('gameState', state => {
      console.log('Received game state:', state);
      setGameState(state)
      setCurrentPlayer(state.currentPlayer)
    })

    return () => {
      socket.off('gameState') // clear listeners when component is unmounted
    }
  }, [roomCode])

  const handleMove = (index) => {
    if(!gameState || gameState.board[index] || gameState.winner) return

    // send move to server
    socket.emit('makeMove', {
      column: index,
      player: currentPlayer,
      roomCode
    })
  }

  const resetGame = () => {
    socket.emit('resetGame', roomCode) // reset game in the room
  }

  const winner = gameState ? gameState.winner : null

  const handleBackHome = () => {
    navigate('/home')
  }

  return (
    <>
      <main className="board">
        <div>
          <h1>Game Room</h1>
          <section className="game">
            {gameState && gameState.board.map((round, index) => (
              <Round 
              key={index}
              index={index}
              color={round}
              updatedBoard={() => handleMove(index)}
              />
            ))}
          </section>

          <section className="turn">
              <h2 className={`turn-text ${currentPlayer}`}>Your turn</h2>
              <Round color={currentPlayer}>
              </Round>
            </section>

          <section>
            <WinnerModal resetGame={resetGame} winner={winner} color={currentPlayer}/>
          </section>
        </div>

        <div>
          <button onClick={handleBackHome}>back to home</button>
        </div>
      </main>
    </>
  )
}

export default GameRoom