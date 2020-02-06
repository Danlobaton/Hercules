import React, { Component } from 'react'
import ADMApp from './components/pages/admApp' 
import Login from './components/pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

export class App extends Component {
  state = {
    loggedIn: false,
    userID: null,
    accessToken: null, 
    loaded: false,
    loadCount: 0,
  }

  isLoaded = loaded => this.setState({loaded: loaded}) 

  incrementLoadCount = () => this.setState({loadCount: this.state.loadCount + 1})

  login = (userID, accessToken, loginStatus) => {
    this.setState({
      userID: userID,
      accessToken: accessToken,
      loggedIn: loginStatus
    })
  }

  showApp = () => {
    if (this.state.loggedIn) {
      return (
        <ADMApp 
          id={this.state.userID} 
          token={this.state.accessToken} 
          loaded={this.state.loaded}
          loadCount={this.state.loadCount}
          isLoaded={this.isLoaded}
          incrementLoadCount={this.incrementLoadCount}
        />
      )
    } else {
      return (
        <Login 
          login={this.login}
          loggedIn={this.state.loggedIn}
          isLoaded={this.state.loaded}
        />
      )
    }
  }
  render() {
    console.log(this.state.loadCount)
    return (
      <div>
        {this.showApp()}
      </div>
    )
  }
}
export default App
