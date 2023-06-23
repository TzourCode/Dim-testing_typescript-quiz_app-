import React, { useState, useEffect } from "react";
import "./App.css";
import config from "./config.json";

type resultProps = {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  correctAnswer: string;
  incorrectAnswers: string[];
};
const categories = [
  "arts_and_literature",
  "film_and_tv",
  "food_and_drink",
  "general_knowledge",
  "geography",
  "history",
  "music",
  "science",
  "society_and_culture",
  "sport_and_leisure",
];

const difficulty = ["easy", "medium", "hard"];

export default function App() {
  const [result, setResult] = useState<resultProps[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
  const [continueGameFromOptions, setContinueGameFromOptions] =
    useState<boolean>(false);
  const [chooseCategoryIfRight, setChooseCategoryIfRight] =
    useState<boolean>(false);
  const [continueGame, setContinueGame] = useState<boolean>(false);
  const [hideNameInput, setHideNameInput] = useState<boolean>(true);
  const [pickedCategories, setPickedCategories] = useState<string[]>([]);
  const [chosenCategory, setChosenCategory] = useState<string>("");
  const [pickedDifficulty, setPickedDifficulty] = useState<string>("");
  const [randomButtonClicked, setRandomButtonClicked] =
    useState<boolean>(false);
  const [rightAnswers, setRightAnswers] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [mixedAnswers, setMixedAnswers] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [finishedGame, setFinishedGame] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(config.timeLeft);
  const [clickMeToContinue, setClickMeToContinue] = useState<boolean>(false);
  const [ifRightAnswer, setIfRightAnswer] = useState<boolean>(false);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [finaleStreak, setFinaleStreak] = useState<number>(0);
  const [totalSecDiffiQuestion, setTotalSecDiffiQuestion] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [l, setL] = useState<string>("");

  function handlePlayerNameChange(event: {
    target: { value: React.SetStateAction<string> };
  }) {
    setPlayerName(event.target.value);
  }

  function continueQuiz() {
    setContinueGameFromOptions(true);
    setHideNameInput(false);
  }

  function continueToQuestions() {
    setContinueGame(true);
    setContinueGameFromOptions(false);
    setClickMeToContinue(true);
  }

  async function fetchQuestion() {
    try {
      const response = await fetch(
        `https://the-trivia-api.com/api/questions?limit=1&categories=${chosenCategory}&difficulty=${pickedDifficulty}`
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setResult(data);
      const answers = [...data[0].incorrectAnswers, data[0].correctAnswer];
      const mixedAnswers = shuffleArray(answers);
      setMixedAnswers(mixedAnswers);
      handleRandomDifficulty();
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(true);
      setHideNameInput(false);
      setL("Funkar ej, försök igen senare.");
    }
  }
  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clickMeToContinue && !ifRightAnswer) {
      let timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      if (ifRightAnswer) {
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clickMeToContinue,
    chosenCategory,
    pickedDifficulty,
    rightAnswers,
    wrongAnswers,
    ifRightAnswer,
  ]);

  useEffect(() => {
    if (timeLeft === 0 && randomButtonClicked && !chooseCategoryIfRight) {
      setContinueGame(true);
      handleGameRound();
      setTimeLeft(config.timeLeft);
      fetchQuestion();
    } else if (timeLeft === 0 && randomButtonClicked && chooseCategoryIfRight) {
      setContinueGame(true);
      setTimeLeft(config.timeLeft);
      fetchQuestion();
      setChooseCategoryIfRight(false);
    } else if (timeLeft === 0 && !chooseCategoryIfRight) {
      fetchQuestion();
      setContinueGame(true);
      handleGameRound();
      setTimeLeft(config.timeLeft);
    } else if (timeLeft === 0 && chooseCategoryIfRight) {
      fetchQuestion();
      setContinueGame(true);
      setTimeLeft(config.timeLeft);
      setChooseCategoryIfRight(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function shuffleArray(array: string[]) {
    const shuffledArray = array.sort(() => 0.5 - Math.random());
    return shuffledArray;
  }

  function handlePickCategories() {
    const shuffledCategories = shuffleArray(categories);
    const pickedCategories = shuffledCategories.slice(0, 3);
    setPickedCategories(pickedCategories);
  }

  function handleChoseCategory(category: string) {
    setChosenCategory(category);
  }

  function handleChosenDifficulty(item: string) {
    setPickedDifficulty(item);
  }

  function handleRandomDifficulty() {
    if (randomButtonClicked) {
      const shuffledArray = shuffleArray(difficulty);
      setPickedDifficulty(shuffledArray[0]);
    }
  }

  function handleClick(answer: string) {
    if (answer === result[0].correctAnswer) {
      setRightAnswers([...rightAnswers, answer]);
      setClickMeToContinue(false);
      setChooseCategoryIfRight(true);
      setContinueGame(false);
      setIfRightAnswer(true);
      handlePickCategories();
      shuffleArray(pickedCategories);
      setLongestStreak(longestStreak + 1);
    } else {
      setWrongAnswers([...wrongAnswers, answer]);
      setChooseCategoryIfRight(false);
      fetchQuestion();
      setLongestStreak(0);
    }
  }

  useEffect(() => {
    if (longestStreak >= 3) {
      setFinaleStreak(longestStreak);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishedGame, count]);

  function calcSecLeft() {
    if (pickedDifficulty === "easy") {
      setTotalSecDiffiQuestion(
        (prevTotalSecDiffiQuestion) =>
          prevTotalSecDiffiQuestion + timeLeft * config.easy
      );
    } else if (pickedDifficulty === "medium") {
      setTotalSecDiffiQuestion(
        (prevTotalSecDiffiQuestion) =>
          prevTotalSecDiffiQuestion + timeLeft * config.medium
      );
    } else if (pickedDifficulty === "hard") {
      setTotalSecDiffiQuestion(
        (prevTotalSecDiffiQuestion) =>
          prevTotalSecDiffiQuestion + timeLeft * config.hard
      );
    }
  }

  function handleGameRound() {
    setCount(count + 1);
    setTimeLeft(config.timeLeft);
    if (count === config.numberOfQuestions) {
      setContinueGame(false);
      setFinishedGame(true);
      setClickMeToContinue(false);
      setChooseCategoryIfRight(false);
    }
  }
  useEffect(() => {
    if (finaleStreak) {
      setTotalScore(totalSecDiffiQuestion + rightAnswers.length * finaleStreak);
    } else {
      setTotalScore(totalSecDiffiQuestion + rightAnswers.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishedGame]);

  function resetGame() {
    setHideNameInput(true);
    setFinishedGame(false);
    setPlayerName("");
    setCount(0);
    setTotalSecDiffiQuestion(0);
    setTotalScore(0);
    setWrongAnswers([]);
    setRightAnswers([]);
  }

  return (
    <div className="App">
      {chooseCategoryIfRight && (
        <>
          <p>TimeLeft: {timeLeft}</p>
          <h2>You picked the right answer!!</h2>
          <h2>Pick one category:</h2>
          {pickedCategories.map((category) => (
            <>
              <ul key={category}>
                <button
                  className="category-ifright"
                  key={category}
                  value={chosenCategory}
                  onClick={() => {
                    handleChoseCategory(category);
                    setIfRightAnswer(false);
                    setClickMeToContinue(true);
                    setTimeLeft(config.timeLeftCategory);
                  }}
                >
                  {category}
                </button>
              </ul>
            </>
          ))}
        </>
      )}
      {hideNameInput && (
        <>
          <h1>Welcome to quiz game!</h1>
          <h3>Type in your name if you want to, and lets start the game!.</h3>
          <label>
            Player name:
            <input
              type="text"
              value={playerName}
              onChange={handlePlayerNameChange}
            />
            <button
              className="but"
              onClick={() => {
                continueQuiz();
                handlePickCategories();
              }}
            >
              Click to proceed
            </button>
          </label>
        </>
      )}
      {continueGameFromOptions && (
        <div>
          <h1>Hello {playerName}!</h1>
          {pickedCategories.length > 0 && (
            <div>
              <h2>Pick one category:</h2>
              {pickedCategories.map((category) => (
                <>
                  <ul key={category}>
                    <button
                      className="category"
                      key={category}
                      value={chosenCategory}
                      onClick={() => handleChoseCategory(category)}
                    >
                      {category}
                    </button>
                  </ul>
                </>
              ))}
              <h2>Pick one difficulty:</h2>
              {difficulty.map((item) => (
                <>
                  <ul key={item}>
                    <button
                      key={item}
                      value={item}
                      onClick={() => handleChosenDifficulty(item)}
                    >
                      {item}
                    </button>
                  </ul>
                </>
              ))}
              <button
                onClick={() => {
                  setRandomButtonClicked(true);
                }}
              >
                Random Difficulty
              </button>
              <p>------------------------</p>
              <button
                onClick={() => {
                  continueToQuestions();
                  setChooseCategoryIfRight(false);
                  handleRandomDifficulty();
                }}
              >
                Click me to continue!
              </button>
            </div>
          )}
        </div>
      )}
      {continueGame && (
        <div>
          <p>Streaks: {finaleStreak}</p>
          <p>Game Round: {count}</p>
          <p>TimeLeft: {timeLeft}</p>
          <h3>Question</h3>
          <p>{result[0].question}</p>
          <h3>Answers:</h3>
          {mixedAnswers.map((answer, index) => (
            <>
              <br />
              <button
                className="answer"
                key={index}
                onClick={() => {
                  handleClick(answer);
                  handleGameRound();
                  calcSecLeft();
                }}
              >
                {answer}
              </button>
            </>
          ))}
          <p>--------------------------------------</p>
          <p>Picked Difficulty: {pickedDifficulty}</p>
        </div>
      )}
      {loading && <h1>Trivia: {l}</h1>}
      {finishedGame && (
        <>
          <h1>You finished the game!</h1>
          <h3>Heres your results:</h3>
          <p>You had {rightAnswers.length} right answer!</p>
          <p>You had {wrongAnswers.length} wrong answers!</p>
          <p>Totalscore: {totalScore}</p>
          <button
            onClick={() => {
              resetGame();
            }}
          >
            Wanna play a new game?
          </button>
        </>
      )}
    </div>
  );
}
