import React, { Component } from 'react';
import Web3 from 'web3';

let web3 = null; // Will hold the web3 instance

class Login extends Component {
    state = {
        loading: false // Loading button state
    };

    componentDidMount() {
        document.body.id = "auth"
    }

    handleClick = () => {
        if (!window.web3) {
            window.alert('Please install MetaMask first.');
            return;
        }

        if (!web3) {
            // We don't know window.web3 version, so we use our own instance of web3
            // with provider given by window.web3
            web3 = new Web3(window.web3.currentProvider);
        }

        if (!web3.eth.coinbase) {
            window.alert('Please activate MetaMask first.');
            return;
        }

        const publicAddress = web3.eth.coinbase.toLowerCase();
        this.setState({ loading: true });
        this.handleSignMessage(publicAddress);
    };

    handleSignMessage = (publicAddress) => {
        const { onLoggedIn } = this.props;

        return new Promise((resolve, reject) =>
            web3.personal.sign(
                web3.fromUtf8(`Your public address is ${publicAddress}. Please sign below to authenticate with TokenEditor platform.`),
                publicAddress,
                (err, signature) => {
                    if (err) {
                        this.setState({ loading: false });
                        alert("Reverted. Please sign the transaction for the login.")
                        return reject(err)
                    }
                    else {
                        onLoggedIn(publicAddress);
                        return resolve({ publicAddress, signature })
                    };
                }
            )
        );
    };

    render() {
        const { loading } = this.state;
        return (
            <div className="container text-center">
                <div className="row">
                    <div className="w-100 my-2"></div>
                    <div className="col">
                        <h2 className="text-uppercase">Sign in</h2>
                    </div>
                    <div className="w-100 my-2"></div>
                    <div className="col">
                        <p>
                            Please select your login method.<br />For the purpose of this demo,
                            only MetaMask login is implemented.
                        </p>
                        <button className="editor-btn big" onClick={this.handleClick}>
                            {loading ? 'Loading...' : 'Login with MetaMask'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;