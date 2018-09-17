import React, { Component } from 'react';
import Login from '../components/MetamaskLogin';
import { Redirect } from 'react-router-dom';

const LS_KEY = 'metamask-login:auth';

class Auth extends Component {
  componentWillMount() {
    // Access token is stored in localstorage
    const auth = localStorage.getItem(LS_KEY);
    this.setState({
        auth
    });
  }

  handleLoggedIn = auth => {
    localStorage.setItem(LS_KEY, auth);
    this.setState({ auth });
  };

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  };

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    const { auth } = this.state;
    return (
        <div>
            { auth ? (
                <Redirect
                    to={{
                        pathname: "/dashboard",
                        state: { address: auth }
                    }}
                />
            ) : (
                <Login onLoggedIn={this.handleLoggedIn} />
            )}
        </div>
    );
  }
}

export default Auth;
