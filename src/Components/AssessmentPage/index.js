import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import Results from '../Results'

class Assessment extends Component {
  state = {
    questions: [],
    currentQuestionIndex: 0,
    answeredQuestions: 0,
    unansweredQuestions: 10,
    score: 0,
    timeLeft: 600, // Adjust time limit as needed
    answers: {},
    assessmentComplete: false,
    timeUp: false,
    apiStatusSuccess: true,
    selectedOptionId: '',
  }

  componentDidMount() {
    this.fetchQuestions()
    this.intervalId = setInterval(this.countDown, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  countDown = () => {
    this.setState(prevState => {
      if (prevState.timeLeft > 0) {
        return {timeLeft: prevState.timeLeft - 1}
      }
      clearInterval(this.intervalId)
      this.setState({assessmentComplete: true, timeUp: true})
      this.history.replace('/results')
      return {timeLeft: 0}
    })
  }

  fetchQuestions = async () => {
    const url = 'https://apis.ccbp.in/assess/questions'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        const answers = {}
        data.questions.forEach(e => {
          e.options.forEach(a => {
            if (a.is_correct === 'true') {
              answers[a.id] = a.is_correct
            }
          })
        })
        this.setState({
          questions: data.questions,
          unansweredQuestions: data.questions.length,
          answers,
        })
      } else {
        this.setState({apiStatusSuccess: false})
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      // Handle error appropriately (e.g., display an error message)
    }
  }

  handleOptionClick = (
    questionId,
    isCorrect,
    optionId,
    isSelectQuestion = false,
  ) => {
    const {answers} = this.state
    let option
    if (isSelectQuestion && optionId) {
      option = optionId.id
    }
    console.log(1, optionId, option)

    if (isSelectQuestion && !option) {
      return
    }
    console.log(2, optionId, option)
    if (!answers[questionId]) {
      this.setState(prevState => ({
        answers: {...prevState.answers, [questionId]: isCorrect},
        answeredQuestions: prevState.answeredQuestions + 1,
        unansweredQuestions: prevState.unansweredQuestions - 1,
        score: isCorrect === 'true' ? prevState.score + 1 : prevState.score,
        selectedOptionId: isSelectQuestion ? option : optionId,
      }))
    }
  }

  handleNextQuestion = () => {
    this.setState(prevState => {
      const nextIndex = prevState.currentQuestionIndex + 1
      if (nextIndex < prevState.questions.length) {
        return {currentQuestionIndex: nextIndex}
      }
      return null
    })
  }

  handlePreviousQuestion = () => {
    this.setState(prevState => {
      const prevIndex = prevState.currentQuestionIndex - 1
      if (prevIndex >= 0) {
        return {currentQuestionIndex: prevIndex}
      }
      return null
    })
  }

  handleSubmit = () => {
    clearInterval(this.intervalId)
    this.setState({assessmentComplete: true, timeUp: false})
  }

  onClickReattempt = () =>
    this.setState(
      {
        questions: [],
        currentQuestionIndex: 0,
        answeredQuestions: 0,
        unansweredQuestions: 10,
        score: 0,
        timeLeft: 6, // Adjust time limit as needed
        answers: {},
        assessmentComplete: false,
        timeUp: false,
        selectedOptionId: '',
      },
      this.componentDidMount,
    )

  render() {
    const {
      questions,
      currentQuestionIndex,
      timeLeft,
      answeredQuestions,
      unansweredQuestions,
      score,
      assessmentComplete,
      timeUp,
      answers,
      apiStatusSuccess,
      selectedOptionId,
    } = this.state
    const currentQuestion = questions[currentQuestionIndex]
    const questionNumber = currentQuestionIndex
    const jwtToken = Cookies.get('jwt_token')
    const total = questions.length
    const selectDefaultLabel = 'select an answer'
    console.log(answers)

    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    if (questions.length === 0) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
        </div>
      )
    }

    const formattedTimeLeft = `${Math.floor(timeLeft / 3600)
      .toString()
      .padStart(2, '0')}:${Math.floor((timeLeft % 3600) / 60)
      .toString()
      .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`

    if (assessmentComplete) {
      return (
        <Results
          timeTaken={600 - timeLeft}
          score={score}
          timeUp={timeUp}
          onClickReattempt={this.onClickReattempt}
        />
      )
    }

