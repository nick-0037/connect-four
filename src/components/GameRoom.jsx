import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import io from "socket.io-client";
import { Round } from "./Round.jsx";
import { WinnerModal } from "./WinnerModal.jsx";
import { useNavigate, useParams } from "react-router-dom";

const socket = io("/");

function GameRoom() {
  const { roomCode } = useParams(); // to code of room enter by user
  const [gameState, setGameState] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const navigate = useNavigate();
  const [roomNotStarted, setRoomNotStarted] = useState(false);

  useEffect(() => {
    if (!roomCode) return;

    // Decide whether this client created the room (pressed Play) or is joining
    const creatorFlag = (() => {
      try {
        return sessionStorage.getItem(`creator:${roomCode}`) === "true";
      } catch (e) {
        return false;
      }
    })();

    if (creatorFlag) {
      try {
        sessionStorage.removeItem(`creator:${roomCode}`);
      } catch (e) {}
      socket.emit("createRoom", roomCode);
    } else {
      socket.emit("joinRoom", roomCode);
    }

    // listen the changes in the state of game from server
    socket.on("gameState", (state) => {
      console.log("Received game state:", state);
      setGameState(state);
      // if we receive game state, clear the 'not started' flag
      setRoomNotStarted(false);
      setCurrentPlayer(state.currentPlayer);
    });

    socket.on("roomNotStarted", (msg) => {
      console.warn("roomNotStarted:", msg);
      setRoomNotStarted(true);
    });

    return () => {
      socket.off("gameState"); // clear listeners when component is unmounted
      socket.off("roomNotStarted");
    };
  }, [roomCode]);

  const handleMove = (index) => {
    if (!gameState || gameState.board[index] || gameState.winner) return;

    // send move to server
    socket.emit("makeMove", {
      column: index,
      player: currentPlayer,
      roomCode,
    });
  };

  const resetGame = () => {
    socket.emit("resetGame", roomCode); // reset game in the room
  };

  const winner = gameState ? gameState.winner : null;

  useEffect(() => {
    if (winner) {
      confetti();
    }
  }, [winner]);

  const handleBackHome = () => {
    navigate("/home");
  };

  // Auto retry join while the room is not started
  useEffect(() => {
    if (!roomNotStarted) return;
    let attempts = 0;
    const maxAttempts = 10;
    const id = setInterval(() => {
      attempts++;
      try {
        console.log(
          "Retrying joinRoom for",
          roomCode,
          "(attempt",
          attempts + ")",
        );
        if (
          typeof socket !== "undefined" &&
          socket &&
          typeof socket.emit === "function"
        ) {
          socket.emit("joinRoom", roomCode);
        } else {
          console.warn("Socket not ready, skipping emit");
        }
      } catch (e) {
        console.error("Retry join failed", e);
      }

      if (attempts >= maxAttempts) {
        console.warn("Max join attempts reached, stopping retries");
        clearInterval(id);
      }
    }, 3000);

    return () => clearInterval(id);
  }, [roomNotStarted, roomCode]);

  return (
    <>
      <main className="main">
        <div>
          <h1>Game Room</h1>
          <section className="board">
            <div className="game">
              {
                // always render the board (use server board if present, otherwise empty)
                (gameState ? gameState.board : Array(42).fill(null)).map(
                  (round, index) => (
                    <Round
                      key={index}
                      index={index}
                      color={round}
                      updatedBoard={() => handleMove(index)}
                      disabled={
                        roomNotStarted || !!(gameState && gameState.winner)
                      }
                    />
                  ),
                )
              }
            </div>

            <section className="turn">
              <h2 className={`turn-text ${currentPlayer}`}>Your turn</h2>
              <Round color={currentPlayer}></Round>
            </section>
          </section>

          <section>
            <WinnerModal
              resetGame={resetGame}
              winner={winner}
              color={currentPlayer}
            />
          </section>
        </div>

        <div className="board-info">
          <div>
            {roomNotStarted ? (
              <div>
                <h3>Room not started</h3>
                <p>
                  The host hasn't pressed <strong>Play</strong> yet.
                </p>
                <p>Waiting for the creator to start the game.</p>
              </div>
            ) : (
              <div>
                <p>
                  Room code: <strong>{roomCode}</strong>
                </p>
                <p>
                  Status: {" "}
                  {gameState
                    ? gameState.winner
                      ? `Finished`
                      : "Playing"
                    : "Waiting for host"}
                </p>
              </div>
            )}
          </div>

          <div>
            <button onClick={handleBackHome}>back to home</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default GameRoom;
