import { useState, useMemo } from 'react';
import questionsData from './data/questions.json';
import type { Question, GameMode } from './types';
import { generateQuizOptions, shuffle } from './utils/gameLogic';
import './App.css';

function App() {
  const [mode, setMode] = useState<'MENU' | 'RESULTS' | GameMode>('MENU');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  // Generate new set of 25 random questions each time mode changes to QUIZ
  const questions: Question[] = useMemo(() => {
    if (mode === 'QUIZ') {
      const allQuestions = [...questionsData] as Question[];
      const shuffled = shuffle(allQuestions);
      return shuffled.slice(0, 25);
    }
    return [];
  }, [mode]);

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
      setMode('RESULTS');
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
    setMode('MENU');
  };

  if (mode === 'MENU') {
    return (
      <div className="container menu-screen">
        <button className="start-btn" onClick={() => setMode('QUIZ')}>
          Начать тест
        </button>
      </div>
    );
  }

  if (mode === 'RESULTS') {
    const percentage = (score / questions.length) * 100;
    const isPassed = percentage >= 60;

    return (
      <div className="container results-screen">
        <div className="results-card">
          <h1>{isPassed ? '🎉' : '😔'}</h1>
          <div className="result-message">
            {isPassed ? 'Че дохуя умный?' : 'Поздравляю ты тупой'}
          </div>
          <div className="score-display">
            <div className="score-big">{score} / {questions.length}</div>
            <div className="score-percentage">{percentage.toFixed(0)}%</div>
          </div>
          <div className="results-actions">
            <button className="next-btn" onClick={restartQuiz}>
              Вернуться в меню
            </button>
          </div>
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
