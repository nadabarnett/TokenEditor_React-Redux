import React, { Component } from 'react';
import Switch from 'react-toggle-switch';
import { Link } from 'react-router-dom';
import { tokenBytecode, tokenAbi } from './../components/ContractStore';
import Modal from 'react-modal';

const customStyles = {
    content : {
      width                 : '70%',
      height                : '102%',
      top                   : '52%',
      left                  : '50%',
      right                 : 'auto',
      transform             : 'translate(-50%, -50%)',
      transparent           : '1',
      backgroundColor       : 'rgba(0, 0, 0, .00)',
      webkitboxshadow       : '0 1px 1px rgba(0,0,0,.05)',
      boxshadow             : '0 1px 1px rgba(0,0,0,.05)',
      border                : '0px dashed white',
      borderRadius          : '20px'
    }
};

const web3Context = window.web3;

class AddToken extends Component {

    constructor(props) {
        super(props)

        this.state = {
          showHideSidenav: "",
          switched: false,
          modalIsOpen: false,
          user: web3Context.eth.coinbase ? web3Context.eth.coinbase : 'Will be set automatically',
          transaction: {
            trxHash: '',
            trxURL: '',
            tokenAddress: '',
            tokenURL: '',
            issue: ''
          },
          token: {
                name: '',
                symbol: '',
                decimals: '18',
                totalSupply:  0,
                erc223: false,
                owner: web3Context.eth.coinbase,
                pausable: false,
                freezable: false,
                mintable: false,
                receivers: [{
                    id: 0,
                    address: web3Context.eth.coinbase,
                    amount: '',
                    frozen: false,
                    untilDate: 0
                }]
          }
        }
    }

    componentDidMount() {
        document.body.id = "";
    }

    toggleSidenav() {
        var css = (this.state.showHideSidenav === "active") ? "" : "active";
        this.setState({ "showHideSidenav": css });
    }

    toggleSwitch = () => {
        this.setState( prevState => {
            return {
                token : {
                    ...prevState.token, erc223: !this.state.token.erc223
                }
            };
        });
    };

    toBigNumber = (amount) => {
        const decimals = web3Context.toBigNumber(this.state.token.decimals);
        const bigNumber = web3Context.toBigNumber(amount);
        const value = bigNumber.times(web3Context.toBigNumber(10).pow(decimals));

        return value;
    }

    onChange = (e) => {
        let value = e.target.value != "on" ?  e.target.value : e.target.checked;
        let name = e.target.name;
        this.setState( prevState => {
           return {
                token : {
                    ...prevState.token,
                    [name]: value
                }
           }
        });
    }

    ondistributionAddresses = (id) => (e) => {
        let value = e.target.value != "on" ?  e.target.value : e.target.checked; // Detecting checkboxes
        let name = e.target.name;
        const newReceivers = this.state.token.receivers.map((receiver, i) => {
            if (id !== i) return receiver;
            return {
                ...receiver,
                [name]: [name] != "untilDate" ? value : new Date(value).getTime() / 1000
            };
        });

        this.setState( prevState => {
            return {
                token : {
                    ...prevState.token,
                    receivers: newReceivers
                }
            }
        });
    }

    onAddReceiver = () => {
        const newAddress = {
            id: this.state.token.receivers.length,
            address: '',
            amount: '',
            freezen: false,
            untilDate: 0
        };

        this.setState( prevState => {
            return {
                token : {
                    ...prevState.token,
                    receivers: prevState.token.receivers.concat(newAddress)
                }
            };
        });
    }

    onDeleteReceiver = (id) => {
        const sampleReceivers = this.state.token.receivers.filter(receiver => receiver.id !== id)
        this.setState( prevState => {
            return {
                token : {
                    ...prevState.token,
                    receivers: sampleReceivers
                }
            };
        });
    }

    calculateTotalSupply = () => {
        let amounts = this.state.token.receivers.map((receiver, i) => {
            return (receiver.amount != "" ? parseInt(receiver.amount) : 0);
        });
        var sum = amounts.reduce((a, b) => a + b, 0);
        this.setState( prevState => {
            return {
                token : {
                    ...prevState.token,
                    totalSupply: sum
                }
            }
        });
    }

