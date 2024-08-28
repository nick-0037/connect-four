import '../WinnerModal.css'

export function WinnerModal ({winner, resetGame, color}) {
  if (winner === null) return 

  const isWinner = winner !== null ? 'You won' : 'Draw'
  const colorWinner = color !== 'red' ? 'red' : 'yellow'

  return (
    <section className='winner'>
      <div className='win'>
        <p className="text" >{isWinner}</p>
        <span className={`win-color ${colorWinner}`} >{colorWinner}</span>
      </div>
      <button onClick={resetGame}> Reset Game</button>
    </section>
  )
}