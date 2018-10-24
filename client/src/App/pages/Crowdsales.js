import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import Modal                from 'react-modal';
import { controllerAbi, tokenAbi, crowdsaleAbi, controllerAddress } from './../components/ContractStore';

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

const buttonStyle = {
    border        : 'none',
    // padding       : '0',
    fontSize      : '13px',
    background    : 'inherit',
    color         : 'white',
    cursor        : 'pointer',
};

Modal.setAppElement('#modal')

class Crowdsales extends Component {

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
        selectedContract   : {
            token: {},
            crowdsale: {},
            stage: {}
        }
    };

    this.openModal        = this.openModal.bind(this);
    this.afterOpenModal   = this.afterOpenModal.bind(this);
    this.closeModal       = this.closeModal.bind(this);
    this.showOne          = this.showOne.bind(this);
    this.showTwo          = this.showTwo.bind(this);
    this.showThree        = this.showThree.bind(this);
  }

  componentDidMount() {
    document.body.id="";
    this.showContracts();
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchAddresses() {
    // Controller contract
    const controllerInstance = web3Context.eth.contract(controllerAbi).at(controllerAddress);

    return new Promise((resolve, reject) => {
        controllerInstance.getUserCrowdsales(web3Context.eth.coinbase, (error, result) => {
            if (!error)
                return resolve(result);
            else
                return reject(error)
        })
    })
  }

  showContracts() {
    this.fetchAddresses()
    .then(value => {
        this.fetchInfoAddresses(value)
        .then(fetchedContracts => {
            if(this._isMounted) {
                this.setState({ contracts: fetchedContracts });
            }
        })
    })
  }

  fetchInfoAddresses = (addresses) => {
    return new Promise((resolve, reject) => {
        const crowdsaleContract = web3Context.eth.contract(crowdsaleAbi);
        let fetchedContracts = [];

        addresses.forEach(address => {
            const crowdsaleInstance = crowdsaleContract.at(address);
            new Promise((resolve, reject) => {
                crowdsaleInstance.getState((error, response) => {
                    if(!error)
                        return resolve(response)
                    else
                        return reject(error)
                })
            }).then(data => {
                let contract = {
                    walletAddress: web3Context.toChecksumAddress(data[0]),
                    weiRaised: web3Context.fromWei( Number(data[1]), 'ether'),
                    tokensSold: web3Context.fromWei( Number(data[2]), 'ether'),
                    buyersAmount: Number(data[3]),
                    creationDate: Number(data[4]),
                    whitelisting: data[5],
                    burnUnsoldTokens: data[6],
                    fixDates: data[7],
                    address: address
                }
                fetchedContracts.push(contract);
                if(fetchedContracts.length === addresses.length) {
                    return resolve(fetchedContracts);
                }
            })
        })
    })
  }

  toggleSidenav() {

    var css = (this.state.showHideSidenav === "active") ? "" : "active";
    this.setState({"showHideSidenav"  :css});
  }

  openModal(contract) {
    this.fetchContractInfo(contract.address);
    this.setState({
        modalIsOpen: true
    });
  }

  unixToDate = (timestamp) => {
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

  fetchContractInfo(address) {
    // Crowdsale instance
    const crowdsaleContract = web3Context.eth.contract(crowdsaleAbi);
    const crowdsaleInstance = crowdsaleContract.at(address);

    // Token instance
    const tokenContract = web3Context.eth.contract(tokenAbi);

    // Getting the main state
    const crowdsale = new Promise((resolve, reject) => {
        crowdsaleInstance.getState((error, response) => {
            if(!error) return resolve(response)
            else return reject(error)
        })
    }).then((data) => {
        return new Promise((resolve, reject) => {
            if(data[7]) {
                crowdsaleInstance.getSingleStageInfo((error, response) => {
                    if(!error) {
                        return resolve([data, response])
                    }
                    else
                        return reject(error)
                })
            } else {
                crowdsaleInstance.getMultistageInfo((error, response) => {
                    if(!error) {
                        return resolve(response, response)
                    }
                    else
                        return reject(error)
                })
            }
        })
    })

    const token = new Promise((resolve, reject) => {
        crowdsaleInstance.token((error, response) => {
            if(!error) return resolve(response)
            else return reject(error)
        })
    }).then((hash) => {
        return new Promise((resolve, reject) => {
            tokenContract.at(hash).getState((error, response) => {
                if(!error) {
                    response.push(hash);
                    return resolve(response)
                }
                else return reject(error)
            })
        })
    })

    Promise.all([crowdsale, token])
    .then((values) => {
        const crowdsale = values[0][0];
        const stage = values[0][1];
        const token = values[1];

        const tokenState = {
            name: token[0],
            symbol: token[1],
            decimals: Number(token[2]),
            totalSupply: web3Context.fromWei( Number(token[3]), 'ether'),
            pausable: token[4],
            freezable: token[5],
            mintable: token[6],
            creationDate: this.unixToDate(Number(token[7])),
            contractAddress: token[8]
        }

        const crowdaleState = {
            fundsAddress: crowdsale[0],
            weiRaised: web3Context.fromWei( Number(crowdsale[1]), 'ether'),
            tokensSold: web3Context.fromWei( Number(crowdsale[2]), 'ether'),
            buyersAmount: Number(crowdsale[3]),
            creationDate: this.unixToDate(Number(crowdsale[4])),
            whitelisting: crowdsale[5],
            burnUnsold: crowdsale[6],
            fixDates: crowdsale[7],
            contractAddress: address,
        }

        let stageState = {};

        if(crowdaleState.fixDates)
            stageState = {
                rate: Number(stage[0]),
                availableTokens: web3Context.fromWei( Number(stage[1]), 'ether'),
                startDate: this.unixToDate(Number(stage[2])),
                finishDate: this.unixToDate(Number(stage[3])),
                minLimit: web3Context.fromWei( Number(stage[4]), 'ether'),
                maxLimit: web3Context.fromWei( Number(stage[5]), 'ether'),
            }
        else {
            if(stage[0] === 0 && stage[1] === 0 && stage[2] === 0 && stage[3] === 0)
                stageState = "No active stages"
            else
                stageState = {
                    rate: Number(stage[0]),
                    availableTokens: web3Context.fromWei( Number(stage[1]), 'ether'),
                    startDate: this.unixToDate(Number(stage[2])),
                    finishDate: this.unixToDate(Number(stage[3])),
                }
        }

        console.log(crowdaleState);
        console.log(stageState);

        this.setState({
            selectedContract : {
                token: tokenState,
                crowdsale: crowdaleState,
                stage: stageState,
            }
        });
    });

  }


  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
                <li>
                    <a href="/tokens"><i className="fas fa-lg fa-coins"></i> Tokens</a>
                </li>
                <li className="selected-li">
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
                <h2 className="text-uppercase">My Crowdsales</h2>
              </div>
                <div className="row my-4">
                    <Link to={'/addCrowdsale'} className="nav-link">
                        <button className="editor-btn main big" onClick={this.openModal}><i className="fa fa-plus-circle"></i>&nbsp;&nbsp; Create Crowdsale</button>
                    </Link>
                </div>

                <div className="col table-responsive editor-block my-4">
                    { this.state.contracts.length ?
                        <table className="table" bordercolor="white">
                            <thead style={{fontSize:"15px", textAlign:"center"}}>
                                <tr style={{border:"none"}}>
                                    <th style={{border:"none"}}>Id</th>
                                    <th style={{border:"none"}}>Raised ETH</th>
                                    <th style={{border:"none"}}>Tokens Sold</th>
                                    <th style={{border:"none"}}>Buyers Amount</th>
                                    <th style={{border:"none"}}>Funds address</th>
                                    <th style={{border:"none"}}>Address</th>
                                    <th style={{border:"none"}}>Settings</th>
                                </tr>
                            </thead>
                            <tbody style={{fontSize:"13px", textAlign:"center"}}>
                                { this.state.contracts.map((contract, i) => (
                                    <tr key={i}>
                                        <td className="align-middle">{ i + 1 }</td>
                                        <td className="align-middle">{contract.weiRaised}</td>
                                        <td className="align-middle">{contract.tokensSold}</td>
                                        <td className="align-middle">{contract.buyersAmount}</td>
                                        <td className="align-middle">
                                            <a href={"https://rinkeby.etherscan.io/address/" + contract.walletAddress} style={{color: "#45467e", maxWidth: "120px", wordBreak:"break-all"}} target="_blank">{contract.walletAddress}</a>
                                        </td>
                                        <td className="align-middle">
                                            <a href={"https://rinkeby.etherscan.io/address/" + contract.address} style={{color: "#45467e", maxWidth: "120px", wordBreak:"break-all"}} target="_blank">{contract.address}</a>
                                        </td>
                                        <td className="align-middle">
                                            <input type="button" className="editor-btn main small" onClick={() => this.openModal(contract)} value="Manage" />
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
                    this.state.viewSelection == 1 ?
                      <button className="row text-center align-items-center editor-button selected-li" onClick={this.showOne}>
                        <div className="col">
                          <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_info_white.png'} /></p>
                          <p className="Amount">Info</p>
                        </div>
                      </button>
                      :
                      <button className="row text-center align-items-center editor-button" onClick={this.showOne}>
                        <div className="col">
                          <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_info_blue.png'} /></p>
                          <p className="Amount">Info</p>
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
              </div>
              <hr/>

              {
                this.state.viewSelection == 1 ?
                <div className="row justify-content-center my-5">
                    <div className="col">
                        <div className="row justify-content-center">
                            <h3>Crowdsale info</h3>
                            <div className="w-100"></div>
                            <div className="col-md-6">
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>ETH raised</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.weiRaised}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Investors amount</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.buyersAmount}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Whitelisting</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedContract.crowdsale.whitelisting).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Created at</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.creationDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Tokens sold</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.tokensSold}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Funds wallet</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}><a href={"https://rinkeby.etherscan.io/address/" + this.state.selectedContract.crowdsale.fundsAddress +"/"} target="_blank">Here</a></p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Burn unsold tokens</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedContract.crowdsale.burnUnsold).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>ICO type</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.fixDates ? "Single stage" : "Multi stage"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12" style={{textAlign:"center"}}>
                                <a href={"https://rinkeby.etherscan.io/address/" + this.state.selectedContract.crowdsale.contractAddress} style={{color: "#45467e"}} target="_blank">See crowdsale contract in Etherscan</a>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row justify-content-center">
                            <h3>Token info</h3>
                            <div className="w-100"></div>
                            <div className="col-md-6">
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Name</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.token.name}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Symbol</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.token.symbol}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Decimals</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.token.decimals}</p>
                                    </div>
                                </div>
                               <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Creation date</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.token.creationDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Total supply</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.token.totalSupply}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Pausable</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedContract.token.pausable).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Freezable</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedContract.token.freezable).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group my-5">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Mintable</p>
                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedContract.token.freezable).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12" style={{textAlign:"center"}}>
                                <a href={"https://rinkeby.etherscan.io/token/" + this.state.selectedContract.token.contractAddress} style={{color: "#45467e"}} target="_blank">See token contract in Etherscan</a>
                            </div>
                        </div>
                    </div>
                </div>
                : null
              }

              {
                this.state.viewSelection == 2 ?
                <div className="row container-fluid my-4 mx-3">
                  <div className="row container-fluid">
                    <div className="col-md-12 form-group">
                      <div className="row">
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <p className="Title my-3" style={{textAlign:"center"}}><b>Start new stage</b></p>
                            <div className="d-flex align-items-center">
                                <div className="col-md-4">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Tokens amount</p>
                                        <input type="text" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                    </div>
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center"}}>Start date</p>
                                        <input type="date" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center" }}>Token price</p>
                                        <input type="text" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                    </div>
                                    <div className="col">
                                        <p className="Title my-3" style={{textAlign:"center" }}>Finish date</p>
                                        <input type="date" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <button className="editor-btn main big m-0"><img src={window.location.origin + '/assets/images/icon_sendtoken.png'} /> Send tokens</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer Example Token</b></p>
                            <div className="d-flex align-items-end">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>ETH address</p>
                                    <input type="text" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                </div>
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                    <input type="text" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                </div>
                                <div className="col">
                                    <button className="editor-btn main big m-0"><img src={window.location.origin + '/assets/images/icon_sendtoken.png'} /> Start</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <p className="Title my-3" style={{textAlign:"center"}}><b>Stop/resume transactions (only owner)</b></p>
                            <div className="d-flex justify-content-center">
                                <div className="col-md-6" style={{textAlign:"center"}}>
                                    <button className="editor-btn main big" style={{width:"100%"}}><img src={window.location.origin + '/assets/images/icon_emergencystop.png'} /> Emergency stop</button>
                                </div>
                                <div className="col-md-6" style={{textAlign:"center"}}>
                                    <button className="editor-btn main big" style={{width:"100%"}}><img src={window.location.origin + '/assets/images/icon_emergencystart.png'} /> Emergency start</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <div className="d-flex justify-content-center">
                                <div className="col-md-6" style={{textAlign:"center"}}>
                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Finalize crowdsale</b></p>
                                    <button className="editor-btn main big" style={{width:"100%"}}>Finalize</button>
                                </div>
                                <div className="col-md-6" style={{textAlign:"center"}}>
                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Burn unsold tokens</b></p>
                                    <button className="editor-btn main big" style={{width:"100%"}}>Burn</button>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                : null
              }

              {
                this.state.viewSelection == 3 ?
                <div className="row container-fluid my-4 mx-3">
                    <div className="row container-fluid">
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <p className="Title my-3" style={{textAlign:"center"}}><b>Mint  Example Token</b></p>
                            <div className="d-flex align-items-end">
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center"}}>Receiver address</p>
                                    <input type="text" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                </div>
                                <div className="col">
                                    <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                    <input type="text" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                </div>
                                <div className="col">
                                    <button className="editor-btn main big m-0"><img src={window.location.origin + '/assets/images/icon_sendtoken.png'} /> Mint tokens</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer ownership (only owner)</b></p>
                            <div className="d-flex justify-content-center">
                                <div className="col">
                                    <input type="text" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
                                </div>
                                <div className="col">
                                    <button className="editor-btn main big mx-5">Change</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <p className="Title my-3" style={{textAlign:"center"}}><b>Block account (only owner)</b></p>
                            <div className="d-flex justify-content-center">
                                <div className="col">
                                    <input type="text" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
                                </div>
                                <div className="col">
                                    <button className="editor-btn main big mx-5">Block</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                            <p className="Title my-3" style={{textAlign:"center"}}><b>Unblock account (only owner)</b></p>
                            <div className="d-flex justify-content-center">
                                <div className="col">
                                    <input type="text" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
                                </div>
                                <div className="col">
                                    <button className="editor-btn main big mx-5">Unblock</button>
                                </div>
                            </div>
                        </div>
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

export default Crowdsales;
