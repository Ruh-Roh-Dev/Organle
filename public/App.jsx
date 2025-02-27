import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [guess, setGuess] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [correctOrgan, setCorrectOrgan] = useState(null);
  const [blurred, setBlurred] = useState(false);
  const [remainingGuesses, setRemainingGuesses] = useState(8);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (guess.length > 1) {
        const response = await fetch(`http://localhost:5000/api/suggestions?query=${guess}`);
        const data = await response.json();
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [guess]);

  useEffect(() => {
    if (remainingGuesses <= 0) {
      fetch('http://localhost:5000/api/todays-organ')
        .then((response) => response.json())
        .then((data) => setCorrectOrgan(data.organ))
        .catch((error) => console.error('Error fetching correct organ:', error));
    }
  }, [remainingGuesses]);

  const handleGuess = (organName) => {
    if (guess === organName || remainingGuesses <= 0) return;

    setGuess(organName);
    setSuggestions([]);

    fetch('http://localhost:5000/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: organName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGuesses((prevGuesses) => [
          {
            name: organName,
            size: data.size,
            distance: data.distance ? Number(data.distance).toFixed(1) : "N/A",
            type: data.type,
            sizeTileColor: data.sizeTileColor,
            distanceTileColor: data.distanceTileColor,
            typeTileColor: data.typeTileColor,
            sizeArrow: data.sizeArrow,
            distanceArrow: data.distanceArrow,
          },
          ...prevGuesses,
        ]);

        if (data.message === 'Correct!') {
          setCorrectOrgan(organName);
          setBlurred(true);
        }

        setRemainingGuesses((prev) => prev - 1);
      })
      .catch((error) => console.error('Error submitting guess:', error));
  };

  const handleClose = () => {
    setBlurred(false);
  };

  const isGameOver = remainingGuesses <= 0 || correctOrgan;

  return (
    <div className="game-container">
      {blurred && <div className="blur-overlay" onClick={handleClose}></div>}

      <div className={blurred ? 'blurred' : ''}>
        <div className="header">
          <h1>Organle</h1>
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>☰</button>
        </div>

        {showMenu && (
          <div className="menu">
            <h2>How to Play</h2>
            <p>Guess the correct organ by typing its name. You will get feedback on size, distance, and type. The size and distance will be yellow when within 5 cm.</p>
            <button className="button" onClick={() => setShowMenu(false)}>Close</button>
          </div>
        )}

        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Start typing an organ..."
          disabled={isGameOver}
        />

        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleGuess(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>

        <div className="guess-container">
          {guesses.map((guess, index) => (
            <div key={index} className="guess-tile">
              <div className="guess-name">{guess.name}</div>
              <div className="tile-container">
                <div className={`tile ${guess.sizeTileColor}`}>
                  <div className="tile-header">Size</div>
                  <div className="tile-body">{guess.size} cm</div>
                </div>
                <div className={`tile ${guess.distanceTileColor}`}>
                  <div className="tile-header">Distance</div>
                  <div className="tile-body">{guess.distance} cm</div>
                </div>
                <div className={`tile ${guess.typeTileColor}`}>
                  <div className="tile-header">Type</div>
                  <div className="tile-body">{guess.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="remaining-guesses">
          <p>Remaining guesses: {remainingGuesses}</p>
        </div>
      </div>

      {isGameOver && correctOrgan && (
        <div className="correct-message">
          <h2>Today's organ is: {correctOrgan}</h2>
          <button className="close-button" onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
