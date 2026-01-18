import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatingRoom() {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setRoomCode(code);
    setIsCreatingRoom(true);
  };

  const handleJoinRoom = () => {
    setIsCreatingRoom(false);
    setIsJoining(true);
  };

  const handleSubmitJoin = (e) => {
    e.preventDefault();

    navigate(`/game/${roomCode}`);
  };

  const handlePlay = () => {
    sessionStorage.setItem(`creator:${roomCode}`, "true");
    navigate(`/game/${roomCode}`);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      alert("Room code copied to clipboard!");
    });
  };

  return (
    <div>
      {isCreatingRoom ? (
        <div className="container-creating-room">
          <input
            className="creating-room-input"
            type="text"
            value={roomCode}
            readOnly
          />
          <div className="container-bts">
            <button type="button" onClick={copyRoomCode}>
              Copy
            </button>
            <button type="button" onClick={handlePlay}>
              Play
            </button>
          </div>
        </div>
      ) : isJoining ? (
        <form className="container-join" onSubmit={handleSubmitJoin}>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
          />
          <button type="submit">Join</button>
        </form>
      ) : (
        <div className="container-bts">
          <button onClick={handleCreateRoom}>Create Room</button>
          <button onClick={handleJoinRoom}>Join</button>
        </div>
      )}
    </div>
  );
}

export default CreatingRoom;