    onSubmit = (e) => {
        e.preventDefault();

        let name = this.state.token.name.replace(/\s/g, ''),
            symbol = this.state.token.symbol.replace(/\s/g, ''),
            decimals = this.state.token.decimals,
            erc223 = this.state.token.erc223,
            pausable = this.state.token.pausable,
            freezable = this.state.token.freezable,
            mintable = this.state.token.mintable,
            user = this.state.user,
            accountSwitched = false,
            receivers = this.state.token.receivers.map((receiver, i) => {
                receiver.address = web3Context.toChecksumAddress(receiver.address);
                return receiver.address;
            }),
            amounts = this.state.token.receivers.map((receiver, i) => {
                receiver.amount = this.toBigNumber(receiver.amount);
                return receiver.amount;
            }),
            frozen = this.state.token.receivers.map((receiver, i) => {
                return receiver.frozen;
            }),
            untilDate = this.state.token.receivers.map((receiver, i) => {
                return receiver.untilDate;
            });


        this.setState({modalIsOpen: true});
        setInterval(function() {
            if (web3Context.eth.coinbase !== user && !accountSwitched) {
                accountSwitched = true;
                alert("You switch the metamask account. \n  \n Please log in with your previus account for getting notification about your token. \n  \n " + user + "");
            }
        }, 100);

        let newTokenContract = web3Context.eth.contract(tokenAbi)

        newTokenContract.new(
            name,
            symbol,
            decimals,
            pausable,
            freezable,
            mintable,
            receivers,
            amounts,
            frozen,
            untilDate,
            {
                from: this.state.user,
                data: '0x' + tokenBytecode,
                value: 1000000000000000000
            }, (e, tokenContract) => {
                if(typeof tokenContract !== 'undefined') {
                    if (!tokenContract.address) {
                        this.setState({
                            transaction: {
                                trxHash: tokenContract.transactionHash,
                                trxURL: "https://rinkeby.etherscan.io/tx/" + tokenContract.transactionHash
                            }
                        });
                    } else {
                        this.setState({
                            transaction: {
                                trxHash: tokenContract.transactionHash,
                                trxURL: "https://rinkeby.etherscan.io/tx/" + tokenContract.transactionHash,
                                tokenAddress: tokenContract.address,
                                tokenURL: "https://rinkeby.etherscan.io/token/" + tokenContract.address
                            }
                        });
                    }
                } else {
                    this.setState({
                        transaction: {
                            issue: 'You have denied the transaction. Please try again.'
                        }
                    });
                }
              }
            )
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            transaction: {
                issue: null
            }
        })
    }

    render() {
        return (
            <div className="wrapper">
                <nav id="sidebar" className={this.state.showHideSidenav}>
                    <div className="sidebar-header">
                        <h5><img width="25%" height="25%" src="https://i.imgur.com/sMK1rIY.png" /><a href="/dashboard">Token Editor</a></h5>
                    </div>

                    <ul className="list-unstyled">
                        <li className="selected-li">
                            <a href="/tokens"><i className="fas fa-lg fa-coins"></i> Tokens</a>
                        </li>
                        <li>
                            <a href="/Crowdsales"><i className="fas fa-lg fa-trophy"></i> Crowdsales</a>
                        </li>
                        <li>
                            <a href="/compaign"><i className="fas fa-lg fa-sign"></i> Campaigns</a>
                        </li>
                        <li>
                            <a href="/KycAml"><i className="fas fa-lg fa-sign"></i> KYC/AML</a>
                        </li>
                        <li>
                            <a href="/Transactions"><i className="fas fa-lg fa-chart-bar"></i> Transactions</a>
                        </li>
                        <li>
                            <a href="/Affiliate"><i className="fas fa-lg fa-users"></i> Affiliate</a>
                        </li>
                        <li>
                            <a href="/setting"><i className="fas fa-lg fa-cog"></i> Settings</a>
                        </li>
                    </ul>
                    <div className="row my-5 px-2 align-items-center no-gutters">
                        <div className="col">
                            <i className="fas fa-2x fa-user"></i>
                        </div>
                        <div className="col">
                            <p className="m-0">Oleh</p>
                            <span className="profile-email">typicaladmsky@gmail.com</span>
                        </div>
                        {this.props.location.state ? (
                            <div className="col">
                                <a href={"https://etherscan.io/address/" + this.props.location.state.address} target="_blank" className="m-0 break-word link">{this.props.location.state.address}</a>
                            </div>
                        ) : null}
                    </div>
                    <div className="row justify-content-center main-color my-5">
                        <div className="col-auto">
                            <a href="http://twitter.com/" target="_blank"><i className="fab fa-lg fa-twitter"></i></a>
                        </div>
                        <div className="col-auto">
                            <a href="http://www.facebook.com/" target="_blank"><i className="fab fa-lg fa-facebook-f"></i></a>
                        </div>
                        <div className="col-auto">
                            <a href="https://medium.com/" target="_blank"><i className="fab fa-lg fa-medium-m"></i></a>
                        </div>
                        <div className="col-auto">
                            <a href="https://www.youtube.com/" target="_blank"><i className="fab fa-lg fa-youtube"></i></a>
                        </div>
                    </div>
                    <p className="text-muted text-center my-5">@ 2018 Token Editor</p>
                </nav>
                <div id="content" className="mb-5">
                    <nav className="navbar navbar-expand-lg">
                        <div className="container-fluid">
                            <button type="button" id="sidebarCollapse" onClick={this.toggleSidenav.bind(this)} className="editor-btn main">
                                <i className="fas fa-align-left"></i>
                                <span> Collapse menu</span>
                            </button>
                            <button className="editor-btn main d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <i className="fas fa-align-justify"></i>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="nav navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link to={'/'} className="nav-link">
                                            Log out
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className="container-fluid px-md-5">
                        <div className="row my-4 text-center">
                        <div className="col col-md-12">
                            <div className="row justify-content-center">
                                <h2 className="text-uppercase">Create token contract</h2>
                            </div>
                            <form className="row justify-content-left my-4" onSubmit={this.onSubmit}>
                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 form-group">
                                        <p>Token name</p>
                                        <input type="text" required={true} onChange={this.onChange} name="name" className="editor-input w-100" placeholder="My Token Name" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Token symbol</p>
                                        <input type="text" required={true} onChange={this.onChange} name="symbol" className="editor-input w-100" placeholder="MTN" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Decimals</p>
                                        <input type="number" required={true} defaultValue="18" onChange={this.onChange} name="decimals" className="editor-input w-100" placeholder="18" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Token standard</p>
                                        <div className="row justify-content-center">
                                            ERC20
                                            <span className="span-space" />
                                            <Switch onClick={this.toggleSwitch} on={this.state.token.erc223}/>
                                            <span className="span-space" />
                                            ERC223
                                        </div>
                                    </div>
                                    <div className="w-100"></div>
                                </div>
                                <div className="w-100"></div>

                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 form-group">
                                        <p>Token owner</p>
                                        <input type="text" required={true} value={this.state.token.owner} className="editor-input w-100" readOnly placeholder="ex. 0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Token type</p>
                                        <div className="d-flex justify-content-between form-group">
                                            <label htmlFor="pausable">Pausable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" onChange={this.onChange} name="pausable" id="pausable" className="check-block"/>
                                        </div>
                                        <div className="d-flex justify-content-between form-group">
                                            <label htmlFor="freezable">Freezable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" onChange={this.onChange} name="freezable" id="freezable" className="check-block"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100"></div>

                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 form-group">
                                        <p><b> Token distribution</b></p><hr/>
                                    </div>
                                    <div className="w-100"></div>

                                    { this.state.token.receivers.map((receiver, i) => (
                                        <div key={i}>
                                            <div className="col-md-12 form-group">
                                                { i !== 0 ? <hr className="w-100 my-5" /> : null }
                                                <p>Receiver address</p>
                                                { i !== 0 ?
                                                    <input type="text" required={true} onChange={this.ondistributionAddresses(i)} name="address" className="editor-input w-100" placeholder="ex. 0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80" />
                                                :
                                                    <input type="text" required={true} onChange={this.ondistributionAddresses(i)} name="address" className="editor-input w-100" defaultValue={receiver.address} />
                                                }
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Tokens amount</p>
                                                <input type="number"  required={true} onChange={this.ondistributionAddresses(i)} onBlur={this.calculateTotalSupply} name="amount" className="editor-input w-100" placeholder="ex. 100000" />
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <div className="d-flex justify-content-between form-group">
                                                    <div className="col-md-6 form-group">
                                                        <label htmlFor={"frozen-" + i}>Frozen <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                                        <div className="row justify-content-center">
                                                            <input type="checkbox" onChange={this.ondistributionAddresses(i)} name="frozen" id={"frozen-" + i} className="check-block"/>
                                                        </div>
                                                    </div>
                                                    { this.state.token.receivers[i].frozen  ?
                                                        <div className="col-md-6 form-group">
                                                            <p>Until date</p>
                                                            <input type="date"  required={true} onChange={this.ondistributionAddresses(i)} name="untilDate" className="editor-input w-100 min-w-100" placeholder="01.10.2018" />
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <i>Total supply is - {this.state.token.totalSupply} {this.state.token.symbol.toUpperCase()}</i>
                                    <div className="w-100"></div>

                                    <button type="button" onClick={this.onAddReceiver} className="editor-btn main">
                                        <i className="fas fa-plus"></i>
                                        <span>&nbsp;&nbsp; Add the another address</span>
                                    </button>
                                </div>
                                <div className="w-100"></div>

                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 m-0 form-group">
                                        <div className="d-flex m-0 justify-content-between form-group">
                                            <label htmlFor="mintable" className="m-0">Future minting <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" onChange={this.onChange} name="mintable" id="mintable" className="check-block"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100"></div>

                                <div className="col-md-4 col-md-push-8">
                                    <input type="submit" className="editor-btn main big" value="Deploy"/>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    style={customStyles}
                >
                    <div className="panel panel-danger">
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                            <div id="stats" style={{backgroundColor: "rgb(69, 70, 123)", color:"white", height:"50px", width:"100%"}}>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-12">
                                        <p className="Title" style={{textAlign:"center"}}>Contract deployment</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="panel-body">
                            <div className="row container-fluid my-4 mx-3">
                                <div className="row container-fluid">
                                    <div className="col-md-12 form-group">
                                        <div className="row">
                                            { !this.state.transaction.issue ?
                                                <div className="col-md-12" style={{textAlign:"center"}}>
                                                    <p className="Title my-3" style={{textAlign:"center"}}>
                                                        <b>Making transaction ...</b><br/>
                                                        <i>NOTE: don't switch your account until transaction confirmation for getting information about transaction status.</i><br/>
                                                    </p>
                                                    <div className="w-100 my-5"></div>

                                                    { this.state.transaction.trxHash ?
                                                            <div>
                                                                <p className="Title my-5" style={{textAlign:"left"}}>
                                                                    Well! Transaction created.
                                                                    <br></br><br/>
                                                                    Transaction status - <a href={this.state.transaction.trxURL} style={{color: "#45467e"}} target="_blank">{ this.state.transaction.trxHash}</a><br/>
                                                                </p>

                                                                {this.state.transaction.tokenAddress ?
                                                                    <div>
                                                                        <p className="Title my-5" style={{textAlign:"left"}}>
                                                                            Congratulations! Your token ready.
                                                                            <br></br><br/>
                                                                            Token - <a href={this.state.transaction.tokenURL} style={{color: "#45467e"}} target="_blank">{ this.state.transaction.tokenAddress}</a>
                                                                        </p>
                                                                        <div className="col">
                                                                            <a href="/tokens" className="editor-btn main big my-5">Manage tokens</a>
                                                                            <span onClick={this.closeModal.bind(this)} className="editor-btn copy big my-5">Close modal</span>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <p className="Title my-5" style={{textAlign:"left"}}>
                                                                        Retrieving the token.
                                                                        <br></br><br/>
                                                                        Please wait ...
                                                                    </p>
                                                                }
                                                            </div>
                                                            :
                                                            <p className="Title my-5" style={{textAlign:"left"}}>
                                                                Please sign the transaction for continue ...
                                                            </p>
                                                    }
                                                    <div className="w-100"></div>
                                                </div>
                                                :
                                                <div className="col-md-12" style={{textAlign:"center"}}>
                                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Transaction not created</b></p>
                                                    <div className="w-100 my-5"></div>
                                                    <p className="Title my-5" style={{textAlign:"left"}}>
                                                        { this.state.transaction.issue }
                                                    </p>
                                                    <div className="col">
                                                        <span onClick={this.closeModal.bind(this)} className="editor-btn copy big my-5">Close</span>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddToken;