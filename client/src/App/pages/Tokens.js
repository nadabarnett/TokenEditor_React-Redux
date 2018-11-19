import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import Modal                from 'react-modal';
import { controllerAbi, tokenAbi, controllerAddress } from './../components/ContractStore';

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

const buttonStyle = {
    border        : 'none',
    // padding       : '0',
    fontSize      : '13px',
    background    : 'inherit',
    color         : 'white',
    cursor        : 'pointer',
};

const web3Context = window.web3;

Modal.setAppElement('#modal')

class Tokens extends Component {

  constructor(props) {
    super(props);
    this.state = {
        "showHideSidenav"   : "",
        "modalIsOpen"       : false,
        "viewSelection"     : 1,
        "firstBtn"          : "selected-li",
        "secondBtn"         : "",
        "thirdBtn"          : "",
        "fourthBtn"         : "",
        contracts           : [],
        selectedToken       : {}
    };

    this.getTokenAddresses             = this.getTokenAddresses.bind(this);
    this.openModal                     = this.openModal.bind(this);
    this.afterOpenModal                = this.afterOpenModal.bind(this);
    this.closeModal                    = this.closeModal.bind(this);
    this.showOne                       = this.showOne.bind(this);
    this.showTwo                       = this.showTwo.bind(this);
    this.showThree                     = this.showThree.bind(this);
    this._isMounted                    = false;
  }

  componentDidMount(){
    document.body.id="";
    this.showContracts();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getTokenAddresses = () => {
    // Controller contract
    const controllerInstance = web3Context.eth.contract(controllerAbi).at(controllerAddress);

    return new Promise((resolve, reject) => {
        controllerInstance.getUserTokens(web3Context.eth.coinbase, (error, result) => {
            if (!error) {
                return resolve(result);
            } else {
                return reject(error)
            }
        })
    })
  }

  showContracts() {
    this.getTokenAddresses()
    .then(value => {
        this.getTokenContracts(value)
        .then(fetchedContracts => {
            if(this._isMounted) {
                this.setState({ contracts: fetchedContracts });
            }
        })
    })
  }

  getTokenContracts = (addresses) => {
    return new Promise((resolve, reject) => {
        // Token contract
        const tokenContract = web3Context.eth.contract(tokenAbi);
        let fetchedContracts = [];

        addresses.forEach(address => {
            const tokenInstance = tokenContract.at(address);
            const contract = {
                address: address,
                name: '',
                symbol: ''
            };

            new Promise((resolve, reject) => {
                tokenInstance.getState((error, response) => {
                    if(!error) {
                        return resolve(response)
                    }
                    else return reject(error)
                })
            }).then(token => {
                contract.name = token[0];
                contract.symbol = token[1];

                fetchedContracts.push(contract);

                if(fetchedContracts.length === addresses.length) {
                    return resolve(fetchedContracts);
                }
            })
        });
    })
  }

  toggleSidenav() {
    var css = (this.state.showHideSidenav === "active") ? "" : "active";
    this.setState({"showHideSidenav"  :css});
  }

  openModal(contract) {
    this.setState({
        modalIsOpen: true,
        selectedToken: {
            name: contract.name,
            symbol: contract.symbol,
            address: contract.address
        }
    });
    this.getInfoAboutToken(contract.address);
  }

  getInfoAboutToken(address) {
    const tokenContract = web3Context.eth.contract(tokenAbi);
    const tokenInstance = tokenContract.at(address);

    let unixToDate = (timestamp) => {
        // Months array
        const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        // Convert timestamp to milliseconds
        const date = new Date(timestamp*1000);

        // Year
        const year = date.getFullYear();

        // Month
        const month = months_arr[date.getMonth()];

        // Day
        const day = date.getDate();

        // Hours
        const hours = date.getHours();

        // Minutes
        const minutes = "0" + date.getMinutes();

        // Seconds
        const seconds = "0" + date.getSeconds();

        return month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    // Getting the total supply
    new Promise((resolve, reject) => {
        tokenInstance.getState((error, response) => {
            if(!error) return resolve(response)
            else return reject(error)
        })
    })
    // Getting the decimals
    .then(token => {
        this.setState({
            selectedToken: {
                name: token[0],
                symbol: token[1],
                decimals: Number(token[2]),
                totalSupply: web3Context.fromWei( Number(token[3]), 'ether'),
                pausable: token[4],
                freezable: token[5],
                mintable: token[6],
                creationDate: unixToDate(Number(token[7])),
                contractAddress: address
            }
        });
    })
  }

  onChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState( prevState => {
        return {
            selectedToken : {
                ...prevState.selectedToken,
                features: {
                    ...prevState.selectedToken.features,
                    [name]: value
                }
            }
        }
    });
  }

  doTokenFeature = (e) => {
    e.preventDefault();

    const tokenContract = web3Context.eth.contract(tokenAbi);
    const tokenInstance = tokenContract.at(this.state.selectedToken.contractAddress);
    const action = e.target.dataset.action;
    const decimals = web3Context.toBigNumber(this.state.selectedToken.decimals);

    switch (action) {
        case 'transfer':
            let amount = web3Context.toBigNumber(this.state.selectedToken.features.transferAmount),
                to  = web3Context.toChecksumAddress(this.state.selectedToken.features.transferTo),
                value = amount.times(web3Context.toBigNumber(10).pow(decimals));

            tokenInstance.transfer(to, value, (err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;
        case 'burn':
            amount = web3Context.toBigNumber(this.state.selectedToken.features.burnAmount),
            value = amount.times(web3Context.toBigNumber(10).pow(decimals));

            tokenInstance.burn(value, (err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;
        case 'mint':
            amount = web3Context.toBigNumber(this.state.selectedToken.features.mintAmount),
            to  = web3Context.toChecksumAddress(this.state.selectedToken.features.mintReceiver),
            value = amount.times(web3Context.toBigNumber(10).pow(decimals));

            tokenInstance.mint(to, value, (err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;
        case 'pause':
            tokenInstance.pause((err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;
        case 'unpause':
            tokenInstance.unpause((err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;
        case 'freeze':
            to  = web3Context.toChecksumAddress(this.state.selectedToken.features.freezeAddress);
            tokenInstance.freezeAccount(to, (err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;
        case 'unfreeze':
            to  = web3Context.toChecksumAddress(this.state.selectedToken.features.unFreezeAddress);
            tokenInstance.unFreezeAccount(to, (err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;
        case 'transferOwnership':
            to  = web3Context.toChecksumAddress(this.state.selectedToken.features.newOwner);
            tokenInstance.transferOwnership(to, (err, txHash) => {
                if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
            })
            break;

        default:
            break;
    }
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({
        modalIsOpen: false,
        selectedToken: {}
    })
  }

  showOne() {
    this.setState({viewSelection : 1});
  }

  showTwo() {
    this.setState({viewSelection : 2});
  }

  showThree() {
    this.setState({viewSelection : 3});
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
            </div>
            <div className="row justify-content-center main-color my-5">
              <div className="col-auto">
                <a href="http://twitter.com/" rel="noopener noreferrer" target="_blank"><i className="fab fa-lg fa-twitter"></i></a>
              </div>
              <div className="col-auto">
                <a href="http://www.facebook.com/" rel="noopener noreferrer" target="_blank"><i className="fab fa-lg fa-facebook-f"></i></a>
              </div>
              <div className="col-auto">
                <a href="https://medium.com/" rel="noopener noreferrer" target="_blank"><i className="fab fa-lg fa-medium-m"></i></a>
              </div>
              <div className="col-auto">
                <a href="https://www.youtube.com/" rel="noopener noreferrer" target="_blank"><i className="fab fa-lg fa-youtube"></i></a>
              </div>
            </div>
            <p className="text-muted text-center my-5">@ 2018 Token Editor</p>
        </nav>

        <div id="content">

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
                <div className="row justify-content-center">
                    <h2 className="text-uppercase">My Tokens</h2>
                </div>
                <div className="row my-4">
                    <Link to={'/addToken'} className="nav-link">
                        <button className="editor-btn main big" onClick={this.openModal}><i className="fa fa-plus-circle"></i>&nbsp;&nbsp; Create Token</button>
                    </Link>
                </div>
                <div className="col table-responsive editor-block my-4">
                    { this.state.contracts.length ?
                        <table className="table" bordercolor="white">
                            <thead style={{fontSize:"15px", textAlign:"center"}}>
                                <tr style={{border:"none"}}>
                                <th style={{border:"none"}}>Name</th>
                                <th style={{border:"none"}}>Symbol</th>
                                <th style={{border:"none"}}>Address</th>
                                </tr>
                            </thead>
                            <tbody style={{fontSize:"13px", textAlign:"center"}}>
                                { this.state.contracts.map((contract, i) => (
                                    <tr key={i}>
                                        <td className="align-middle">{contract.name}</td>
                                        <td className="align-middle">{contract.symbol}</td>
                                        <td className="align-middle">
                                            <a href={"https://rinkeby.etherscan.io/token/" + contract.address} style={{color: "#45467e"}} target="_blank">{contract.address}</a>
                                        </td>
                                        <td className="align-middle">
                                            <button className="editor-btn main small" onClick={() => this.openModal(contract)}>
                                                <i className="fas fa-edit"></i> Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                        </table>
                    :
                        null
                    }
                </div>
            </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="panel panel-danger">
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div id="stats" style={{backgroundColor: "rgb(69, 70, 123)", color:"white", height:"50px", width:"100%"}}>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-11">
                        <div className="col-md-8">
                          <p className="Title" style={{textAlign:"right"}}>Manage ExampleToken</p>
                        </div>
                      </div>
                      <div className="col-md-1">
                        <div className="col-md-12">
                          <button style = {buttonStyle}
                            onClick={this.closeModal}
                            type="button"
                            aria-label="close"
                          >
                            <p style={{marginLeft:"-20px"}}>CLOSE</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-body">
                <div className="row my-4">
                    <div className="col-md-4">
                    {
                        this.state.viewSelection === 1 ?
                        <button className="row text-center align-items-center editor-button selected-li" onClick={this.showOne}>
                            <div className="col">
                            <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_info_white.png'} /></p>
                            <p className="Amount">info</p>
                            </div>
                        </button>
                        :
                        <button className="row text-center align-items-center editor-button" onClick={this.showOne}>
                            <div className="col">
                            <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_info_blue.png'} /></p>
                            <p className="Amount">info</p>
                            </div>
                        </button>
                    }
                    </div>

                    <div className="col-md-4">
                    {
                        this.state.viewSelection == 2 ?
                        <button className="row text-center align-items-center editor-button selected-li" onClick={this.showTwo}>
                            <div className="col">
                            <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_ico_white.png'} /></p>
                            <p className="Amount">Basic features</p>
                            </div>
                        </button>
                        :
                        <button className="row text-center align-items-center editor-button" onClick={this.showTwo}>
                            <div className="col">
                            <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_ico_blue.png'} /></p>
                            <p className="Amount">Basic features</p>
                            </div>
                        </button>
                    }
                    </div>

                    { this.state.selectedToken.mintable || this.state.selectedToken.pausable || this.state.selectedToken.freezable ?
                        <div className="col-md-4">
                        {
                            this.state.viewSelection == 3 ?
                            <button className="row text-center align-items-center editor-button selected-li" onClick={this.showThree}>
                                <div className="col">
                                <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_ico_white.png'} /></p>
                                <p className="Amount">Extra features</p>
                                </div>
                            </button>
                            :
                            <button className="row text-center align-items-center editor-button" onClick={this.showThree}>
                                <div className="col">
                                <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_ico_blue.png'} /></p>
                                <p className="Amount">Extra features</p>
                                </div>
                            </button>
                        }
                        </div>
                        :
                        null
                    }
                </div>
                <hr/>

                {
                    this.state.viewSelection === 1 ?
                        <div className="row container-fluid my-4">
                            <div className="col-md-6">
                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Name</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedToken.name}</p>
                                </div>
                                </div>

                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Symbol</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedToken.symbol}</p>
                                </div>
                                </div>

                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Decimals</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedToken.decimals}</p>
                                </div>
                                </div>

                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Total supply</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedToken.totalSupply}</p>
                                </div>
                                </div>

                            </div>
                            <div className="col-md-6">

                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Creation date</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedToken.creationDate}</p>
                                </div>
                                </div>

                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Pausable</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedToken.pausable).toUpperCase()}</p>
                                </div>
                                </div>

                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Freezable</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedToken.freezable).toUpperCase()}</p>
                                </div>
                                </div>

                                <div className="col-md-12 form-group my-5">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Mintable</p>
                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedToken.mintable).toUpperCase()}</p>
                                </div>
                                </div>

                            </div>
                            <div className="col-md-12" style={{textAlign:"center"}}>
                                <a href={"https://rinkeby.etherscan.io/token/" + this.state.selectedToken.contractAddress} style={{color: "#45467e"}} target="_blank">See on Etherscan</a>
                        </div>
                    </div>
                    : null
                }

                {
                    this.state.viewSelection === 2 ?
                    <div className="row container-fluid my-4 mx-3">
                        <div className="row container-fluid">
                            <div className="col-md-12 form-group">
                                <div className="row">
                                    <div className="col-md-12" style={{textAlign:"center"}}>
                                        <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer {this.state.selectedToken.name} Token</b></p>
                                        <form className="d-flex" data-action="transfer" onSubmit={this.doTokenFeature}>
                                            <div className="col">
                                                <p className="Title my-3" style={{textAlign:"center"}}>ETH address</p>
                                                <input type="text" onChange={this.onChange} name="transferTo" className="editor-input" placeholder="Text" style={{width:"70%"}} required={true} />
                                            </div>
                                            <div className="col">
                                                <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                                <input type="text" onChange={this.onChange} name="transferAmount" className="editor-input" placeholder="ex: 10000" style={{width:"70%"}} required={true} />
                                            </div>
                                            <div className="col">
                                                <input type="submit" className="editor-btn main big my-5" value="Send tokens" />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-12" style={{textAlign:"center"}}>
                                        <p className="Title my-3" style={{textAlign:"center"}}><b>Burn</b></p>
                                        <form className="d-flex" data-action="burn" onSubmit={this.doTokenFeature}>
                                            <div className="col">
                                                <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                                <input type="number" onChange={this.onChange} name="burnAmount" className="editor-input" placeholder="ex: 10000" style={{width:"70%"}}/>
                                            </div>
                                            <div className="col">
                                                <input type="submit" className="editor-btn main big my-5" value="Burn"/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                }

                {
                    this.state.viewSelection === 3 ?
                    <div className="row container-fluid my-4 mx-3">
                        <div className="row container-fluid">
                            {this.state.selectedToken.mintable ?
                                <form className="col-md-12" data-action="mint" onSubmit={this.doTokenFeature} style={{textAlign:"center"}}>
                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Mint  Example Token</b></p>
                                    <div className="d-flex">
                                        <div className="col">
                                            <p className="Title my-3" style={{textAlign:"center"}}>Receiver address</p>
                                            <input type="text" onChange={this.onChange} name="mintReceiver" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                        </div>
                                        <div className="col">
                                            <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                            <input type="number" onChange={this.onChange} name="mintAmount" className="editor-input" placeholder="ex: 10000" style={{width:"70%"}}/>
                                        </div>
                                        <div className="col">
                                            <input type="submit" className="editor-btn main big my-5" value="Mint"/>
                                        </div>
                                    </div>
                                </form>
                            :
                                null
                            }

                            {this.state.selectedToken.freezable ?
                                <div className="col-md-12">
                                    <form className="col-md-12 mb-5" data-action="freeze" onSubmit={this.doTokenFeature} style={{textAlign:"center"}}>
                                        <p className="Title my-3" style={{textAlign:"center"}}><b>Freeze address</b></p>
                                        <div className="d-flex justify-content-center">
                                            <div className="col">
                                                <input type="text" onChange={this.onChange} name="freezeAddress" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
                                            </div>
                                            <div className="col">
                                                <input type="submit" className="editor-btn main big" value="Freeze"/>
                                            </div>
                                        </div>
                                    </form>
                                    <form className="col-md-12 mb-5" data-action="unfreeze" onSubmit={this.doTokenFeature} style={{textAlign:"center"}}>
                                        <p className="Title my-3" style={{textAlign:"center"}}><b>Unfreeze address</b></p>
                                        <div className="d-flex justify-content-center">
                                            <div className="col">
                                                <input type="text" onChange={this.onChange} name="unFreezeAddress" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
                                            </div>
                                            <div className="col">
                                                <input type="submit" className="editor-btn main big" value="Unfreeze"/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            :
                                null
                            }

                            {this.state.selectedToken.pausable ?
                                <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Stop/resume transactions</b></p>
                                    <div className="d-flex justify-content-center">
                                        <div className="col-md-6" style={{textAlign:"center"}}>
                                            <button data-action="pause" onClick={this.doTokenFeature} className="editor-btn main big" style={{width:"100%"}}><img src={window.location.origin + '/assets/images/icon_emergencystop.png'} /> Emergency pause</button> 
                                        </div>
                                        <div className="col-md-6" style={{textAlign:"center"}}>
                                            <button data-action="unpause" onClick={this.doTokenFeature} className="editor-btn main big" style={{width:"100%"}}><img src={window.location.origin + '/assets/images/icon_emergencystart.png'} /> Emergency resume</button> 
                                        </div>
                                    </div>
                                </div>
                            :
                                null
                            }

                            {this.state.selectedToken.pausable || this.state.selectedToken.freezable || this.state.selectedToken.mintable ?
                                <form data-action="transferOwnership" onSubmit={this.doTokenFeature} className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer ownership</b></p>
                                    <div className="d-flex justify-content-center">
                                        <div className="col">
                                            <input type="text" onChange={this.onChange} name="newOwner" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
                                        </div>
                                        <div className="col">
                                            <input type="submit" className="editor-btn main big" value="Transfer"/>
                                        </div>
                                    </div>
                                </form>
                            :
                                null
                            }
                        </div>
                    </div>
                    : null
                }
            </div>
          </div>
        </Modal>

        <footer className="footer">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-4" id="stats">
                <div className="row text-center main-color">
                  <div className="col">
                    <i className="fas fa-2x fa-user-friends"></i>
                    <p className="m-0">Unique users</p>
                    <p className="m-0">13433</p>
                  </div>
                  <div className="col">
                    <i className="fas fa-2x fa-shopping-cart"></i>
                    <p className="m-0">ICO buyers</p>
                    <p className="m-0">189</p>
                  </div>
                  <div className="col">
                    <i className="fas fa-2x fa-dollar-sign"></i>
                    <p className="m-0">Total investment</p>
                    <p className="m-0">$56542</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
    );
  }
}

export default Tokens;
