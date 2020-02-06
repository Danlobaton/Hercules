import React, { Component } from 'react';

export default class FacebookLogin extends Component {
  state = {
    FBSession: window.FB,
  }

  // initializes facebook login on component mount
  componentDidMount() { document.addEventListener('FBObjectReady', this.initializeFacebookLogin); }

  // removes listener for facebook object once login is initialized
  componentWillUnmount() { document.removeEventListener('FBObjectReady', this.initializeFacebookLogin); }

  // initializes facebook object 
  initializeFacebookLogin = () => {
    this.FB = window.FB;
    this.checkLoginStatus();
  }

  // checks login status
  checkLoginStatus = () => {
    this.FB.getLoginStatus(this.facebookLoginHandler);
  }

  // handles connection to Facebook, and logs in when not connected
  facebookLogin = () => {
    this.setState({firstInit: true})
    if (!this.FB) {
      alert('Facebook Object Initialization failure')
      return;
    }

    this.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response);
      } else {
        this.FB.login(this.facebookLoginHandler, {scope: 'ads_management'}); // add email to permission scope
      }
    });
  }

  // Handle Login Response
  facebookLoginHandler = response => {
    if (response.status === 'connected') {
      this.FB.api('/me?fields=email,name,id', userData => {
        let result = {
          ...response,
          user: userData
        };
        this.props.onLogin(true, result);
      });
    } else if (response.status === 'not_authorized') {
      console.log('login failure')
      this.props.onLogin(false, {error: true});
    } else {
      this.props.onLogin(false)
    }
  }

  render() {
    // re-initialize facebook login if listener doesn't catch object
    this.state.FBSession && this.initializeFacebookLogin()
    let {children} = this.props;
    return (
      <div onClick={this.facebookLogin} >
        {children}
      </div>
    );
  }
}