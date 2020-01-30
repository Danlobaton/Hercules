import React, { Component } from 'react';

export default class FacebookLogin extends Component {
  state = {
    FBSession: window.FB
  }

  componentDidMount() {
    if (this.state.FBSession) {
      this.initializeFacebookLogin()
    } else {
      document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  /**
   * Init FB object and check Facebook Login status
   */
  initializeFacebookLogin = () => {
    this.FB = window.FB;
    this.checkLoginStatus();
  }

  /**
   * Check login status
   */
  checkLoginStatus = () => {
    this.FB.getLoginStatus(this.facebookLoginHandler);
  }

  /**
   * Check login status and call login api is user is not logged in
   */
  facebookLogin = () => {
    if (!this.FB) {
      return;
    }

    this.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response);
      } else {
        this.FB.login(this.facebookLoginHandler, {scope: 'ads_management'});
      }
    }, );
  }

  /**
   * Handle login response
   */
  facebookLoginHandler = response => {
    if (response.status === 'connected') {
      this.FB.api('/me?fields=email,name,id', userData => {
        let result = {
          ...response,
          user: userData
        };
        this.props.onLogin(true, result);
      });
    } else {
      console.log('login failure')
      this.props.onLogin(false);
    }
  }

  render() {
    // re-initialize facebook login if failure 
    if (this.state.FBSession) {
      this.initializeFacebookLogin()
    }
    let {children} = this.props;
    return (
      <div onClick={this.facebookLogin} >
        {children}
      </div>
    );
  }
}