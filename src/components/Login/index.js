import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import {
  LoginMainContainer,
  FormMainContainer,
  FormContainer,
  FormImageContainer,
  FormImageLogo,
  UsernameContainer,
  PasswordContainer,
  FormButtonContainer,
  FormErrorMsg,
  UsernameLabel,
  PasswordLabel,
  UsernameInput,
  PasswordInput,
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
} from './styledComponents'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
    const {username, password} = this.state
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  SubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsername = () => {
    const {username} = this.state

    return (
      <>
        <UsernameLabel className="input-label-username" htmlFor="username">
          USERNAME
        </UsernameLabel>
        <UsernameInput
          type="text"
          id="username"
          className="input-field-username"
          value={username}
          onChange={this.onChangeUsername}
          placeholder=" Username"
        />
      </>
    )
  }

  renderPassword = () => {
    const {password, isPasswordChecked} = this.state

    return (
      <>
        <PasswordLabel className="input-label-password" htmlFor="password">
          PASSWORD
        </PasswordLabel>
        <PasswordInput
          // type={isPasswordChecked ? 'password' : 'text'}
          type="password"
          value={password}
          className="input-field-password"
          id="password"
          onChange={this.onChangePassword}
          placeholder=" Password"
        />
        <CheckboxContainer>
          <CheckboxInput type="checkbox" />
          <CheckboxLabel htmlFor="checkbox">Show Password</CheckboxLabel>
        </CheckboxContainer>
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <LoginMainContainer>
        <FormMainContainer>
          <FormImageContainer>
            <FormImageLogo
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
              alt="login website logo"
            />
          </FormImageContainer>
          <FormContainer onSubmit={this.SubmitForm}>
            <UsernameContainer>{this.renderUsername()}</UsernameContainer>
            <PasswordContainer>{this.renderPassword()}</PasswordContainer>
            <FormButtonContainer type="submit">Login</FormButtonContainer>
            {showSubmitError && <FormErrorMsg>*{errorMsg}</FormErrorMsg>}
          </FormContainer>
        </FormMainContainer>
      </LoginMainContainer>
    )
  }
}
export default Login
