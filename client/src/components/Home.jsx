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
      <div className="home__bg-circle home__bg-circle--1" />
      <div className="home__bg-circle home__bg-circle--2" />
      <div className="home__bg-circle home__bg-circle--3" />

      <div className="home__container">
        <div className="home__logo">
          <span className="home__logo-icon">⏰</span>
          <h1 className="home__title">Tick Tock</h1>
          <p className="home__subtitle">Battle your friends in real-time!</p>
        </div>

        {error && (
          <div className="home__error" onClick={onClearError}>
            <span className="home__error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button className="home__btn home__btn--create" onClick={onCreateClub}>
          <span className="home__btn-icon">🎮</span>
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
            placeholder="Enter 6-digit Club Code"
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value.toUpperCase());
              onClearError();
            }}
          />
          <button className="home__btn home__btn--join" type="submit" disabled={joinCode.length !== 6}>
            <span className="home__btn-icon">🚀</span>
            <span className="home__btn-text">Join Club</span>
          </button>
        </form>

        <div className="home__players">
          <span className="home__player-icon home__player-icon--x">❌</span>
          <span className="home__vs">vs</span>
          <span className="home__player-icon home__player-icon--o">⭕</span>
        </div>
      </div>
    </div>
  );
}
