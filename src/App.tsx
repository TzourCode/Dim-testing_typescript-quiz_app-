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
  const [timeLeft, setTimeLeft] = useState<number>(5)
  const [clickMeToContinue, setClickMeToContinue] =
    useState<boolean>(false)
  const [ifRightAnswer, setIfRightAnswer] = useState<boolean>(false)
  const [calcSec, setCalcSec] = useState<number>(0)
  const [totalSecDiffi, setTotalSecDiffi] = useState<number>(0)
  const [totalSecDiffiQuestion, setTotalSecDiffiQuestion] =
    useState<number>(0)
  const [rightGuesses, setRightGuesses] = useState<number>(0)

  /*behövs inte ta bort sen*/ const [d, setd] = useState<string>('')

  function handlePlayerNameChange(event: {
    target: { value: React.SetStateAction<string> }
  }) {
    setPlayerName(event.target.value)
  }

  function continueQuiz() {
    setContinueGameFromOptions(true)
    setHideNameInput(false)
  }

  function continueToQuestions() {
    setContinueGame(true)
    setContinueGameFromOptions(false)
    setClickMeToContinue(true)
    // fetchQuestion()
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
      handlePickedDifficulty()
      setd(data[0].difficulty)
      console.log('2:', data[0].difficulty)
      console.log('3:', pickedDifficulty)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchQuestion()
  }, [])

  useEffect(() => {
    // fetchQuestion()
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
    if (timeLeft === 0 && randomButtonClicked && !chooseCategoryIfRight) {
      calcSecLeft()
      setContinueGame(true)
      handleGameRound()
      setTimeLeft(5)
      fetchQuestion()
      // alert('0')
    } else if (
      timeLeft === 0 &&
      randomButtonClicked &&
      chooseCategoryIfRight
    ) {
      // calcSecLeft()
      setContinueGame(true)
      handleGameRound()
      setTimeLeft(5)
      fetchQuestion()
      setChooseCategoryIfRight(false)
      // alert('0')
    } else if (timeLeft === 0 && !chooseCategoryIfRight) {
      fetchQuestion()
      setContinueGame(true)
      handleGameRound()
      setTimeLeft(5)
      calcSecLeft()
      // alert('1')
    } else if (timeLeft === 0 && chooseCategoryIfRight) {
      fetchQuestion()
      setContinueGame(true)
      handleGameRound()
      setTimeLeft(5)
      setChooseCategoryIfRight(false)
      // calcSecLeft()
      // alert('2')
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
      // setPickedDifficulty('')
    } else {
      const shuffledArray = shuffleArray(difficulty)
      setPickedDifficulty(shuffledArray[0])
    }
  }

  function handleChosenDifficulty(difficulty: string) {
    setChosenDifficulty(difficulty)
    setPickedDifficulty('')
  }

  function handleClick(answer: string) {
    if (answer === result[0].correctAnswer) {
      setRightAnswers([...rightAnswers, answer])
      // setTimeLeft(5)
      setClickMeToContinue(false)
      setChooseCategoryIfRight(true)
      setContinueGame(false)
      setIfRightAnswer(true)
      handlePickCategories()
      shuffleArray(pickedCategories)
      setRightGuesses(rightGuesses + 1)
    } else {
      setWrongAnswers([...wrongAnswers, answer])
      setChooseCategoryIfRight(false)
      fetchQuestion()
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

  function calcSecLeft() {
    let totalSec = 5 - timeLeft
    setCalcSec(totalSec)
    if (chosenDifficulty === 'easy' || pickedDifficulty === 'easy') {
      setTotalSecDiffi(calcSec * 1)
      setTotalSecDiffiQuestion(totalSecDiffiQuestion + totalSecDiffi)
      /*Plussa på med rightguesses också */
    } else if (
      chosenDifficulty === 'medium' ||
      pickedDifficulty === 'medium'
    ) {
      setTotalSecDiffi(calcSec * 3)
      setTotalSecDiffiQuestion(totalSecDiffiQuestion + totalSecDiffi)
    } else if (
      chosenDifficulty === 'hard' ||
      pickedDifficulty === 'hard'
    ) {
      setTotalSecDiffi(calcSec * 5)
      setTotalSecDiffiQuestion(totalSecDiffiQuestion + totalSecDiffi)
    }
  }

  useEffect(() => {
    calcSecLeft()
  }, [calcSec])
  return (
    <div className="App">
      <p>R: {rightGuesses}</p>
      <p>Pi: {pickedDifficulty}</p>
      <p>D: {d}</p>
      <p>choseDiffi: {chosenDifficulty}</p>
      <p>Randombuttonclick: {randomButtonClicked.toString()}</p>
      <p>ChooseCategoryIfRight: {chooseCategoryIfRight.toString()}</p>
      <p>Total sekunder * svårighetsgrad: {totalSecDiffiQuestion}</p>
      <p>TimeLeft: {timeLeft}</p>
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
                    // setChooseCategoryIfRight(false)
                    setIfRightAnswer(false)
                    setClickMeToContinue(true)
                    setTimeLeft(1)
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
          <h3>Type in your name if you want!.</h3>
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
              <p>------------------------</p>
              <button
                onClick={() => {
                  continueToQuestions()
                  setChooseCategoryIfRight(false)
                  // fetchQuestion()
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
                  // handlePickedDifficulty()
                  handleGameRound()
                  setTimeLeft(5)
                  calcSecLeft()
                }}
              >
                {answer}
              </button>
            </>
          ))}
          <p>Game Round: {count}</p>
          <p style={{ fontSize: '19px', fontWeight: 'bold' }}>
            Chosen category: {chosenCategory}
          </p>
          <p style={{ fontSize: '19px', fontWeight: 'bold' }}>
            Chosen difficulty: {chosenDifficulty},<br />
            PickedDifficulty: {pickedDifficulty}
          </p>
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
