import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onClickShowPassword = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {
      username,
      password,
      showPassword,
      showSubmitError,
      errorMsg,
    } = this.state
    const inputType = showPassword ? 'text' : 'password'

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="loginContainer">
        <form className="loginCard" onSubmit={this.submitForm}>
          <img
            src="https://res.cloudinary.com/djhvryb5m/image/upload/v1721232814/Group_8005_hejgqj.jpg"
            alt="login website logo"
          />
          <br />
          <div className="inputContainer">
            <label className="label" htmlFor="userName">
              UserName
            </label>
            <input
              type="text"
              value={username}
              id="userName"
              onChange={this.onChangeUserName}
              placeholder="Username"
              className="input"
            />
          </div>
          <div className="inputContainer">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type={inputType}
              value={password}
              onChange={this.onChangePassword}
              id="password"
              placeholder="Password"
              className="input"
            />
          </div>
          <div className="showPasswordContainer">
            <input
              type="checkbox"
              id="showPassword"
              onChange={this.onClickShowPassword}
            />
            <label className="label" htmlFor="showPassword">
              Show Password
            </label>
          </div>
          <br />
          <button type="submit" className="loginButton">
            Login
          </button>
          {showSubmitError && <p className="submitError">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
