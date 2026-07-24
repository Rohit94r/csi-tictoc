import { useState, useEffect } from 'react';
import Board from './Board';
import WinLoss from './WinLoss';
import './Game.css';

export default function Game({ socket, clubCode, playerSymbol, onLeave }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [gameOver, setGameOver] = useState(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [showWinLoss, setShowWinLoss] = useState(false);

  useEffect(() => {
    socket.on('gameStart', ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
      setGameOver(null);
      setShowWinLoss(false);
    });

    socket.on('moveMade', ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
    });

    socket.on('gameOver', (result) => {
      setGameOver(result);
      setBoard(result.board);
      setTimeout(() => setShowWinLoss(true), 600);
    });

    socket.on('playAgainReady', ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
      setGameOver(null);
      setShowWinLoss(false);
    });

    socket.on('playerDisconnected', () => {
      setOpponentDisconnected(true);
    });

    return () => {
      socket.off('gameStart');
      socket.off('moveMade');
      socket.off('gameOver');
      socket.off('playAgainReady');
      socket.off('playerDisconnected');
    };
  }, [socket]);

  const handleCellClick = (index) => {
    if (gameOver || board[index] !== null || currentTurn !== playerSymbol) return;
    socket.emit('makeMove', index);
  };

  const handlePlayAgain = () => {
    setShowWinLoss(false);
    setGameOver(null);
    socket.emit('playAgain');
  };

  const headerText = gameOver
    ? gameOver.winner === null
      ? "It's a Tie! 🤝"
      : gameOver.winner === playerSymbol
      ? 'You Won! 👑'
      : 'You Lost! 😿'
    : opponentDisconnected
    ? 'Opponent Left 😢'
    : currentTurn === playerSymbol
    ? 'Your Turn!'
    : "Opponent's Turn";

  return (
    <div className="game">
      <div className="game__bg-circle game__bg-circle--1" />
      <div className="game__bg-circle game__bg-circle--2" />

      <div className="game__container">
        <div className="game__header">
          <button className="game__back" onClick={onLeave}>
            ← Leave
          </button>
          <div className="game__club-info">
            <span className="game__club-label">Club Code</span>
            <span className="game__club-code">{clubCode}</span>
          </div>
          <div className="game__symbol-badge">
            <span className="game__symbol-text">You</span>
            <span className={`game__symbol game__symbol--${playerSymbol}`}>
              {playerSymbol === 'X' ? '❌' : '⭕'}
            </span>
          </div>
        </div>

        <h2
          className={`game__status ${
            gameOver && gameOver.winner === playerSymbol ? 'game__status--win' : ''
          } ${
            gameOver && gameOver.winner && gameOver.winner !== playerSymbol
              ? 'game__status--lose'
              : ''
          }`}
        >
          {headerText}
        </h2>

        <Board
          board={board}
          winPattern={gameOver?.pattern}
          onClick={handleCellClick}
          currentTurn={currentTurn}
          playerSymbol={playerSymbol}
          gameOver={!!gameOver}
        />

        <div className="game__info">
          <div className={`game__turn-dot ${currentTurn === playerSymbol ? 'game__turn-dot--active' : ''}`} />
          <span className="game__info-text">
            {currentTurn === playerSymbol ? 'Make your move!' : 'Waiting for opponent...'}
          </span>
        </div>

        {gameOver && !showWinLoss && (
          <button className="game__play-again" onClick={handlePlayAgain}>
            Play Again 🔄
          </button>
        )}
      </div>

      {showWinLoss && gameOver && (
        <WinLoss
          result={gameOver}
          playerSymbol={playerSymbol}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowWinLoss(false)}
        />
      )}
    </div>
  );
}
