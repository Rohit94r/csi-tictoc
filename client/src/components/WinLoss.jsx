import './WinLoss.css';

const CONFETTI = ['🎉', '🎊', '✨', '💫', '🌟', '⭐', '🔥', '💥', '🎯', '🏆', '💎', '👑'];
const LOSE_CHAOS = ['💀', '🔥', '⚡', '💥', '😱', '☠️', '💢', '🥀', '😭', '🌀', '❗', '‼️'];

export default function WinLoss({ result, playerSymbol, onPlayAgain, onClose }) {
  const isWinner = result.winner === playerSymbol;
  const isDraw = result.winner === null;
  const isLoser = !isWinner && !isDraw;

  return (
    <div className={`wl-overlay ${isLoser ? 'wl-overlay--lose' : ''}`} onClick={onClose}>
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
                fontSize: `${18 + Math.random() * 28}px`,
              }}
            >
              {emoji}
            </span>
          ))}
        {isLoser &&
          LOSE_CHAOS.map((emoji, i) => (
            <span
              key={`lose-${i}`}
              className="wl-confetti wl-confetti--lose"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
                fontSize: `${22 + Math.random() * 30}px`,
              }}
            >
              {emoji}
            </span>
          ))}
      </div>

      <div className={`wl-card ${isLoser ? 'wl-card--lose' : ''}`} onClick={(e) => e.stopPropagation()}>
        {isDraw ? (
          <>
            <div className="wl-emoji">🤝</div>
            <h2 className="wl-title wl-title--draw">It's a Tie!</h2>
            <p className="wl-message">Great minds think alike!</p>
          </>
        ) : isWinner ? (
          <>
            <div className="wl-emoji wl-emoji--win">👑</div>
            <h2 className="wl-title wl-title--win">You're the Champion!</h2>
            <p className="wl-message">Crowned with glory! Take your victory lap!</p>
            <div className="wl-reward">
              <span className="wl-reward-trophy">🏆</span>
              <span className="wl-reward-text">You earned it!</span>
            </div>
          </>
        ) : (
          <>
            <div className="wl-lose-chaos">
              <div className="wl-lose-flash" />
              <div className="wl-lose-rings">
                <span />
                <span />
                <span />
              </div>
              <img
                src="/image.png"
                alt="You Lost"
                className="wl-lose-img"
              />
              <div className="wl-lose-glitch" aria-hidden="true">
                <img src="/image.png" alt="" />
                <img src="/image.png" alt="" />
              </div>
            </div>
            <h2 className="wl-title wl-title--lose wl-title--crazy">YOU LOST!!!</h2>
            <p className="wl-message wl-message--crazy">Chai Baba says… better luck next time 🔥</p>
          </>
        )}

        <button className="wl-btn" onClick={onPlayAgain}>
          Play Again 🔄
        </button>
      </div>
    </div>
  );
}
