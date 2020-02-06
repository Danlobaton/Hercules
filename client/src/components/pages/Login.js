import React, { Component } from 'react'
import backgroundImg from '../backgroundIMG.png'
import graphImg from '../graphIMG.png'
import outlineImg from '../outlineIMG.png'
import logo from '../logo.png'
import FacebookLogin from '../functional/FacebookLogin'
import InitLoading from './InitLoading'

export class Login extends Component {
    state = {
        loggedIn: this.props.loggedIn,
        error: false
    }

    renderErrorMessage = (active) => {
        return (
            <div style={{...errorBubble, top: active.top, opacity: active.opacity}}>
                Couldn't Login in, Please try again later.
            </div>
        )
    }

    onFacebookLogin = (loginStatus, resultObject) => {
        if (loginStatus === true) {
            console.log(resultObject)
            this.setState({loggedIn: loginStatus})
            // gets current ad objects children
            fetch(`/checkUser?token=${resultObject.authResponse.accessToken}&user_id=${resultObject.authResponse.userID}&name=${resultObject.user.name}&email=${resultObject.user.email}`)
            .then(res => res.json())
            .then((data) => { 
                console.log(data);
                setTimeout(() => {
                    this.props.login(resultObject.authResponse.userID, resultObject.authResponse.accessToken, loginStatus);
                }, 1200)
            })
            .catch(err => console.log(err));
        } else if (!resultObject) {
            console.log('Not logged in')
        } else {
            console.log('Login Failure')
            this.setState({error: true})
        }
    } 

    render() {
        let errorActive = {top: this.state.error ? '5%' : '-5%', opacity: this.state.error ? 1 : 0}
        let loggedIn = this.state.loggedIn ? 0 : 1
        return (
            <div style={loginStyle}>
                <img src={backgroundImg} alt='something' style={{height: '100vh', width: '100%', position: 'absolute', zIndex: 0}} />
                <img src={graphImg} alt='graphs dude' style={{width: '101%', position: 'absolute', bottom: -10, opacity: loggedIn,transition: 'opacity 1000ms'}} />
                <img src={outlineImg} alt='outline dude' style={{width: '101%', position: 'absolute', bottom: -10, opacity: loggedIn,transition: 'opacity 1000ms'}} />
                {this.renderErrorMessage(errorActive)}
                <div style={{...contentStyle, opacity: loggedIn}}>
                    <img src={logo} alt='ADM' style={{height: 50, width: 170}}/>
                    <FacebookLogin onLogin={this.onFacebookLogin}>
                        <button style={buttonStyle}>
                            SIGN IN WITH FACEBOOK
                        </button>
                    </FacebookLogin> 
                </div>
            </div>
        )
    }
}

const errorBubble = {
    position: 'absolute',
    background: '#fc6060',
    padding: '10px 25px',
    width: 300,
    color: 'white',
    fontWeight: 600,
    fontSize: 12,
    left: '50%',
    marginLeft: '-150px',
    textAlign: 'center',
    transition: 'top 350ms'
}
const loginStyle = {
    display: 'flex',
    margin: '0 auto',
    flexDirection: 'column',
    justifyContent: 'space-around',
    background: 'black',
    alignItems: 'middle',
    height: '100vh',
    width: '100%',
    overflow: 'hidden'
}
const contentStyle = {
    transform: 'translateY(200px)',
    display: 'flex',
    margin: '0 auto',
    height: 500,
    fontWeight: 500,
    fontFamily: "'Roboto', sans-serif",
    width: 500,
    justifyContent: 'space-between',
    transition: 'opacity 1000ms'
}
const buttonStyle = { 
    borderRadius: 0,
    border: '2px solid #3A4B8B',
    height: 50,
    width: 250,
    fontWeight: 300,
    letterSpacing: 1,
    color: 'white',
    fontSize: 15,
    background: 'none'
}

export default Login
