import './Board.css';

export default function Board({ board, winPattern, onClick, currentTurn, playerSymbol, gameOver }) {
  const isMyTurn = currentTurn === playerSymbol && !gameOver;

  return (
    <div className={`board ${!isMyTurn ? 'board--inactive' : ''}`}>
      {board.map((cell, index) => {
        const isWinCell = winPattern && winPattern.includes(index);
        return (
          <button
            key={index}
            className={`board__cell ${cell ? 'board__cell--filled' : ''} ${
              isWinCell ? 'board__cell--win' : ''
            } ${cell === 'X' ? 'board__cell--x' : ''} ${cell === 'O' ? 'board__cell--o' : ''}`}
            onClick={() => onClick(index)}
            disabled={!!cell || gameOver || !isMyTurn}
          >
            {cell && (
              <span className={`board__mark board__mark--${cell}`}>
                {cell === 'X' ? '✕' : '○'}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
