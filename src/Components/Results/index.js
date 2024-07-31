import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const Results = props => {
  const {timeTaken, score, onClickReattempt, timeUp} = props

  const formattedTimeTaken = `${Math.floor(timeTaken / 3600)
    .toString()
    .padStart(2, '0')}:${Math.floor((timeTaken % 3600) / 60)
    .toString()
    .padStart(2, '0')}:${(timeTaken % 60).toString().padStart(2, '0')}`

  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="assessment-result-container">
        <div className="assessment-result">
          {timeUp ? (
            <img
              src="https://res.cloudinary.com/djhvryb5m/image/upload/v1721387735/calender_1_1_efxufg.png"
              alt="time up"
              className="timeUp-image"
            />
          ) : (
            <img
              src="https://res.cloudinary.com/djhvryb5m/image/upload/v1721387734/Asset_2_1_kl5oue.png"
              alt="submit"
              className="submit-image"
            />
          )}
          {timeUp ? (
            <div className="timeUp-content-container">
              <h1 className="timeUp-text">Time is Up</h1>
              <p className="timeUp-tag">
                You did not complete the assessment within the time
              </p>
            </div>
          ) : (
            <h1 className="result-heading">
              Congrats! You completed the assessment
            </h1>
          )}
          <div className="time-container">
            <p className="time-taken">Time Taken</p>
            <p>{formattedTimeTaken}</p>
          </div>
          <div className="score-container">
            <p className="score-text">Your Score</p>
            <p className="score">{score}</p>
          </div>
          <button
            type="button"
            className="reattempt-btn"
            onClick={onClickReattempt}
          >
            Reattempt
          </button>
        </div>
      </div>
    </>
  )
}

export default Results
