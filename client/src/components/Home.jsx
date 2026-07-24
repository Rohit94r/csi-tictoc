import { useState } from 'react';
import './Home.css';

export default function Home({ onCreateClub, onJoinClub, error, onClearError }) {
  const [joinCode, setJoinCode] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    onJoinClub(joinCode);
  };

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__logo">
          <h1 className="home__title">Tick Tock</h1>
          <p className="home__subtitle">Real-time multiplayer tic-tac-toe</p>
        </div>

        {error && (
          <div className="home__error" onClick={onClearError}>
            {error}
          </div>
        )}

        <button className="home__btn home__btn--create" onClick={onCreateClub}>
          <span className="home__btn-text">Create Club</span>
          <span className="home__btn-desc">Get a code to share</span>
        </button>

        <div className="home__divider">
          <span className="home__divider-line" />
          <span className="home__divider-text">OR</span>
          <span className="home__divider-line" />
        </div>

        <form className="home__join" onSubmit={handleJoin}>
          <input
            className="home__input"
            type="text"
            maxLength={6}
            placeholder="Enter club code"
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value.toUpperCase());
              onClearError();
            }}
          />
          <button
            className="home__btn home__btn--join"
            type="submit"
            disabled={joinCode.length !== 6}
          >
            <span className="home__btn-text">Join Club</span>
          </button>
        </form>

        <div className="home__players">
          <span>X</span>
          <span className="home__vs">vs</span>
          <span>O</span>
        </div>
      </div>
    </div>
  );
}
