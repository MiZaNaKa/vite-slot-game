
import React from "react";
import styled from 'styled-components';

interface SpinButtonProps {
  spinAgain: boolean;
  spinning: boolean;
  modalIsOpen: boolean;
  spinReels: () => void;
}

const SpinButton: React.FC<SpinButtonProps> = ({
  spinAgain,
  spinning,
  modalIsOpen,
  spinReels,
}) => {
  return (
    <>
      {spinAgain ? (
        <Button onClick={spinReels} disabled={spinning || modalIsOpen}>
          {spinning ? "Spinning..." : "Start"}
        </Button>
      ) : (
        <p style={{ fontSize: 22, color: "red" }}>
          {spinning ? "Spinning..." : ""}
        </p>
      )}
    </>
  );
};

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #d35400;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default SpinButton;
