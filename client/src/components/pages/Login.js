import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import logo from '../logo.png'
import fbIcon from './FB_Icon.png'
import FacebookLogin from '../functional/FacebookLogin'

export class Login extends Component {
    state = {
        loggedIn: this.props.loggedIn,
    }

    onFacebookLogin = (loginStatus, resultObject) => {
        if (loginStatus === true) {
            this.props.login(resultObject.authResponse.userID, resultObject.authResponse.accessToken, loginStatus);
            console.log(resultObject)
            // gets current ad objects children
            fetch(`/checkUser?token=${resultObject.authResponse.accessToken}&user_id=${resultObject.authResponse.userID}&name=${resultObject.user.name}&email=${resultObject.user.email}`)
            .then(res => res.json())
            .then((data) => { 
                console.log(data);
            });
        } else {
          console.log('Not logged in');
        }
      }

    render() {
        return (
            <div style={loginStyle}>
                <div style={contentStyle}>
                    <img src={logo} alt='ADM' height='350' />
                    <FacebookLogin onLogin={this.onFacebookLogin}>
                        <Button style={buttonStyle} onClick={this.props.login}>
                            <div style={buttonContentStyle} >
                                <img style={{transform: 'translateY(2px)'}} src={fbIcon} alt='fb' height='20' />
                                Sign in with Facebook
                                <div />
                            </div>
                        </Button>
                    </FacebookLogin>
                </div>
            </div>
        )
    }
}

const loginStyle = {
    display: 'flex',
    margin: '0 auto',
    flexDirection: 'column',
    justifyContent: 'space-around',
    background: '#EBEBEC',
    alignItems: 'middle',
    height: '100vh',
    width: '100%'
}
const contentStyle = {
    display: 'flex',
    margin: '0 auto',
    flexDirection: 'column',
    height: 500,
    fontWeight: 500,
    fontFamily: "'Roboto', sans-serif"
}
const buttonStyle = {
    transform: 'translateY(-40px)', 
    background: '#3b5998', 
    borderRadius: 0,
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.20)',
    border: 'none',
    height: 50,
    width: '100%'
}

const buttonContentStyle = {
    width: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'middle',
    margin: '0 auto'
}

export default Login
