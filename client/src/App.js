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

  login = (userID, accessToken, loginStatus) => {
    this.setState({
      userID: userID,
      accessToken: accessToken
    })
<<<<<<< HEAD
    console.log(accessToken);
    console.log(userID);
    this.state.userID ? this.setState({loggedIn: true}) : console.log('error')
=======
    this.setState({loggedIn: loginStatus})
>>>>>>> dev
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
