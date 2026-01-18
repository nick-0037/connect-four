import { useEffect, useState } from "react"
import { Round } from "./components/Round.jsx"
import { WinnerModal } from "./components/WinnerModal.jsx"
// import GameRoom from "./components/GameRoom.jsx"
import CreatingRoom from "./components/CreatingRoom.jsx"
import { checkWinnerFrom } from "./logic/board.js"
import confetti from "canvas-confetti"

function App() {
  const [board, setBoard] = useState(Array(42).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('red')

  const [fallingIndex, setFallingIndex] = useState(null)
  const [isBoardLocked, setIsBoardLocked] = useState(false)
  const [winner, setWinner] = useState(null)
  
  const updatedBoard = (index) => {
    if(board[index] || isBoardLocked) return

    const newBoard = [...board]
    
    // Found first position null in the board
    let fallIndex = index
    
    while(fallIndex + 7 < 42 && newBoard[fallIndex + 7] === null) {
      fallIndex += 7;
    }
  
    // Set state ficha in the position
    newBoard[fallIndex] = currentPlayer
    
    // Set index of the ficha in falling and block board
    setFallingIndex(index)
    setIsBoardLocked(true)
    setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red')
    
    setTimeout(() => {
      setBoard(newBoard)
      setFallingIndex(null)
      setIsBoardLocked(false)
      
    }, 500) // time animation
  }
  
  const resetGame = () => {
    setBoard(Array(42).fill(null))
    setWinner(null)
    setIsBoardLocked(false)
    setCurrentPlayer('yellow')
  }
  
  useEffect(() => {
    if (winner) {
      setIsBoardLocked(true);
    }
  }, [winner])

  return (
    <>
      <main className="main">
        <div>
          <h1>Connect Four</h1>
          <section className="game">
            {
              board.map((round, index) => {
                return (
                  <Round 
                  key={index} 
                  index={index} 
                  color={round} 
                  updatedBoard={() => updatedBoard(index)}
                  fallingAnimation={fallingIndex === index}
                  >
                    {round}
                  </Round>
                )
              })
            }
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

        <section className="game-room">
          <CreatingRoom /> 
        </section>
      </main>
    </>
  )
}

export default App