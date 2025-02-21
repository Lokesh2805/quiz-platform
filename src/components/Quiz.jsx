import React, { useState, useEffect } from "react";
import { saveAttempt, getAttempts } from "../utils/indexedDB";
import questions from "../assets/data/questions";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(30);
  const [history, setHistory] = useState([]);
  const [userInput, setUserInput] = useState(""); // State for integer answers

  useEffect(() => {
    if (timer === 0) {
      nextQuestion();
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const attempts = await getAttempts();
    setHistory(attempts);
  };

  const handleAnswerClick = (index) => {
    if (questions[currentQuestion].type === "mcq") {
      if (index === questions[currentQuestion].correct) {
        setScore(score + 1);
        alert("Correct!");
      } else {
        alert("Wrong answer!");
      }
    }
    nextQuestion();
  };

  const handleIntegerSubmit = () => {
    const correctAnswer = questions[currentQuestion].correct;
    if (parseInt(userInput) === correctAnswer) {
      setScore(score + 1);
      alert("Correct!");
    } else {
      alert("Wrong answer! ");
    }
    setUserInput(""); // Reset input field
    nextQuestion();
  };

  const nextQuestion = async () => {
    const nextQuestionIndex = currentQuestion + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestion(nextQuestionIndex);
      setTimer(30);
    } else {
      setShowScore(true);
      await saveAttempt(score, questions.length);
      loadHistory();
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
      {showScore ? (
        <div className="text-center">
          <h2 className="text-xl font-bold">Quiz Completed!</h2>
          <p>Your score: {score}/{questions.length}</p>

          <h3 className="text-lg mt-4">Previous Attempts</h3>
          <ul className="text-left mt-2">
            {history.map((attempt, index) => (
              <li key={index} className="text-sm border p-2 my-1">
                {attempt.timestamp} - Score: {attempt.score}/{attempt.totalQuestions}
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Retry Quiz
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">{questions[currentQuestion].question}</h2>
            <span className="text-red-500 font-bold">⏳ {timer}s</span>
          </div>
          <div className="space-y-2">
            {questions[currentQuestion].type === "mcq" ? (
              questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="block w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => handleAnswerClick(index)}
                >
                  {option}
                </button>
              ))
            ) : (
              <div>
                <input
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter your answer"
                />
                <button
                  className="mt-3 w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                  onClick={handleIntegerSubmit}
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
