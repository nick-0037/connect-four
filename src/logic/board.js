const ROWS = 6
const COLS = 7

export const checkWinnerFrom = (board, lastMoveIndex, player) => {
  const row = Math.floor( lastMoveIndex / COLS)
  const col = lastMoveIndex % COLS

  const checkDirection = (dirX, dirY) => {
    let count = 0
    let r = row
    let c = col

    while (
      r >= 0 && r < ROWS &&
      c >= 0 && c < COLS &&
      board[r * COLS + c] === player
    ) { 
      count++
      r += dirX
      c += dirY
    }
    return count
  }
  const vertical = checkDirection(1, 0)
  const horizontal = checkDirection  (0, 1) + checkDirection(0, -1) - 1
  const diagonal1 =  checkDirection(1, 1) + checkDirection(-1, -1) - 1 // diagonal / 
  const diagonal2 = checkDirection(1, -1) + checkDirection(-1, 1) - 1 // diagonal \ 
  
  const isWinner = vertical >= 4 || horizontal >=4 ||
  diagonal1 >= 4 || diagonal2 >= 4

  return isWinner ? player : null
}