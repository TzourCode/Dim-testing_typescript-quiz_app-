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
  const [continueGame, setContinueGame] = useState<boolean>(false)
  const [hideNameInput, setHideNameInput] = useState<boolean>(true)
  const [pickedCategories, setPickedCategories] = useState<string[]>([])
  const [chosenCategory, setChosenCategory] = useState<string>('')
  const [pickedDifficulty, setPickedDifficulty] = useState<string>('')
  const [chosenDifficulty, setChosenDifficulty] = useState<string>('')
  const [rightAnswers, setRightAnswers] = useState<string[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([])
  const [mixedAnswers, setMixedAnswers] = useState<string[]>([])

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

  useEffect(() => {
    fetch(
      `https://the-trivia-api.com/api/questions?limit=1&categories=${chosenCategory}&difficulty=${chosenDifficulty}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResult(data)
        setMixedAnswers([
          ...data[0].incorrectAnswers,
          data[0].correctAnswer,
        ])
        console.log(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [chosenCategory, chosenDifficulty, rightAnswers, wrongAnswers])

  const mixUpAnswers = () => {
    const shuffledAnswers = mixedAnswers.sort(() => 0.5 - Math.random())
    setMixedAnswers(shuffledAnswers.slice(0, 4))
    // setMixedAnswers(mixedAnswers)
    setContinueGame(true)
    setContinueGameFromOptions(false)
  }
  const handlePickCategories = () => {
    const shuffledCategories = categories.sort(() => 0.5 - Math.random())
    const pickedCategories = shuffledCategories.slice(0, 3)
    setPickedCategories(pickedCategories)
  }

  const handleChoseCategory = (category: string) => {
    setChosenCategory(category)
  }

  const handlePickedDifficulty = () => {
    const shuffledDifficulties = difficulty.sort(() => 0.5 - Math.random())
    const pickedDifficulty = shuffledDifficulties.slice(0, 1).toString()
    setPickedDifficulty(pickedDifficulty)
    // setContinueGame(false)
  }

  const handleChosenDifficulty = (difficulty: string) => {
    setChosenDifficulty(difficulty)
    // setContinueGame(false)
  }
  const handleClick = (answer: string) => {
    if (answer === result[0].correctAnswer) {
      setRightAnswers([...rightAnswers, answer])
      // alert('Correct!')
    } else {
      setWrongAnswers([...wrongAnswers, answer])
      alert('Incorrect!')
    }
    mixUpAnswers()
  }
  return (
    <div className="App">
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
              <button onClick={handlePickedDifficulty}>
                Random Difficulty
              </button>
              <br />
              <p>------------------------</p>
              <button onClick={mixUpAnswers}>Click me to continue!</button>
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
          {mixedAnswers.map((answer) => (
            <>
              <br />
              <button
                onClick={() => {
                  handleClick(answer)
                }}
              >
                {answer}
              </button>
            </>
          ))}
          <div style={{ marginTop: '100px' }}>
            <p>----------------------------------------------------</p>
            <p style={{ fontSize: '19px', fontWeight: 'bold' }}>
              Chosen category: {chosenCategory}
            </p>
            <p style={{ fontSize: '19px', fontWeight: 'bold' }}>
              Chosen difficulty: {chosenDifficulty}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
