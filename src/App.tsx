import { useState, useMemo } from 'react';
import questionsData from './data/questions.json';
import type { Question, GameMode } from './types';
import { generateQuizOptions, shuffle } from './utils/gameLogic';
import './App.css';

function App() {
  const [mode, setMode] = useState<'MENU' | GameMode>('MENU');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  // Load and shuffle questions once
  const questions: Question[] = useMemo(() => {
    return shuffle(questionsData as Question[]);
  }, []);

  const currentQ = questions[currentQIndex];

  // Quiz Mode Logic
  const quizOptions = useMemo(() => {
    if (mode === 'QUIZ' && currentQ) {
      return generateQuizOptions(currentQ, questions);
    }
    return [];
  }, [currentQ, mode, questions]);

  const handleQuizAnswer = (selectedAns: string) => {
    if (showResult) return;
    const isCorrect = selectedAns === currentQ.answer;
    setFeedback(isCorrect ? 'CORRECT' : 'WRONG');
    setShowResult(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setFeedback(null);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setMode('MENU'); // or Game Over screen
      alert(`Game Over! Score: ${score}`);
      setCurrentQIndex(0);
      setScore(0);
    }
  };

  if (mode === 'MENU') {
    return (
      <div className="container menu-screen">
        <h1>🎓 Exam Prep</h1>
        <p className="subtitle">Master your questions with active recall.</p>

        <div className="mode-grid">
          <button className="mode-card" onClick={() => setMode('QUIZ')}>
            <span className="icon">❓</span>
            <h3>Quiz Mode</h3>
            <p>Select the correct definition among similarity distractors.</p>
          </button>

          {/* Fill Blank Coming Soon */}
          <button className="mode-card disabled" disabled>
            <span className="icon">✍️</span>
            <h3>Fill Blanks</h3>
            <p>Coming soon...</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container game-screen">
      <header>
        <button className="back-btn" onClick={() => setMode('MENU')}>✕ Exit</button>
        <div className="progress">Question {currentQIndex + 1} / {questions.length}</div>
        <div className="score">Score: {score}</div>
      </header>

      <main>
        <div className="question-card">
          <div className="ticket-badge">Билет №{currentQ.ticketNumber}</div>
          <h2>{currentQ.question}</h2>
        </div>

        <div className="options-grid">
          {quizOptions.map((opt, i) => {
            let className = "option-btn";
            if (showResult) {
              if (opt === currentQ.answer) className += " correct";
              else if (opt !== currentQ.answer) className += " wrong";
            }

            return (
              <button
                key={i}
                className={className}
                onClick={() => handleQuizAnswer(opt)}
                disabled={showResult}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </main>

      {showResult && (
        <div className="footer-controls">
          <div className={`feedback ${feedback}`}>{feedback === 'CORRECT' ? 'Correct!' : 'Incorrect'}</div>
          <button className="next-btn" onClick={nextQuestion}>Next Question →</button>
        </div>
      )}
    </div>
  );
}

export default App;
