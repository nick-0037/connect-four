import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import '../WinnerModal.css'

export function WinnerModal ({ winner, resetGame, color }) {
  useEffect(() => {
    if (!winner) return

    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 }
    })
  }, [winner])

  if (winner === null) return null

  const colorWinner = winner || color
  const isWinner = colorWinner === 'red' ? 'Red wins' : 'Yellow wins'

  return (
    <section className='winner'>
      <div className='win'>
        <p className="text">{isWinner}</p>
        <span className={`win-color ${colorWinner}`}>{colorWinner}</span>
      </div>
      <button onClick={resetGame}>Reset Game</button>
    </section>
  )
}