import { useEffect , useState } from 'react'
import '../Round.css'

export const Round = ({ color, updatedBoard, index, fallingAnimation }) => {

  const [falling, setFalling] = useState(false);

  useEffect(() => {
    if (falling) {
      setFalling(true);
    } else {
      setFalling(false);
    }

  }, [falling])

  const handleClick = () => {
    updatedBoard(index)

  }
  
  return (
    <div onClick={handleClick} 
    className={`round ${color} ${fallingAnimation ? 'falling' : ''}`}
    >
    </div>
  )
}