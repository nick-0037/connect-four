import { useEffect, useState } from "react";
import "../Round.css";

export const Round = ({
  color,
  updatedBoard,
  index,
  fallingAnimation,
  disabled,
}) => {
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    setFalling(!!fallingAnimation);
  }, [fallingAnimation]);

  const handleClick = () => {
    if (disabled) return;
    if (typeof updatedBoard === "function") updatedBoard(index);
  };

  return (
    <div
      onClick={handleClick}
      className={`round ${color || ""} ${falling ? "falling" : ""} ${disabled ? "disabled" : ""}`}
    ></div>
  );
};