    return (
      <>
        <Header />
        {apiStatusSuccess ? (
          <div className="assessment-page">
            <div className="question-card">
              <li className="question-text">
                <p>
                  {questionNumber + 1}. {currentQuestion.question_text}
                </p>
              </li>
              <div className="answer-options">
                <ul className="single-select-options-container">
                  {currentQuestion.options_type === 'SINGLE_SELECT' && (
                    <select
                      key={currentQuestion.id}
                      onChange={event =>
                        this.handleOptionClick(
                          currentQuestion.id,
                          event.target.value,
                          currentQuestion.options.find(
                            e =>
                              e.text === event.target.selectedOptions[0].label,
                          ),
                          true,
                        )
                      }
                      className="single-select-options"
                    >
                      <option>{selectDefaultLabel}</option>
                      {currentQuestion.options.map(option => (
                        <option
                          key={option.id}
                          className="select-option"
                          value={option.is_correct}
                        >
                          {option.text}
                        </option>
                      ))}
                    </select>
                  )}
                </ul>
                <ul className="default-options">
                  {currentQuestion.options_type === 'DEFAULT' &&
                    currentQuestion.options.map(option => (
                      <li
                        key={option.id}
                        className={`default-option ${
                          selectedOptionId === option.id ? 'checked' : ''
                        }`}
                        onClick={() =>
                          this.handleOptionClick(
                            currentQuestion.id,
                            option.is_correct,
                            option.id,
                          )
                        }
                      >
                        <button
                          type="button"
                          className={`default-option ${
                            selectedOptionId === option.id ? 'checked' : ''
                          }`}
                        >
                          {option.text}
                        </button>
                      </li>
                    ))}
                </ul>
                <ul className="image-options">
                  {currentQuestion.options_type === 'IMAGE' &&
                    currentQuestion.options.map(option => (
                      <li
                        key={option.id}
                        className={`image-Option ${
                          selectedOptionId === option.id
                            ? 'image-option-checked'
                            : ''
                        }`}
                        onClick={() =>
                          this.handleOptionClick(
                            currentQuestion.id,
                            option.is_correct,
                            option.id,
                          )
                        }
                      >
                        <img
                          className="image-option-img"
                          src={option.image_url}
                          alt={option.text}
                        />
                      </li>
                    ))}
                </ul>
              </div>
              <div className="navigationButtons">
                {currentQuestionIndex > 0 && (
                  <button
                    className="previous-btn"
                    type="button"
                    onClick={this.handlePreviousQuestion}
                  >
                    Previous Question
                  </button>
                )}
                {currentQuestionIndex < questions.length - 1 && (
                  <button
                    type="button"
                    className="next-question-btn"
                    onClick={this.handleNextQuestion}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
            <div className="assessmentSidebar">
              <div className="timer-banner">
                <div className="timer-container">
                  <p className="timer">Time Left</p>
                  <p className="time">{formattedTimeLeft}</p>
                </div>
              </div>
              <div className="answered-update-card">
                <div className="answered-and-answered-count">
                  <div className="answered-count-container">
                    <p className="answered-count">{answeredQuestions}</p>
                    <p>Answered Questions</p>
                  </div>
                  <div className="unanswered-count-container">
                    <p className="unanswered-count">{unansweredQuestions}</p>
                    <p>Unanswered Questions</p>
                  </div>
                </div>
                <hr className="line" />
                <h1>Questions ({total})</h1>
                <div className="question-list">
                  {questions.map((question, index) => (
                    <button
                      type="button"
                      key={question.id}
                      className={`questionButton ${
                        index === currentQuestionIndex ? 'active' : ''
                      }`}
                      onClick={() =>
                        this.setState({currentQuestionIndex: index})
                      }
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="submit-assessment-btn"
                  onClick={this.handleSubmit}
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="failure-container">
            <img
              src="https://res.cloudinary.com/djhvryb5m/image/upload/v1721232814/Group_7519_i5szmf.png"
              alt="failure img"
              className="failure-image"
            />
            <h1>Oops! Something went wrong</h1>
            <p>we are having some trouble</p>
            <button type="button">Retry</button>
          </div>
        )}
      </>
    )
  }
}

export default Assessment

