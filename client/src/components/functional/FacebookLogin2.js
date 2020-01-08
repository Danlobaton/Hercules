import React, { Component} from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';
 
export default class Example extends Component {
  handleResponse = (data) => {
    console.log(data);
  }
 
  handleError = (error) => {
    this.setState({ error });
  }
 
  test = () => console.log("i am pressed, but not impressed")

  render() {
    return (
      <FacebookProvider appId="2371944143054340">
        <LoginButton
          scope="ads_management"
          onCompleted={this.handleResponse}
          onError={this.handleError}
        >
          <span>Login via Facebook</span>
        </LoginButton>
      </FacebookProvider>
    );
  }
}