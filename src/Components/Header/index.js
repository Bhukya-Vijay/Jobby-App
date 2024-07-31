import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="navContainer">
      <div className="logo-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/djhvryb5m/image/upload/v1721234194/image_28_Traced_wkgq1t.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>

        <p className="title">
          NXT <span className="assess">Assess</span>
        </p>
      </div>
      <button type="button" className="logoutButton" onClick={onClickLogout}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
