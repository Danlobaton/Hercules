import React, { Component } from 'react'
import ADMApp from './components/pages/admApp' 
import Login from './components/pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

export class App extends Component {
  state = {
    loggedIn: false
  }

  login = () => {
    this.setState({loggedIn: true})
  }

  showApp = () => {
    if (this.state.loggedIn) {
      return (
        <ADMApp />
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
