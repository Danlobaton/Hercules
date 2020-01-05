import React, { Component } from 'react'
import ADMApp from './components/pages/admApp' 
import Login from './components/pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

export class App extends Component {
  state = {
    loggedIn: false,
    userID: null,
    accessToken: null
  }

  Login = (userID, accessToken) => {
    this.setState({
      userID: userID,
      accessToken: accessToken
    })
    this.state.userID ? this.setState({loggedIn: true}) : console.log('error')
  }

  showApp = () => {
    if (this.state.loggedIn) {
      return (
        <ADMApp id={this.state.userID} token={this.state.accessToken} />
      )
    } else {
      return (
        <Login login={this.login}/>
      )
    }
  }
  render() {
    return (
      <div>
        {this.showApp()}
      </div>
    )
  }
}

export default App
