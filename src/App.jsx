import { useEffect, useState } from "react"
import { Round } from "./components/Round.jsx"
import { WinnerModal } from "./components/WinnerModal.jsx"
import { checkWinnerFrom } from "./logic/board.js"
import confetti from "canvas-confetti"

function App() {
  const [board, setBoard] = useState(Array(42).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('red')

  const [fallingIndex, setFallingIndex] = useState(null)
  const [isBoardLocked, setIsBoardLocked] = useState(false)
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(42).fill(null))
    setIsBoardLocked(false)
    setWinner(null)
    setFallingIndex(null)
    setCurrentPlayer('yellow')
  }
  
  const updatedBoard = (index) => {
    if(board[index] || isBoardLocked) return

    const newBoard = [...board]
    
    //Encuentra la primera posicion vacia en la columna
    let fallIndex = index
    
    while(fallIndex + 7 < 42 && newBoard[fallIndex + 7] === null) {
      fallIndex += 7;
    }
  
    //Establece el estado de la ficha en la posicion
    newBoard[fallIndex] = currentPlayer

    //Establece el indice en la ficha en caida y bloquea el board
    setFallingIndex(index)
    setIsBoardLocked(true)
    setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red')


    setTimeout(() => {
      setBoard(newBoard)
      setFallingIndex(null)
      setIsBoardLocked(false)
      
      const hasWinner = checkWinnerFrom(newBoard, index, currentPlayer)
      if (hasWinner) {
        confetti()
        setWinner(currentPlayer)
      }

    }, 500) //tiempo de animacion
  }
  
  useEffect(() => {
    if (winner) {
      setIsBoardLocked(true);
    }
  }, [winner])

  return (
    <>
      <main className="board">
        <h1>Connect Four</h1>
        <button onClick={resetGame}>Reset Game</button>
        <section className="game">
          {
            board.map((round, index) => {
              return (
                <Round 
                key={index} 
                index={index} 
                color={round} 
                updatedBoard={updatedBoard}
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
      </main>
    </>
  )
}

export default App