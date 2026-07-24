import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Home from './components/Home';
import Game from './components/Game';

const socket = io('http://localhost:3001');

export default function App() {
  const [screen, setScreen] = useState('home');
  const [clubCode, setClubCode] = useState('');
  const [playerSymbol, setPlayerSymbol] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('roomCreated', ({ code, symbol }) => {
      setClubCode(code);
      setPlayerSymbol(symbol);
      setScreen('game');
      setError('');
    });

    socket.on('roomJoined', ({ code, symbol }) => {
      setClubCode(code);
      setPlayerSymbol(symbol);
      setScreen('game');
      setError('');
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    socket.on('playerDisconnected', ({ message }) => {
      setError(message);
      setTimeout(() => {
        setScreen('home');
        setClubCode('');
        setPlayerSymbol('');
      }, 2500);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('error');
      socket.off('playerDisconnected');
    };
  }, []);

  const createClub = () => {
    socket.emit('createRoom');
  };

  const joinClub = (code) => {
    if (code.length !== 6) {
      setError('Club code must be 6 characters!');
      return;
    }
    socket.emit('joinRoom', code.toUpperCase());
  };

  const leaveClub = () => {
    socket.emit('disconnect');
    setScreen('home');
    setClubCode('');
    setPlayerSymbol('');
    setError('');
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <Home
          onCreateClub={createClub}
          onJoinClub={joinClub}
          error={error}
          onClearError={() => setError('')}
        />
      )}
      {screen === 'game' && (
        <Game
          socket={socket}
          clubCode={clubCode}
          playerSymbol={playerSymbol}
          onLeave={leaveClub}
        />
      )}
    </div>
  );
}
