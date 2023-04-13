import React, { useState, useEffect } from 'react'
import './App.css'

type resultProps = {
  id: string
  question: string
  category: string
  difficulty: string
  correctAnswer: string
  incorrectAnswers: string[]
}
const categories = [
  'arts_and_literature',
  'film_and_tv',
  'food_and_drink',
  'general_knowledge',
  'geography',
  'history',
  'music',
  'science',
  'society_and_culture',
  'sport_and_leisure',
]

const difficulty = ['easy', 'medium', 'hard']

export default function App() {
  const [result, setResult] = useState<resultProps[]>([])
  const [playerName, setPlayerName] = useState<string>('')
  const [continueGameFromOptions, setContinueGameFromOptions] =
    useState<boolean>(false)
  const [chooseCategoryIfRight, setChooseCategoryIfRight] =
    useState<boolean>(false)
  const [continueGame, setContinueGame] = useState<boolean>(false)
  const [hideNameInput, setHideNameInput] = useState<boolean>(true)
  const [pickedCategories, setPickedCategories] = useState<string[]>([])
  const [chosenCategory, setChosenCategory] = useState<string>('')
  const [pickedDifficulty, setPickedDifficulty] = useState<string>('')
  const [randomButtonClicked, setRandomButtonClicked] =
    useState<boolean>(false)
  const [chosenDifficulty, setChosenDifficulty] = useState<string>('')
  const [rightAnswers, setRightAnswers] = useState<string[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([])
  const [mixedAnswers, setMixedAnswers] = useState<string[]>([])
  const [count, setCount] = useState<number>(0)
  const [finishedGame, setFinishedGame] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(50)
  const [clickMeToContinue, setClickMeToContinue] =
    useState<boolean>(false)
  const [secDiffi, setSecDiffi] = useState<number>(0)
  const [ifRightAnswer, setIfRightAnswer] = useState<boolean>(false)

  function handlePlayerNameChange(event: {
    target: { value: React.SetStateAction<string> }
  }) {
    setPlayerName(event.target.value)
  }

  function continueQuiz() {
    if (typeof playerName === 'string' && playerName.length === 0) {
      alert('Please type your name to continue with the game!🕹')
    } else {
      setContinueGameFromOptions(true)
      setHideNameInput(false)
    }
  }

  function continueToQuestions() {
    setContinueGame(true)
    setContinueGameFromOptions(false)
    setClickMeToContinue(true)
  }

  async function fetchQuestion() {
    try {
      const response = await fetch(
        `https://the-trivia-api.com/api/questions?limit=1&categories=${chosenCategory}&difficulty=${
          chosenDifficulty + pickedDifficulty
        }`
      )
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      setResult(data)
      const answers = [...data[0].incorrectAnswers, data[0].correctAnswer]
      const mixedAnswers = shuffleArray(answers)
      setMixedAnswers(mixedAnswers)
      console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchQuestion()

    if (clickMeToContinue && !ifRightAnswer) {
      let timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
      }, 1000)
      if (ifRightAnswer) {
        clearInterval(timer)
      }
      return () => clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clickMeToContinue,
    chosenCategory,
    chosenDifficulty,
    pickedDifficulty,
    rightAnswers,
    wrongAnswers,
    ifRightAnswer,
  ])

  useEffect(() => {
    if (randomButtonClicked === true && timeLeft === 0) {
      fetchQuestion()
      setTimeLeft(30)
      handlePickedDifficulty()
    } else if (timeLeft === 0 && clickMeToContinue) {
      setContinueGame(true)
      fetchQuestion()
      setTimeLeft(30)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  function shuffleArray(array: string[]) {
    const shuffledArray = array.sort(() => 0.5 - Math.random())
    return shuffledArray
  }

  function handlePickCategories() {
    const shuffledCategories = shuffleArray(categories)
    const pickedCategories = shuffledCategories.slice(0, 3)
    setPickedCategories(pickedCategories)
  }

  function handleChoseCategory(category: string) {
    setChosenCategory(category)
  }

  function handlePickedDifficulty() {
    if (chosenDifficulty) {
    } else {
      const shuffledDifficulties = shuffleArray(difficulty)
      const pickedDifficulty = shuffledDifficulties.slice(0, 1).toString()
      setPickedDifficulty(pickedDifficulty)
    }
  }

  function handleChosenDifficulty(difficulty: string) {
    setChosenDifficulty(difficulty)
  }

  function handleClick(answer: string) {
    setTimeLeft(30)
    if (answer === result[0].correctAnswer) {
      setRightAnswers([...rightAnswers, answer])
      setTimeLeft(3)
      setChooseCategoryIfRight(true)
      setContinueGame(false)
      setIfRightAnswer(true)
    } else {
      setWrongAnswers([...wrongAnswers, answer])
      setChooseCategoryIfRight(false)
    }
  }

  function handleGameRound() {
    setCount(count + 1)
    // Ändra till 8 sen brue
    if (count === 23) {
      setContinueGame(false)
      setFinishedGame(true)
      setClickMeToContinue(false)
    }
  }

  return (
    <div className="App">
      <p>Total: {secDiffi}</p>
      <p>{timeLeft}</p>
      {chooseCategoryIfRight && (
        <>
          <h2>Piiiiick one category:</h2>
          {pickedCategories.map((category) => (
            <>
              <ul key={category}>
                <button
                  key={category}
                  value={chosenCategory}
                  onClick={() => {
                    handleChoseCategory(category)
                    setChooseCategoryIfRight(false)
                    setIfRightAnswer(false)
                    setClickMeToContinue(true)
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
          <h3>Please type in your name to proceed.</h3>
          <label>
            Player name:
            <input
              type="text"
              value={playerName}
              onChange={handlePlayerNameChange}
            />
            <button
              onClick={() => {
                continueQuiz()
                handlePickCategories()
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
              {difficulty.map((difficulty) => (
                <>
                  <ul key={difficulty}>
                    <button
                      key={difficulty}
                      value={chosenDifficulty}
                      onClick={() => handleChosenDifficulty(difficulty)}
                    >
                      {difficulty}
                    </button>
                  </ul>
                </>
              ))}
              <button
                onClick={() => {
                  handlePickedDifficulty()
                  setRandomButtonClicked(true)
                }}
              >
                Random Difficulty
              </button>
              <br />
              <p>------------------------</p>
              <button
                onClick={() => {
                  continueToQuestions()
                  setChooseCategoryIfRight(false)
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
          <h3>Question</h3>
          <p>{result[0].question}</p>
          <p>{result[0].correctAnswer}</p>
          <h3>Answers:</h3>
          {mixedAnswers.map((answer, index) => (
            <>
              <br />
              <button
                key={index}
                onClick={() => {
                  handleClick(answer)
                  handlePickedDifficulty()
                  handleGameRound()
                }}
              >
                {answer}
              </button>
            </>
          ))}
          <p>Game Round: {count}</p>
          <div style={{ marginTop: '100px' }}>
            <p>----------------------------------------------------</p>
            <p style={{ fontSize: '19px', fontWeight: 'bold' }}>
              Chosen category: {chosenCategory}
            </p>
            <p style={{ fontSize: '19px', fontWeight: 'bold' }}>
              Chosen difficulty: {chosenDifficulty}, {pickedDifficulty}
            </p>
          </div>
        </div>
      )}
      {finishedGame && (
        <>
          <h1>You finished the game!</h1>
          <h3>Heres your results:</h3>
          <p>You had {rightAnswers.length} right answer!</p>
          <p>You had {wrongAnswers.length} wrong answers!</p>
        </>
      )}
    </div>
  )
}
