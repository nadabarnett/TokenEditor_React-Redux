import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import Modal                from 'react-modal';
import { controllerAbi, tokenAbi, crowdsaleAbi, controllerAddress } from './../components/ContractStore';

const web3Context = window.web3;

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

    fetchInfoAddresses(addresses) {
        return new Promise((resolve, reject) => {
            const crowdsaleContract = web3Context.eth.contract(crowdsaleAbi);
            let fetchedContracts = [];

            addresses.forEach(address => {
                const crowdsaleInstance = crowdsaleContract.at(address);

                new Promise((resolve, reject) => {
                    crowdsaleInstance.getState((error, response) => {
                        if(!error)
                            resolve(response)
                        else
                            reject(error)
                    })
                }).then(data => {
                    const contract = {
                        weiRaised: web3Context.fromWei( Number(data[1]), 'ether'),
                        tokensSold: web3Context.fromWei( Number(data[2]), 'ether'),
                        buyersAmount: Number(data[3]),
                        address: address,
                        availableTokens: web3Context.fromWei( Number(data[8]), 'ether'),
                    }
                    fetchedContracts.push(contract);
                    if(fetchedContracts.length === addresses.length) {
                        resolve(fetchedContracts);
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

    detectValue = (e) => {
        const target = e.target;
        const name = target.name;
        let value;

        if(target.type === 'checkbox')
            value = target.checked;
        else if(target.type === 'number')
            value = parseInt(target.value)
        else
            value = target.value;

        if(Number.isNaN(value)) value = 0;

        return [name, value];
    }

    onTokenChange = (e) => {
        const [ name, value ] = this.detectValue(e);
        this.setState( prevState => {
            return {
                selectedContract : {
                    ...prevState.selectedContract,
                    token : {
                        ...prevState.selectedContract.token,
                        features: {
                            ...prevState.selectedContract.token.features,
                            [name]: value
                        }
                    }
                }
            }
        });
    }

    onCrowdsaleChange = (e) => {
        const [ name, value ] = this.detectValue(e);
        this.setState( prevState => {
            return {
                selectedContract : {
                    ...prevState.selectedContract,
                    crowdsale : {
                        ...prevState.selectedContract.crowdsale,
                        features: {
                            ...prevState.selectedContract.crowdsale.features,
                            [name]: value
                        }
                    }
                }
            }
        });
    }

    isAddressValid = (address) => {
        if(web3Context.isAddress(address))
            return true
        else
            alert("The address is not a valid ETH address, please check it.")
            return false;
    }

    doFeature = (e) => {
        e.preventDefault();

        const tokenContract = web3Context.eth.contract(tokenAbi);
        const tokenInstance = tokenContract.at(this.state.selectedContract.token.contractAddress);

        const crowdsaleContract = web3Context.eth.contract(crowdsaleAbi);
        const crowdsaleInstance = crowdsaleContract.at(this.state.selectedContract.crowdsale.contractAddress);

        const action = e.target.dataset.action;
        let address, value;

        switch (action) {
            case 'crowdsaleBurnUnsold':
                crowdsaleInstance.transferOwnership((err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'crowdsaleChangeOwner':
                address = web3Context.toChecksumAddress(this.state.selectedContract.crowdsale.features.newOwnerAddress);
                crowdsaleInstance.transferOwnership(address, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'crowdsaleChangeRate':
                address  = web3Context.toChecksumAddress(this.state.selectedContract.crowdsale.features.newRate);
                crowdsaleInstance.changeRate(address, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'crowdsaleChangeFunds':
                address  = web3Context.toChecksumAddress(this.state.selectedContract.crowdsale.features.newFundAddress);
                if(!this.isAddressValid(address)) break;
                crowdsaleInstance.changeFundsAddress(address, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'crowdsaleAddToWhitelist':
                address = web3Context.toChecksumAddress(this.state.selectedContract.crowdsale.features.whitelistAddress);
                if(!this.isAddressValid(address)) break;
                crowdsaleInstance.addToWhiteList(address, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'crowdsaleTransfer':
                value = this.toBigNumber(this.state.selectedContract.crowdsale.features.transferAmount);
                address  = web3Context.toChecksumAddress(this.state.selectedContract.crowdsale.features.transferTo);
                if(!this.isAddressValid(address)) break;
                crowdsaleInstance.transferTokensToNonEthBuyers(address, value, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'transfer':
                value = this.toBigNumber(this.state.selectedContract.token.features.transferAmount);
                address  = web3Context.toChecksumAddress(this.state.selectedContract.token.features.transferTo);
                if(!this.isAddressValid(address)) break;
                tokenInstance.transfer(address, value, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'burn':
                value = this.toBigNumber(this.state.selectedContract.token.features.burnAmount);
                tokenInstance.burn(value, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'mint':
                value = this.toBigNumber(this.state.selectedContract.token.features.mintAmount);
                address  = web3Context.toChecksumAddress(this.state.selectedContract.token.features.mintReceiver);
                if(!this.isAddressValid(address)) break;
                tokenInstance.mint(address, value, (err, txHash) => {
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
                address  = web3Context.toChecksumAddress(this.state.selectedContract.token.features.freezeAddress);
                if(!this.isAddressValid(address)) break;
                tokenInstance.freezeAccount(address, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'unfreeze':
                address  = web3Context.toChecksumAddress(this.state.selectedContract.token.features.unFreezeAddress);
                if(!this.isAddressValid(address)) break;
                tokenInstance.unFreezeAccount(address, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            case 'transferOwnership':
                address  = web3Context.toChecksumAddress(this.state.selectedContract.token.features.newOwner);
                if(!this.isAddressValid(address)) break;
                tokenInstance.transferOwnership(address, (err, txHash) => {
                    if (!err) console.log('https://rinkeby.etherscan.io/tx/' + txHash);
                })
                break;
            default:
                break;
        }
    }

    toBigNumber(amount) {
        const decimals = web3Context.toBigNumber(this.state.selectedContract.token.decimals);
        const bigNumber = web3Context.toBigNumber(amount);
        const value = bigNumber.times(web3Context.toBigNumber(10).pow(decimals));

        return value;
    }

    unixToDate(timestamp) {
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
                        if(!error)
                            return resolve([data, response])
                        else
                            return reject(error)
                    })
                } else {
                    crowdsaleInstance.getMultistageInfo((error, response) => {
                        if(!error)
                            return resolve([data, response])
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
                contractAddress: token[8],
                features: {}
            }
            const crowdsaleState = {
                fundsAddress: crowdsale[0],
                weiRaised: web3Context.fromWei( Number(crowdsale[1]), 'ether'),
                tokensSold: web3Context.fromWei( Number(crowdsale[2]), 'ether'),
                buyersAmount: Number(crowdsale[3]),
                creationDate: this.unixToDate(Number(crowdsale[4])),
                whitelisting: crowdsale[5],
                burnUnsold: crowdsale[6],
                fixDates: crowdsale[7],
                availableTokens: web3Context.fromWei( Number(stage[8]), 'ether'),
                contractAddress: address,
                features: {}
            }

            let stageState = {};

            if(crowdsaleState.fixDates) {
                stageState = {
                    rate: Number(stage[0]),
                    tokensForSale: web3Context.fromWei( Number(stage[1]), 'ether'),
                    minLimit: web3Context.fromWei( Number(stage[2]), 'ether'),
                    maxLimit: web3Context.fromWei( Number(stage[3]), 'ether'),
                    startDate: stage[4] != 0 ? this.unixToDate(Number(stage[4])) : 'Not setted',
                    finishDate: stage[5] != 1924981199 ? this.unixToDate(Number(stage[5])) : 'Not setted',
                    issue: false
                }}
            else {
                if(Number(stage[0]) != 0)
                    stageState = {
                        rate: Number(stage[0]),
                        tokensForSale: web3Context.fromWei( Number(stage[1]), 'ether'),
                        minLimit: web3Context.fromWei( Number(stage[4]), 'ether'),
                        maxLimit: web3Context.fromWei( Number(stage[5]), 'ether'),
                        startDate: stage[2] != 0 ? this.unixToDate(Number(stage[2])) : 'Not setted',
                        finishDate: stage[3] != 1924981199 ? this.unixToDate(Number(stage[3])) : 'Not setted',
                        issue: false
                    }
                else
                    stageState = {
                        issue: true
                    }
            }

            this.setState({
                selectedContract : {
                    token: tokenState,
                    crowdsale: crowdsaleState,
                    stage: stageState,
                }
            });
        });

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
                                <button className="editor-btn main big"><i className="fa fa-plus-circle"></i>&nbsp;&nbsp; Create Crowdsale</button>
                            </Link>
                        </div>
                        <div className="col table-responsive editor-block my-4">
                            { this.state.contracts.length ?
                            <table className="table" bordercolor="white">
                            <thead style={{fontSize:"15px", textAlign:"center"}}>
                            <tr style={{border:"none"}}>
                                <th style={{border:"none"}}>Id</th>
                                <th style={{border:"none"}}>Available tokens</th>
                                <th style={{border:"none"}}>Tokens Sold</th>
                                <th style={{border:"none"}}>Raised ETH</th>
                                <th style={{border:"none"}}>Buyers Amount</th>
                                <th style={{border:"none"}}>Address</th>
                                <th style={{border:"none"}}>Settings</th>
                            </tr>
                            </thead>
                            <tbody style={{fontSize:"13px", textAlign:"center"}}>
                            { this.state.contracts.map((contract, i) => (
                            <tr key={i}>
                                <td className="align-middle">{ i + 1 }</td>
                                <td className="align-middle">{contract.availableTokens}</td>
                                <td className="align-middle">{contract.tokensSold}</td>
                                <td className="align-middle">{contract.weiRaised}</td>
                                <td className="align-middle">{contract.buyersAmount}</td>
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
                                                <p className="Title" style={{textAlign:"right"}}>Manage Crowdsale</p>
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
                                        <p className="Amount">Crowdsale features</p>
                                    </div>
                                </button>
                                :
                                <button className="row text-center align-items-center editor-button" onClick={this.showTwo}>
                                    <div className="col">
                                        <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_ico_blue.png'} /></p>
                                        <p className="Amount">Crowdsale features</p>
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
                                        <p className="Amount">Token features</p>
                                    </div>
                                </button>
                                :
                                <button className="row text-center align-items-center editor-button" onClick={this.showThree}>
                                    <div className="col">
                                        <p className="Title my-3"><img src={window.location.origin + '/assets/images/icon_ico_blue.png'} /></p>
                                        <p className="Amount">Token features</p>
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
                                    <h3 className="d-block">Crowdsale info</h3>
                                    <div className="w-100"></div>

                                    { this.state.selectedContract.stage.issue ? <h5 className="d-block"><i>No active rounds at this moment</i></h5> : null }
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
                                            <p className="Title my-3" style={{textAlign:"center"}}>Tokens sold</p>
                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.tokensSold}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-12 form-group my-5">
                                            <div className="col">
                                            <p className="Title my-3" style={{textAlign:"center"}}>Whitelisting</p>
                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedContract.crowdsale.whitelisting).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        {this.state.selectedContract.crowdsale.fixDates ?
                                            <div className="col-md-12 form-group my-5">
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>Start date</p>
                                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.startDate}</p>
                                                </div>
                                            </div>
                                            :
                                            !this.state.selectedContract.stage.issue ?
                                                <div className="col-md-12 form-group my-5">
                                                    <div className="col">
                                                        <p className="Title my-3" style={{textAlign:"center"}}>Round start date</p>
                                                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.startDate}</p>
                                                    </div>
                                                </div>
                                            :
                                                null
                                        }
                                        {this.state.selectedContract.crowdsale.fixDates ?
                                            <div className="col-md-12 form-group my-5">
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>Minimum investment</p>
                                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.minLimit}</p>
                                                </div>
                                            </div>
                                            :
                                            !this.state.selectedContract.stage.issue ?
                                                <div className="col-md-12 form-group my-5">
                                                    {this.state.selectedContract.stage.startDate !== 0 ?
                                                        <div className="col">
                                                            <p className="Title my-3" style={{textAlign:"center"}}>Round minimum investment</p>
                                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.minLimit}</p>
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            :
                                                null
                                        }
                                        <div className="col-md-12 form-group my-5">
                                            <div className="col">
                                            <p className="Title my-3" style={{textAlign:"center"}}>Funds wallet</p>
                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}><a href={"https://rinkeby.etherscan.io/address/" + this.state.selectedContract.crowdsale.fundsAddress +"/"} target="_blank">Here</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="col-md-12 form-group my-5">
                                            <div className="col">
                                                <p className="Title my-3" style={{textAlign:"center"}}>Investors amount</p>
                                                <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.buyersAmount}</p>
                                            </div>
                                        </div>
                                        { !this.state.selectedContract.stage.issue ?
                                            <div className="col-md-12 form-group my-5">
                                                <div className="col">
                                                <p className="Title my-3" style={{textAlign:"center"}}>Initial tokens</p>
                                                <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.tokensForSale}</p>
                                                </div>
                                            </div>
                                        :
                                            null
                                        }
                                        <div className="col-md-12 form-group my-5">
                                            <div className="col">
                                            <p className="Title my-3" style={{textAlign:"center"}}>Burn unsold tokens</p>
                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{String(this.state.selectedContract.crowdsale.burnUnsold).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        {this.state.selectedContract.crowdsale.fixDates ?
                                            <div className="col-md-12 form-group my-5">
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>Finish date</p>
                                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.finishDate}</p>
                                                </div>
                                            </div>
                                            :
                                            !this.state.selectedContract.stage.issue ?
                                                <div className="col-md-12 form-group my-5">
                                                    {this.state.selectedContract.stage.startDate !== 0 ?
                                                        <div className="col">
                                                            <p className="Title my-3" style={{textAlign:"center"}}>Round finish date</p>
                                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.finishDate}</p>
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            :
                                                null
                                        }
                                        {this.state.selectedContract.crowdsale.fixDates ?
                                            <div className="col-md-12 form-group my-5">
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>Maximum investment</p>
                                                    <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.maxLimit}</p>
                                                </div>
                                            </div>
                                            :
                                            !this.state.selectedContract.stage.issue ?
                                                <div className="col-md-12 form-group my-5">
                                                    {this.state.selectedContract.stage.startDate !== 0 ?
                                                        <div className="col">
                                                            <p className="Title my-3" style={{textAlign:"center"}}>Round maximum investment</p>
                                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.stage.maxLimit}</p>
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            :
                                                null
                                        }
                                        <div className="col-md-12 form-group my-5">
                                            <div className="col">
                                            <p className="Title my-3" style={{textAlign:"center"}}>ICO type</p>
                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.fixDates ? "Single stage" : "Multi stage"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 form-group">
                                            <div className="col">
                                            <p className="Title my-3" style={{textAlign:"center"}}>Created at</p>
                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>{this.state.selectedContract.crowdsale.creationDate}</p>
                                            </div>
                                        </div>
                                    <div className="col-md-12" style={{textAlign:"center"}}>
                                        <hr className="mb-4" />
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
                                            <p className="Title my-3" style={{textAlign:"center"}}>Funds wallet</p>
                                            <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}><a href={"https://rinkeby.etherscan.io/address/" + this.state.selectedContract.crowdsale.fundsAddress +"/"} target="_blank">Here</a></p>
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
                                        <hr className="mb-4" />
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
                                            <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer tokens to non ETH buyers</b></p>
                                            <form className="d-flex" data-action="crowdsaleTransfer" onSubmit={this.doFeature}>
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>ETH address</p>
                                                    <input type="text" onChange={this.onCrowdsaleChange} name="transferTo" className="editor-input" placeholder="0x..." style={{width:"70%"}} required={true} />
                                                </div>
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                                    <input type="number" onChange={this.onCrowdsaleChange} name="transferAmount" className="editor-input" placeholder="ex: 10000" style={{width:"70%"}} required={true} />
                                                </div>
                                                <div className="col">
                                                    <input type="submit" className="editor-btn main big my-5" value="Transfer" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                            <p className="Title my-3" style={{textAlign:"center"}}><b>Add address to whitelist</b></p>
                                            <form className="d-flex" data-action="crowdsaleAddToWhitelist" onSubmit={this.doFeature}>
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>Address</p>
                                                    <input type="text" onChange={this.onCrowdsaleChange} name="whitelistAddress" className="editor-input" placeholder="0x..." style={{width:"70%"}} required={true} />
                                                </div>
                                                <div className="col">
                                                    <input type="submit" className="editor-btn main big my-5" value="Add" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                            <p className="Title my-3" style={{textAlign:"center"}}><b>Change funds address</b></p>
                                            <form className="d-flex" data-action="crowdsaleChangeFunds" onSubmit={this.doFeature}>
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>New fund address</p>
                                                    <input type="text" onChange={this.onCrowdsaleChange} name="newFundAddress" className="editor-input" placeholder="0x..." style={{width:"70%"}} required={true} />
                                                </div>
                                                <div className="col">
                                                    <input type="submit" className="editor-btn main big my-5" value="Change" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                            <p className="Title my-3" style={{textAlign:"center"}}><b>Change the rate of token</b></p>
                                            <form className="d-flex" data-action="crowdsaleChangeRate" onSubmit={this.doFeature}>
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>New rate</p>
                                                    <input type="number" onChange={this.onCrowdsaleChange} name="newRate" className="editor-input" placeholder="1000" style={{width:"70%"}} required={true} />
                                                </div>
                                                <div className="col">
                                                    <input type="submit" className="editor-btn main big my-5" value="Change" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                            <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer ownerhsip</b></p>
                                            <form className="d-flex" data-action="crowdsaleChangeOwner" onSubmit={this.doFeature}>
                                                <div className="col">
                                                    <p className="Title my-3" style={{textAlign:"center"}}>New owner</p>
                                                    <input type="text" onChange={this.onCrowdsaleChange} name="newOwnerAddress" className="editor-input" placeholder="0x..." style={{width:"70%"}} required={true} />
                                                </div>
                                                <div className="col">
                                                    <input type="submit" className="editor-btn main big my-5" value="Change" />
                                                </div>
                                            </form>
                                        </div>
                                        {this.state.selectedContract.crowdsale.burnUnsold ?
                                                <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Burn all unsold tokens (be careful)</b></p>
                                                    <div className="d-flex justify-content-center">
                                                        <div className="col-md-12" style={{textAlign:"center"}}>
                                                            <button data-action="crowdsaleBurnUnsold" onClick={this.doFeature} className="editor-btn main big" style={{width:"100%"}}><img src={window.location.origin + '/assets/images/icon_emergencystop.png'} /> Burn</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            :
                                                null
                                        }
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
                                    <div className="col-md-12 form-group">
                                        <div className="row">
                                            <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                                <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer {this.state.selectedContract.token.name}</b></p>
                                                <form className="d-flex" data-action="transfer" onSubmit={this.doFeature}>
                                                    <div className="col">
                                                        <p className="Title my-3" style={{textAlign:"center"}}>ETH address</p>
                                                        <input type="text" onChange={this.onTokenChange} name="transferTo" className="editor-input" placeholder="Text" style={{width:"70%"}} required={true} />
                                                    </div>
                                                    <div className="col">
                                                        <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                                        <input type="number" onChange={this.onTokenChange} name="transferAmount" className="editor-input" placeholder="ex: 10000" style={{width:"70%"}} required={true} />
                                                    </div>
                                                    <div className="col">
                                                        <input type="submit" className="editor-btn main big my-5" value="Send tokens" />
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                                <p className="Title my-3" style={{textAlign:"center"}}><b>Burn</b></p>
                                                <form className="d-flex" data-action="burn" onSubmit={this.doFeature}>
                                                    <div className="col">
                                                        <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                                        <input type="number" onChange={this.onTokenChange} name="burnAmount" className="editor-input" placeholder="ex: 10000" style={{width:"70%"}}/>
                                                    </div>
                                                    <div className="col">
                                                        <input type="submit" className="editor-btn main big my-5" value="Burn"/>
                                                    </div>
                                                </form>
                                            </div>
                                            {this.state.selectedContract.token.mintable ?
                                                <form className="col-md-12 mb-5" data-action="mint" onSubmit={this.doFeature} style={{textAlign:"center"}}>
                                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Mint {this.state.selectedContract.token.symbol} Token</b></p>
                                                    <div className="d-flex">
                                                        <div className="col">
                                                            <p className="Title my-3" style={{textAlign:"center"}}>Receiver address</p>
                                                            <input type="text" onChange={this.onTokenChange} name="mintReceiver" className="editor-input" placeholder="Text" style={{width:"70%"}}/>
                                                        </div>
                                                        <div className="col">
                                                            <p className="Title my-3" style={{textAlign:"center" }}>Amount of tokens</p>
                                                            <input type="number" onChange={this.onTokenChange} name="mintAmount" className="editor-input" placeholder="ex: 10000" style={{width:"70%"}}/>
                                                        </div>
                                                        <div className="col">
                                                            <input type="submit" className="editor-btn main big my-5" value="Mint"/>
                                                        </div>
                                                    </div>
                                                </form>
                                            :
                                                null
                                            }

                                            {this.state.selectedContract.token.freezable ?
                                                <div className="col-md-12 mb-5">
                                                    <form className="col-md-12 mb-5" data-action="freeze" onSubmit={this.doFeature} style={{textAlign:"center"}}>
                                                        <p className="Title my-3" style={{textAlign:"center"}}><b>Freeze address</b></p>
                                                        <div className="d-flex justify-content-center">
                                                            <div className="col">
                                                                <input type="text" onChange={this.onTokenChange} name="freezeAddress" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
                                                            </div>
                                                            <div className="col">
                                                                <input type="submit" className="editor-btn main big" value="Freeze"/>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <form className="col-md-12 mb-5" data-action="unfreeze" onSubmit={this.doFeature} style={{textAlign:"center"}}>
                                                        <p className="Title my-3" style={{textAlign:"center"}}><b>Unfreeze address</b></p>
                                                        <div className="d-flex justify-content-center">
                                                            <div className="col">
                                                                <input type="text" onChange={this.onTokenChange} name="unFreezeAddress" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
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

                                            {this.state.selectedContract.token.pausable ?
                                                <div className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Stop/resume transactions</b></p>
                                                    <div className="d-flex justify-content-center">
                                                        <div className="col-md-6" style={{textAlign:"center"}}>
                                                            <button data-action="pause" onClick={this.doFeature} className="editor-btn main big" style={{width:"100%"}}><img src={window.location.origin + '/assets/images/icon_emergencystop.png'} /> Emergency pause</button> 
                                                        </div>
                                                        <div className="col-md-6" style={{textAlign:"center"}}>
                                                            <button data-action="unpause" onClick={this.doFeature} className="editor-btn main big" style={{width:"100%"}}><img src={window.location.origin + '/assets/images/icon_emergencystart.png'} /> Emergency resume</button> 
                                                        </div>
                                                    </div>
                                                </div>
                                            :
                                                null
                                            }

                                            {this.state.selectedContract.token.pausable || this.state.selectedContract.token.freezable || this.state.selectedContract.token.mintable ?
                                                <form data-action="transferOwnership" onSubmit={this.doFeature} className="col-md-12 mb-5" style={{textAlign:"center"}}>
                                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Transfer ownership</b></p>
                                                    <div className="d-flex justify-content-center">
                                                        <div className="col">
                                                            <input type="text" onChange={this.onTokenChange} name="newOwner" className="editor-input" placeholder="Address" style={{width:"70%"}}/>
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
