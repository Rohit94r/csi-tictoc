import { useEffect } from 'react';
import './WinLoss.css';
import { playLoseSound, playWinSound } from '../utils/sounds';

const CONFETTI = ['★', '✦', '✧', '•', '◆', '○', '◇', '□'];

export default function WinLoss({ result, playerSymbol, onPlayAgain, onClose }) {
  const isWinner = result.winner === playerSymbol;
  const isDraw = result.winner === null;
  const isLoser = !isWinner && !isDraw;

  useEffect(() => {
    if (isLoser) playLoseSound();
    else if (isWinner) playWinSound();
  }, [isLoser, isWinner]);

  return (
    <div className="wl-overlay" onClick={onClose}>
      <div className="wl-confetti-container">
        {(isDraw || isWinner) &&
          CONFETTI.map((emoji, i) => (
            <span
              key={i}
              className="wl-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                fontSize: `${14 + Math.random() * 20}px`,
                color: '#fff',
              }}
            >
              {emoji}
            </span>
          ))}
      </div>

      <div className="wl-card" onClick={(e) => e.stopPropagation()}>
        {isDraw ? (
          <>
            <div className="wl-emoji">=</div>
            <h2 className="wl-title">It's a Tie</h2>
            <p className="wl-message">Great minds think alike.</p>
          </>
        ) : isWinner ? (
          <>
            <div className="wl-emoji">★</div>
            <h2 className="wl-title">You Won</h2>
            <p className="wl-message">Nice work. Play another round?</p>
            <div className="wl-reward">
              <span className="wl-reward-text">Victory</span>
            </div>
          </>
        ) : (
          <>
            <div className="wl-lose-wrap">
              <img src="/image.png" alt="You Lost" className="wl-lose-img" />
            </div>
            <h2 className="wl-title">You Lost</h2>
            <p className="wl-message">Better luck next time.</p>
          </>
        )}

        <button className="wl-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
