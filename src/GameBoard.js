import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Chip from './Chip';
import './GameBoard.css';

let infoString = "";
let isShowdown = false;

function GameBoard() {
  const [playerChips, setPlayerChips] = useState(2);
  const [cpuChips, setCpuChips] = useState(2);
  const [centerChips, setCenterChips] = useState(0);
  const [playerCard, setPlayerCard] = useState(null);
  const [cpuCard, setCpuCard] = useState(null);
  const [deck, setDeck] = useState(['J', 'Q', 'K']);
  const [deckFaceUp, setDeckFaceUp] = useState(true);
  const [isTerminal, setIsTerminal] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [currentActions, setCurrentActions] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [cpuAction, setCpuAction] = useState(null);
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  const startGame = () => {
    if (playerChips > 0 && cpuChips > 0) {
      setPlayerChips(playerChips - 1);
      setCpuChips(cpuChips - 1);
      setCenterChips(centerChips + 2);
      setDeckFaceUp(false);
      const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);
      setPlayerCard(shuffledDeck[0]);
      setCpuCard(shuffledDeck[1]);
      infoString = shuffledDeck[0] + shuffledDeck[1];
      console.log(infoString);
      setDeck([shuffledDeck[2]]);
      setIsGameStarted(true);
      processGame("");
    }
  };

  const restartGame = () => {
    window.location.reload();
  };

  const cardValue = (card) => {
    switch (card) {
      case 'J':
        return 0;
      case 'Q':
        return 1;
      case 'K':
        return 2;
      default:
        return 0;
    }
  };
  
  const playerFunction = () => {
    // return who's turn
    if (infoString.length == 2 || infoString.length == 4) {
      return 1;
    } else if (infoString.length == 3) {
      return 2;
    }
  }

  const processGame = useCallback((parentNodeAction) => {
    if (isTerminal) {
      return;
    }
    const player = playerFunction();
    console.log("playerFunction = " + playerFunction());
    if (player === 1) {
      console.log(playerFunction());
      // player 1's turn
      if (infoString.length === 2) {
        // choose check or bet
        setIsPlayerTurn(true);
        setCurrentActions(["Check", "Bet"]);
      } else {
        // choose fold or bet
        setIsPlayerTurn(true);
        setCurrentActions(["Fold", "Bet"]);
      }
    } else if (player === 2) {
      // player 2's turn
      const cpuActions = [0, 1];
      let parentAction = infoString[infoString.length-1];
      console.log("parentAction = " + parentAction);
      if (parentAction === "0") {
        // choose check or bet
        // cpu chooses an action randomly.
        const randomAction = cpuActions[Math.floor(Math.random() * cpuActions.length)];
        infoString += randomAction;
        if (randomAction === 0) {
          setCpuAction("Check");
          setIsTerminal(true);
          isShowdown = true;
        } else {
          // cpu selects bet
          setCpuAction("Bet");
          setCenterChips(centerChips + 1);
          setCpuChips(cpuChips - 1);
          processGame(1);
        }
      } else {
        // choose fold or bet
        // cpu chooses an action randomly.
        const randomAction = cpuActions[Math.floor(Math.random() * cpuActions.length)];
        infoString += randomAction;
        if (cpuActions === 1) {
          setCpuAction("Bet");
          setCenterChips(centerChips + 1);
          setCpuChips(cpuChips - 1);
          isShowdown = true;
        } else {
          setCpuAction("Fold");
        }
        setIsTerminal(true);
      }
    }
  }, [isPlayerTurn, isGameStarted]);

  const handleAction = (action) => {
    infoString += action;
    if (action === 1) {
      setCenterChips(centerChips + 1);
      setPlayerChips(playerChips - 1);
    }
    if (infoString.length === 5) {
      if (action !== 0) {
        isShowdown = true;
      }
      setIsTerminal(true);
      setIsPlayerTurn(false);
    } else {
      setIsPlayerTurn(false); // プレイヤーのターンを終了
    }
  };

  useEffect(() => {
    if (isPlayerTurn !== true && isGameStarted === true && isTerminal === false) {
      setIsCpuThinking(true);
      setTimeout(() => {
        setIsCpuThinking(false);
        processGame("");
      }, 1500); // cpu thinking time
    }
  }, [isPlayerTurn, isGameStarted]);

  useEffect(() => {
    if (isTerminal && !cpuAction) {
      // game end
      setDeckFaceUp(true);
      console.log("game end! infoString = " + infoString);
      let winner;
      if (isShowdown) {
        console.log("playerCard = " + playerCard);
        console.log("cpuCard = " + cpuCard);
        if (cardValue(playerCard) > cardValue(cpuCard)) {
          winner = "Player 1 wins!";
          setPlayerChips(playerChips + centerChips);
          setCenterChips(0);
        } else {
          winner = "CPU wins!";
          setCpuChips(cpuChips + centerChips);
          setCenterChips(0);
        }
        setGameResult(winner);
      } else {
        // either player folds
        if (infoString.length === 4) {
          // player 2 folds
          winner = "Player 1 wins!";
          setPlayerChips(playerChips + centerChips);
          setCenterChips(0);
        } else {
          // player 1 folds
          winner = "CPU wins!";
          setCpuChips(cpuChips + centerChips);
          setCenterChips(0);
        }
        setGameResult(winner);
      }
    }
  }, [isTerminal, cpuAction]);

  return (
    <div className="game-board">
      <div className="cpu-area">
        <h2>CPU Chips: {cpuChips}</h2>
        <div className="chip-container">
          {Array(cpuChips).fill(<Chip/>)}
        </div>
        {cpuCard && <Card value={cpuCard} isFaceDown={!deckFaceUp} />}
      </div>

      <div className="button-area">
      {!isGameStarted ? (
          <motion.button onClick={startGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.8 }}
          className='action-button'
          >Game Start</motion.button>
        ) : (
          isPlayerTurn && (
            <div>
              {currentActions.map((action, index) => (
                <motion.button key={action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.8 }}
                className='action-button'
                onClick={() => handleAction(index)}>
                  {action}
                </motion.button>
              ))}
            </div>
          )
        )}
      </div>

      <div className="dealer-area">
        <motion.button
          onClick={restartGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.8 }}
          className='restart-button'
        >
          Restart
        </motion.button>
        <h2>Dealer's Chips: {centerChips}</h2>
        <div className="chip-container">
          {Array(centerChips).fill(<Chip />)}
        </div>
        <div className="card-pile">
          {deck.map((card, index) => (
            <Card key={index} value={card} isFaceDown={!deckFaceUp} />
          ))}
        </div>
      </div>

      <div className="player-area">
        <h2>Your Chips: {playerChips}</h2>
        <div className="chip-container">
          {Array(playerChips).fill(<Chip />)}
        </div>
        {playerCard && <Card value={playerCard} isFaceDown={false} />}
      </div>

      {isCpuThinking && (
        <motion.div
          className="thinking-modal"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <h2>CPU is thinking...</h2>
        </motion.div>
      )}

      {cpuAction && (
        <motion.div
          className="action-modal"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <h2>CPU chosed {cpuAction}!</h2>
          <motion.button
            onClick={() => setCpuAction(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.8 }}
            className='action-button'
          >
            Close
          </motion.button>
        </motion.div>
      )}

      {gameResult && (
        <motion.div
          className="result-modal"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <h2>{gameResult}</h2>
          <motion.button
            onClick={() => setGameResult(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.8 }}
            className='action-button'
          >
            Close
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default GameBoard;
