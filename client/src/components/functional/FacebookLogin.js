import React, { Component } from 'react';

export default class FacebookLogin extends Component {
  state = {
    listenerActive: false
  }

  componentDidMount() {
    // document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
    console.log('event listener added')
    while (!window.FB) {
      console.log('this worked')
      this.initializeFacebookLogin()
    }
  }

  componentWillUnmount() {
    // document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    console.log('event listener removed')
  }

  /**
   * Init FB object and check Facebook Login status
   */
  initializeFacebookLogin = () => {
    this.setState({listenerActive: true})
    this.FB = window.FB;
    this.checkLoginStatus();
    console.log(this.checkLoginStatus)
    console.log('facebook login status check')
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
      console.log('FB not initialized')
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
      // this.FB.api('/me', userData => {
      //   let result = {
      //     ...response,
      //     user: userData
      //   };
      //   this.props.onLogin(true, result);
      // });
      console.log(response)
      this.props.onLogin(true, response)
    } else {
      this.props.onLogin(false);
    }
  }

  render() {
    let {children} = this.props;
    return (
      <div onClick={this.facebookLogin} >
        {children}
      </div>
    );
  }
}