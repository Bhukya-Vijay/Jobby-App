import {withRouter, Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div className="assessment-home-page">
        <div className="instructions-card">
          <h1 className="instructions">Instructions</h1>
          <ol className="instructions-list">
            <li className="instruction">
              <span className="side-heading">Total Questions:</span> 10
            </li>
            <li className="instruction">
              <span className="side-heading">Types of Questions:</span> MCQs
            </li>
            <li className="instruction">
              <span className="side-heading">Duration:</span> 10 Mins
            </li>
            <li className="instruction">
              <span className="side-heading">Marking Scheme:</span> Every
              Correct response, get 1 mark
            </li>
            <li className="instruction">
              All the progress will be lost, if you reload during the assessment
            </li>
          </ol>
          <Link to="/assessment">
            <button type="button" className="start-assessment-btn">
              Start Assessment
            </button>
          </Link>
        </div>
        <img
          src="https://res.cloudinary.com/djhvryb5m/image/upload/v1721232815/Group_he2hgn.jpg"
          alt="assessment"
          className="assessment-image"
        />
      </div>
    </>
  )
}

export default withRouter(Home)
