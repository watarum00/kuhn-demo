import React from 'react';

function Card({ value, isFaceDown }) {
  return (
    <div className={`card ${isFaceDown ? 'face-down' : ''}`}>
      {!isFaceDown ? value : ''} {/* If the card is face down, don't show the value */}
    </div>
  );
}

export default Card;
