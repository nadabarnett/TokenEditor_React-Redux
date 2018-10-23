import React, { Component } from 'react';
import Switch from 'react-toggle-switch';
import { Link } from 'react-router-dom';
import { crowdsaleAbi, crowdsaleBytecode, tokenAbi, tokenBytecode } from './../components/ContractStore';
import Modal from 'react-modal';
import { parse } from 'url';

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

let initialState = {
    step: 1,
    user: web3Context.eth.coinbase,
    modalIsOpen: false,
    token: {
        name: '',
        symbol: '',
        decimals: 18,
        totalSupply: 0,
        erc223: false,
        pausable: false,
        freezable: false,
        mintable: false,
        receivers: [{
            address: web3Context.eth.coinbase,
            amount: '',
            frozen: false,
            untilDate: ''
        }]
    },
    ico: {
        owner: web3Context.eth.coinbase,
        fundsAddress: '',
        whitelisting: false,
        burnable: false
    },
    stages: {
        multiStages: false,
        tokensForSale: '',
        tokenPrice: '',
        startDate: '',
        finishDate: '',
        minInvest: '',
        maxInvest: '',
        rounds: [{
            tokensForSale: 0,
            tokenPrice: 0,
            startDate: '',
            finishDate: ''
        }]
    },
    transactions: {
        issue: '',
        token: {
            txHash: '',
            txUrl: '',
            address: '',
            url: '',
            status: 'Waiting'
        },
        crowdsale: {
            txHash: '',
            txUrl: '',
            address: '',
            url: '',
            status: 'Waiting'
        },
        settings: {
            txHash: '',
            txUrl: '',
            status: 'Waiting'
        },
        transfer: {
            txHash: '',
            txUrl: '',
            status: 'Waiting'
        },
    },
}

class AddCrowdsale extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;

        this.goToNext = this.goToNext.bind(this);
        this.goToPrev = this.goToPrev.bind(this);
        this.titles = [
            "Token Setup",
            "ICO Setup",
            "Stages",
            "Token distribution (team, advisors ...)",
            "Review and Publish"
        ]
    }

    goToNext = (e) => {
        e.preventDefault();
        switch (this.state.step) {
            case 3:
                this.state.stages.multiStages ? this.calculateTokensMultiStage() : null;
                break;
            case 4:
                this.state.token.receivers.length > 1 ? this.calculateTotalSupply() : null;
                break;
            default:
                break;
        }

        this.setState({ step : this.state.step + 1 });
    }

    goToPrev = (e) => {
        e.preventDefault();
        this.setState({ step: this.state.step - 1 });
    }

    toggleSwitch = () => {
        switch (this.state.step) {
            case 1:
                this.setState( prevState => {
                    return {
                        token : {
                            ...prevState.token,
                            erc223: !this.state.token.erc223
                        }
                    };
                });
                break;
            case 3:
                this.setState( prevState => {
                    return {
                        stages : {
                            ...prevState.stages,
                            multiStages: !this.state.stages.multiStages
                        }
                    };
                });
                break;
        }
    }

    ////
    //  Detect and update state
    ////

    onChange = (e) => {
        let target = e.target;
        let name = target.name;
        let value;

        if(target.type === 'checkbox')
            value = target.checked;
        else if(target.type === 'number')
            value = parseInt(target.value)
        else
            value = target.value;

        if(Number.isNaN(value)) value = 0;
        switch (this.state.step) {
            case 1:
                this.setState( prevState => {
                    return {
                        token : {
                            ...prevState.token,
                            [name]: value
                        }
                    }
                });
                break;
            case 2:
                this.setState( prevState => {
                    return {
                        ico : {
                            ...prevState.ico,
                            [name]: value
                        }
                    }
                });
                break;
            case 3:
                this.setState( prevState => {
                    return {
                        stages : {
                            ...prevState.stages,
                            [name]: value
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    onStagesChange = (id) => (e) => {
        let target = e.target;
        let name = target.name;
        let value;


        if(target.type === 'checkbox')
            value = target.checked;
        else if(target.type === 'number')
            value = parseInt(target.value)
        else
            value = target.value;

        if(Number.isNaN(value)) value = 0;
        const newRounds = this.state.stages.rounds.map((stage, i) => {
            if (id !== i) return stage;
            return {
                ...stage,
                [name]: value
            };
        });

        this.setState( prevState => {
            return {
                stages: {
                    ...prevState.stages,
                    rounds: newRounds
                }
            }
        });
    }

    ondistributionAddressesChange = (id) => (e) => {
        let target = e.target;
        let name = target.name;
        let value;

        if(target.type === 'checkbox')
            value = target.checked;
        else if(target.type === 'number')
            value = parseInt(target.value)
        else
            value = target.value;

        if(Number.isNaN(value)) value = 0;
        const newReceivers = this.state.token.receivers.map((receiver, i) => {
            if (id !== i) return receiver;
            return {
                ...receiver,
                [name]: value
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

    ////
    //  Calculating tokens amount
    ////

    calculateTotalSupply = () => {
        let amounts = this.state.token.receivers.map((receiver, i) => {
            return (receiver.amount != "" ? receiver.amount : 0);
        });
        let sum = amounts.reduce((a, b) => a + b, 0);
        sum += this.state.stages.tokensForSale;

        this.setState( prevState => {
            return {
                token: {
                    ...prevState.token,
                    totalSupply: sum
                }
            }
        });
    }

    calculateTokensMultiStage = () => {
        let amounts = this.state.stages.rounds.map((stage, i) => {
            return (stage.tokensAmount != "" ? stage.tokensAmount : 0);
        });
        let sum = amounts.reduce((a, b) => a + b, 0);
        this.setState( prevState => {
            return {
                stages: {
                    ...prevState.stages,
                    tokensForSale: sum
                }
            }
        });
    }

    toBigNumber = (amount) => {
        const decimals = web3Context.toBigNumber(this.state.token.decimals);
        const bigNumber = web3Context.toBigNumber(amount);
        const value = bigNumber.times(web3Context.toBigNumber(10).pow(decimals));

        return value;
    }

    ////
    //  Adding new items
    ////

    onAddStage = () => {
        const newRound = {
            tokensAmount: '',
            price: '',
            startDate: '',
            finishDate: ''
        };

        this.setState( prevState => {
            return {
                stages: {
                    ...prevState.stages,
                    rounds: prevState.stages.rounds.concat(newRound)
                }
            };
        });
    }

    onAddReceiver = () => {
        const newAddress = {
            address: '',
            amount: '',
            freezen: false,
            untilDate: ''
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

    ////
    //  Submit final form
    ////

    onSubmit = (e) => {
        e.preventDefault();

        this.setState({modalIsOpen: true});
        let tokenData = this.getTokenParams();
        let icoData = this.getCrowdsaleParams();

        this.tokenDeploy(tokenData)
        .then((tokenAddress) => {
            this.crowdsaleDeploy(tokenAddress, icoData)
            .then((crowdsaleAddress) => {
                this.transferTokens(crowdsaleAddress)
                .then(() => {
                    this.setUpStages(crowdsaleAddress);
                });
            })
        })
        .catch(error => {
            this.showIssue(error);
        });;
    }

    showIssue = (error) => {
        this.setState({
            transactions: {
                issue: "You made some issue in form, please check it again."
            }
        });
    }

    getUser = () => {
        let user = this.state.user;
        if(user !== this.state.ico.owner)
            alert("The owner of ICO is this address " + this.state.ico.owner +". Now you used this address " + user + ". Please switch account for continue and deploy the contract.")
        else return(user);
    }

    getTransactionReceiptMined = (txHash) => {
        return new Promise((resolve, reject) => {
            (function transactionReceiptAsync () {
                web3Context.eth.getTransactionReceipt(txHash, (error, receipt) => {
                    if (error) {
                        reject(error);
                    } else if (receipt == null) {
                        setTimeout(
                            () => transactionReceiptAsync()
                        , 1000);
                    } else {
                        resolve(receipt);
                    }
                });
            })();
        });
    };

    getTokenParams = () => {
        const tokenState = this.state.token;
        const tokenData = {
            name: tokenState.name.replace(/\s/g, ''),
            symbol: tokenState.symbol.replace(/\s/g, ''),
            decimals: tokenState.decimals,
            erc223: tokenState.erc223,
            pausable: tokenState.pausable,
            freezable: tokenState.freezable,
            mintable: tokenState.mintable,
            receivers: tokenState.receivers.map((receiver, i) => {
                receiver.address = web3Context.toChecksumAddress(receiver.address);
                return receiver.address;
            }),
            amounts: tokenState.receivers.map((receiver, i) => {
                if(i === 0)
                    receiver.amount = this.toBigNumber(this.state.stages.tokensForSale);
                else
                    receiver.amount = this.toBigNumber(receiver.amount);
                return receiver.amount;
            }),
            frozen: tokenState.receivers.map((receiver, i) => {
                return receiver.frozen;
            }),
            untilDate: tokenState.receivers.map((receiver, i) => {
                receiver.untilDate = receiver.untilDate ? (new Date(receiver.untilDate).getTime() / 1000) : '';
                return receiver.untilDate;
            })
        }
        return tokenData;
    }

    tokenDeploy = (token) => {
        const user = this.getUser();
        const newTokenContract = web3Context.eth.contract(tokenAbi);
        return new Promise((resolve, reject) => {
            newTokenContract.new(
                token.name,
                token.symbol,
                token.decimals,
                token.pausable,
                token.freezable,
                token.mintable,
                token.receivers,
                token.amounts,
                token.frozen,
                token.untilDate,
                {
                    from: user,
                    data: '0x' + tokenBytecode,
                    value: 1000000000000000000
                },
                (error, result) => {
                    if(!error)
                        if (!result.address)
                            this.setState( prevState => {
                                return {
                                    ...prevState,
                                    transactions : {
                                        ...prevState.transactions,
                                        token: {
                                            ...prevState.transactions.token,
                                            txHash: result.transactionHash,
                                            txUrl: "https://rinkeby.etherscan.io/tx/" + result.transactionHash,
                                            status: "Pending ..."
                                        }
                                    }
                                };
                            });
                        else{
                            this.setState( prevState => {
                                return {
                                    transactions : {
                                        ...prevState.transactions,
                                        token: {
                                            ...prevState.transactions.token,
                                            address: web3Context.toChecksumAddress(result.address),
                                            url: "https://rinkeby.etherscan.io/token/" + result.address,
                                            status: "Done"
                                        }
                                    }
                                };
                            });
                            return resolve(result.address);
                        }
                    else
                        this.setState( prevState => {
                            return {
                                ...prevState,
                                transactions: {
                                    ...prevState.transactions,
                                    issue: 'You have denied the transaction. Please try again.'
                                }
                            }
                        });
            })
        })
    }

    getCrowdsaleParams = () => {
        const _crowdsale = this.state.ico;
        const crowdsale = {
            fundsAddress: web3Context.toChecksumAddress(_crowdsale.fundsAddress),
            whitelisting: _crowdsale.whitelisting,
            burnable: _crowdsale.burnable,
        }
        return crowdsale;
    }

    crowdsaleDeploy = (tokenAddress, ico) => {
        const user = this.getUser();
        const newCrowdsaleContract = web3Context.eth.contract(crowdsaleAbi);
        tokenAddress = web3Context.toChecksumAddress(tokenAddress);

        return new Promise((resolve, reject) => {
            newCrowdsaleContract.new(
                tokenAddress,
                ico.fundsAddress,
                ico.whitelisting,
                ico.burnable,
                {
                    from: user,
                    data: '0x' + crowdsaleBytecode
                },
                (error, result) => {
                    if(!error)
                        if (!result.address)
                            this.setState( prevState => {
                                return {
                                    transactions : {
                                        ...prevState.transactions,
                                        crowdsale: {
                                            ...prevState.transactions.token,
                                            txHash: result.transactionHash,
                                            txUrl: "https://rinkeby.etherscan.io/tx/" + result.transactionHash,
                                            status: "Pending ..."
                                        }
                                    }
                                };
                            });
                        else {
                            this.setState( prevState => {
                                return {
                                    transactions : {
                                        ...prevState.transactions,
                                        crowdsale: {
                                            ...prevState.transactions.token,
                                            url: "https://rinkeby.etherscan.io/address/" + result.address,
                                            address: web3Context.toChecksumAddress(result.address),
                                            status: "Done"
                                        }
                                    }
                                };
                            });
                            return resolve(result.address);
                        }
                    else
                        this.setState({
                            transactions: {
                                issue: 'You have denied the transaction. Please try again.'
                            }
                        });
                }
            )
        });
    }

    getStages = () => {
        const _stages = this.state.stages;
        let stages = {};

        if(_stages.multiStages)
            stages = {
                tokenPrices: _stages.map((stage, i) => {
                    return stage.tokenPrice;
                }),
                startDates: _stages.map((stage, i) => {
                    stage.startDate = new Date(stage.startDate).getTime() / 1000;
                    return stage.startDate;
                }),
                finishDates: _stages.map((stage, i) => {
                    stage.finishDate = new Date(stage.finishDate).getTime() / 1000;
                    return stage.finishDate;
                }),
                tokensForSale: _stages.map((stage, i) => {
                    return this.toBigNumber(stage.tokensForSale);
                }),
            }
        else
            stages = {
                tokensForSale: this.toBigNumber(_stages.tokensForSale),
                tokenPrice: _stages.tokenPrice,
                startDate: new Date(_stages.startDate).getTime() / 1000,
                finishDate: new Date(_stages.finishDate).getTime() / 1000,
                minInvest: this.toBigNumber(_stages.minInvest),
                maxInvest: this.toBigNumber(_stages.maxInvest),
            }

        return stages;
    }

    setUpStages = (crowdsaleAddress) => {
        const stageData = this.getStages();
        crowdsaleAddress = web3Context.toChecksumAddress(crowdsaleAddress);
        const crowdsaleInstance = web3Context.eth.contract(crowdsaleAbi).at(crowdsaleAddress);

        if(this.state.stages.multiStages)
            crowdsaleInstance.setStages(
                stageData.tokenPrices,
                stageData.tokensForSale,
                stageData.startDates,
                stageData.finishDates,
                (error, txHash) => {
                    if (!error) {
                        this.setState( prevState => {
                            return {
                                transactions : {
                                    ...prevState.transactions,
                                    settings: {
                                        txHash: txHash,
                                        txUrl: "https://rinkeby.etherscan.io/tx/" + txHash,
                                        status: "Pending ..."
                                    }
                                }
                            };
                        });
                        this.getTransactionReceiptMined(txHash).then(() => {
                            this.setState( prevState => {
                                return {
                                    transactions : {
                                        ...prevState.transactions,
                                        settings: {
                                            ...prevState.transactions.settings,
                                            status: "Done"
                                        }
                                    }
                                };
                            });
                        })
                    }
                    else
                        console.error(error)
            })
        else
            crowdsaleInstance.setValues(
                stageData.tokenPrice,
                stageData.tokensForSale,
                stageData.minInvest,
                stageData.maxInvest,
                stageData.startDate,
                stageData.finishDate,
                (error, txHash) => {
                    if (!error) {
                        this.setState( prevState => {
                            return {
                                transactions : {
                                    ...prevState.transactions,
                                    settings: {
                                        txHash: txHash,
                                        txUrl: "https://rinkeby.etherscan.io/tx/" + txHash,
                                        status: "Pending ..."
                                    }
                                }
                            };
                        });
                        this.getTransactionReceiptMined(txHash).then(() => {
                            this.setState( prevState => {
                                return {
                                    transactions : {
                                        ...prevState.transactions,
                                        settings: {
                                            ...prevState.transactions.settings,
                                            status: "Done"
                                        }
                                    }
                                };
                            });
                        });
                    }
                    else
                        console.error(error)
            })
    }

    transferTokens = (crowdsaleAddress) => {
        const tokensForSale = this.toBigNumber(this.state.stages.tokensForSale);
        const tokenAddress = this.state.transactions.token.address;
        crowdsaleAddress = web3Context.toChecksumAddress(crowdsaleAddress);
        const tokenInstance = web3Context.eth.contract(tokenAbi).at(tokenAddress);

        return new Promise((resolve, reject) => {
            tokenInstance.transfer(crowdsaleAddress, tokensForSale, (error, txHash) => {
                if(txHash) {
                    this.setState( prevState => {
                        return {
                            transactions : {
                                ...prevState.transactions,
                                transfer: {
                                    txHash: txHash,
                                    txUrl: "https://rinkeby.etherscan.io/tx/" + txHash,
                                    status: "Pending ..."
                                }
                            }
                        };
                    });
                    this.getTransactionReceiptMined(txHash).then(() => {
                        this.setState( prevState => {
                            return {
                                transactions : {
                                    ...prevState.transactions,
                                    transfer: {
                                        ...prevState.transactions.transfer,
                                        status: "Done"
                                    }
                                }
                            };
                        });
                        resolve(crowdsaleAddress);
                    })
                }
            })
        })
    }

    ////
    //  Modal features
    ////

    closeModal() {
        let initialTransactions = {
            issue: '',
            token: {
                txHash: '',
                txUrl: '',
                address: '',
                url: '',
                status: 'Waiting'
            },
            crowdsale: {
                txHash: '',
                txUrl: '',
                address: '',
                url: '',
                status: 'Waiting'
            },
            settings: {
                txHash: '',
                txUrl: '',
                status: 'Waiting'
            },
            transfer: {
                txHash: '',
                txUrl: '',
                status: 'Waiting'
            },
        };

        this.setState( prevState => {
            return {
                ...prevState,
                modalIsOpen: false,
                transactions : initialTransactions
            };
        });
    }

    ////
    //  Render
    ////

    render() {
        let step = this.state.step;
        let token = this.state.token;
        let ico = this.state.ico;
        let stages = this.state.stages;

        return (
            <div className="container my-4">
                <div className="row text-center my-5">
                    <div className="col mb-5">
                        <div className="editor-token-setup">
                            <div className="step-section text-uppercase">
                                Step {step}/5
                            </div>
                            <h2 className="title-section text-uppercase"> {this.titles[step - 1]} </h2>
                        </div>
                    </div>
                    <div className="w-100 my-2"></div>

                    <div className="col">
                        <form onSubmit={this.goToNext}>
                            { step === 1 ?
                                <div className="row justify-content-center">
                                    <div className="col-md-5 form-group">
                                        <p>Token name <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Token Name tooltip on top"></i></p>
                                        <input type="text" required={true} value={token.name} onChange={this.onChange} name="name" className="editor-input w-100" placeholder="My Token Name" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-5 form-group">
                                        <p>Token symbol <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Token symbol tooltip on top"></i></p>
                                        <input type="text" required={true} value={token.symbol} onChange={this.onChange} name="symbol" className="editor-input w-100" placeholder="MTN" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-5 form-group">
                                        <p>Decimals <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Number of decimals Price tooltip on top"></i></p>
                                        <input type="number" required={true} value={token.decimals} onChange={this.onChange} name="decimals" className="editor-input w-100" placeholder="18" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-5 mt-3 form-group">
                                        <p>Token standard <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                                        <div className="row justify-content-center">
                                            ERC20
                                            <span className="span-space" />
                                            <Switch name="erc223" onClick={this.toggleSwitch} on={token.erc223}/>
                                            <span className="span-space" />
                                            ERC223
                                        </div>
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-5 mt-3 form-group">
                                        <p>Token type <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                                        <div className="d-flex justify-content-between form-group">
                                            <label htmlFor="pausable">Pausable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" checked={token.pausable} onChange={this.onChange} name="pausable" id="pausable" className="check-block"/>
                                        </div>
                                        <div className="d-flex justify-content-between form-group">
                                            <label htmlFor="freezable">Freezable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" checked={token.freezable} onChange={this.onChange} name="freezable" id="freezable" className="check-block"/>
                                        </div>
                                        <div className="d-flex justify-content-between form-group">
                                            <label htmlFor="mintable" className="m-0">Future minting <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" checked={token.mintable} onChange={this.onChange} name="mintable" id="mintable" className="check-block"/>
                                        </div>
                                    </div>
                                </div> : null
                            }
                            { step === 2 ?
                                <div className="row justify-content-center">
                                    <div className="col">
                                        <div className="row justify-content-center">
                                            <div className="col-md-5 form-group">
                                                <p>Owner address <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Wallet address tooltip on top"></i></p>
                                                <input type="text" disabled={true} readOnly name="owner" value={ico.owner} className="editor-input w-100" />
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-5 form-group">
                                                <p>Investments storage address <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Token Price tooltip on top"></i></p>
                                                <input type="text" name="fundsAddress" required={true} onChange={this.onChange} value={ico.fundsAddress} className="editor-input w-100" placeholder="0x...." />
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-5 mt-3 form-group">
                                                <div className="d-flex justify-content-between form-group">
                                                    <label htmlFor="whitelisting">Whitelisting <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                                    <input type="checkbox" name="whitelisting" onChange={this.onChange} checked={ico.whitelisting} id="whitelisting" className="check-block"/>
                                                </div>
                                                <div className="w-100"></div>

                                                <div className="d-flex justify-content-between form-group">
                                                    <label htmlFor="burnable">Burn unsold tokens <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                                <input type="checkbox" checked={ico.burnable} name="burnable" onChange={this.onChange} id="burnable" className="check-block"/>
                                                </div>
                                                <div className="w-100"></div>
                                            </div>

                                        </div>
                                    </div>
                                </div> : null
                            }
                            { step === 3 ?
                                <div className="row justify-content-center">
                                    <div className="col">
                                        <div className="col-md-12 mb-5">
                                            <div className="row justify-content-center">
                                                One stage
                                                <span className="span-space" />
                                                <Switch name="erc223" onClick={this.toggleSwitch} on={stages.multiStages}/>
                                                <span className="span-space" />
                                                Multistage
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100"></div>

                                    { !stages.multiStages ?
                                        <div className="row px-3">
                                            <h2 style={{minHeight: 38}} className="w-100 mb-5"> Single stage </h2>
                                            <div className="row justify-content-center">
                                                <div className="col">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>Total amount of tokens for sale <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                                                            <input type="number" required={true} value={stages.tokensForSale} onChange={this.onChange} name="tokensForSale" className="editor-input w-100" placeholder="ex: 100000" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Start date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="date" name="startDate" required={true} onChange={this.onChange} value={stages.startDate} className="editor-input w-100" placeholder="01.10.2018" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Minimum contribution amount ({token.symbol}) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="number" name="minInvest" required={true} onChange={this.onChange} value={stages.minInvest} className="editor-input w-100" placeholder="ex: 10" />
                                                        </div>
                                                        <div className="w-100"></div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>How much {token.symbol} tokens buys 1 ETH <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                                                            <input type="number" name="tokenPrice" required={true} onChange={this.onChange} value={stages.tokenPrice} className="editor-input w-100" placeholder="ex: 1000 (1 ETH = 1000 Tokens)" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Finish date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="date" name="finishDate" required={true} onChange={this.onChange} value={stages.finishDate} className="editor-input w-100" placeholder="01.12.2018" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Maximum contribution amount ({token.symbol}) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="number" name="maxInvest" required={true} onChange={this.onChange} value={stages.maxInvest} className="editor-input w-100" placeholder="ex: 100000" />
                                                        </div>
                                                        <div className="w-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <div className="row px-3">
                                            { stages.rounds.map((stage, i) => (
                                                <div key={i} className="row justify-content-center">
                                                    { i !== 0 ? <hr className="w-100 my-5" /> : null }

                                                    <h2 style={{minHeight: 38}} className="w-100 mb-5"> {stage.name} </h2>
                                                    <div className="col">
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-12 form-group">
                                                                <p>Stage name <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: Private sale"></i></p>
                                                                <input type="text" name="name" required={true} onChange={this.onStagesChange(i)} value={stage.name} className="editor-input w-100" placeholder="Pre sale" />
                                                            </div>

                                                            <div className="w-100"></div>
                                                            <div className="col-md-12 form-group">
                                                                <p>Start date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: 1000 (1 ETH = 1000 Tokens)"></i></p>
                                                                <input type="date" name="startDate" required={true} onChange={this.onStagesChange(i)} value={stage.startDate} className="editor-input w-100" placeholder="01-10-2018" />
                                                            </div>

                                                            <div className="w-100"></div>
                                                            <div className="col-md-12 form-group">
                                                                <p>Tokens for sale <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Third Period tooltip on top"></i></p>
                                                                <input type="number" name="tokensAmount" required={true} onChange={this.onStagesChange(i)} value={stage.tokensAmount} className="editor-input w-100" placeholder="10000" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-12 form-group">
                                                                <p>How much {token.symbol} tokens buys 1 ETH <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: 1000 (1 ETH = 1000 Tokens)"></i></p>
                                                                <input type="number" name="tokenPrice" required={true} onChange={this.onStagesChange(i)} value={stage.tokenPrice} className="editor-input w-100" placeholder="ex: 1000 (1 ETH = 1000 Tokens)" />
                                                            </div>

                                                            <div className="w-100"></div>
                                                            <div className="col-md-12 form-group">
                                                                <p>Finish date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Second Bonus tooltip on top"></i></p>
                                                                <input type="date" name="finishDate" required={true} onChange={this.onStagesChange(i)} value={stage.finishDate} className="editor-input w-100" placeholder="01-10-2018" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="w-100 mt-5"></div>
                                            <div className="offset-md-3 col-md-6 form-group">
                                                <p>Add new stage <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Presale Bonus tooltip on top"></i></p>
                                                <button onClick={this.onAddStage} className="editor-btn big"><i className="fa fa-plus"></i> Add</button>
                                            </div>
                                        </div>
                                    }
                                </div> : null
                            }
                            { step === 4 ?
                                <div>
                                    { token.receivers.map((receiver, i) => (
                                        i === 0 ?
                                            <div key={0} className="row justify-content-center">
                                                <div className="col">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>Receiver address</p>
                                                            <input type="text" disabled={true} readOnly value="Crowdsale smart contract address" className="editor-input w-100" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>Tokens amount</p>
                                                            <input type="number" disabled={true} readOnly value={stages.tokensForSale} className="editor-input w-100" placeholder="This value will be generated automatically" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        :
                                            <div key={i} className="row justify-content-center">
                                                <div className="col">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>Receiver address</p>
                                                            <input type="text" name="address" required={true} placeholder="0x...." onChange={this.ondistributionAddressesChange(i)} value={receiver.address} className="editor-input w-100" />
                                                        </div>
                                                        <div className="col-md-12 form-group">
                                                            <div className="row">
                                                                <div className="col-md-6 form-group">
                                                                    <label htmlFor={"frozen-" + i}>Frozen <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                                                    <div className="row justify-content-center">
                                                                        <input type="checkbox" name="frozen" onChange={this.ondistributionAddressesChange(i)} checked={receiver.frozen} id={"frozen-" + i} className="check-block"/>
                                                                    </div>
                                                                </div>
                                                                { receiver.frozen ?
                                                                    <div className="col-md-6 form-group">
                                                                        <p>Until date</p>
                                                                        <input type="date" name="untilDate" required={true} onChange={this.ondistributionAddressesChange(i)} value={receiver.untilDate} className="editor-input w-100 min-w-100" placeholder="01.10.2018" />
                                                                    </div> : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>Tokens amount</p>
                                                            <input type="number" name="amount" required={true} onChange={this.ondistributionAddressesChange(i)} value={receiver.amount} placeholder="ex: 10000" className="editor-input w-100" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    ))}
                                    <div className="w-100"></div>
                                    <div className="offset-md-6 col-md-6 form-group">
                                        <button onClick={this.onAddReceiver} type="button" className="editor-btn main">
                                        <i className="fas fa-plus"></i>
                                        <span>&nbsp;&nbsp; Add new address</span>
                                        </button>
                                    </div>
                                </div> : null
                            }
                            { step === 5 ?
                                <div className="row justify-content-center">
                                    <div className="col">
                                        <div className="row justify-content-center">
                                            <div className="col-md-12 form-group">
                                                <p>Token name</p>
                                                <p className="main-color font-weight-bold">{token.name}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Symbol</p>
                                                <p className="main-color font-weight-bold">{token.symbol}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Decimals</p>
                                                <p className="main-color font-weight-bold">{token.decimals}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Total supply</p>
                                                <p className="main-color font-weight-bold">{token.totalSupply}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Token standard</p>
                                                <p className="main-color font-weight-bold">{token.erc223 ? "ERC223" : "ERC20"}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Pausable</p>
                                                <p className="main-color font-weight-bold">{String(token.pausable).toUpperCase()}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Freezable</p>
                                                <p className="main-color font-weight-bold">{String(token.freezable).toUpperCase()}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Future mintable</p>
                                                <p className="main-color font-weight-bold">{String(token.mintable).toUpperCase()}</p>
                                            </div>
                                            <div className="w-100"></div>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="row justify-content-center">
                                            <div className="col-md-12 form-group">
                                                <p>Owner address</p>
                                                <p className="main-color font-weight-bold">{ico.owner}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Funds address</p>
                                                <p className="main-color font-weight-bold">{ico.fundsAddress}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Tokens for sale</p>
                                                <p className="main-color font-weight-bold">{stages.tokensForSale}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Burn unsold tokens after crowdsale</p>
                                                <p className="main-color font-weight-bold">{String(ico.burnable).toUpperCase()}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Whitelisting</p>
                                                <p className="main-color font-weight-bold">{String(ico.whitelisting).toUpperCase()}</p>
                                            </div>
                                            <div className="w-100"></div>
                                        </div>
                                    </div>

                                    { stages.multiStages ?
                                        <div className="col">
                                            <div className="col-md-12 form-group">
                                                    <p>Stages amount</p>
                                                    <p className="main-color font-weight-bold">{stages.rounds.length}</p>
                                            </div>
                                            <div className="w-100"></div>
                                            { stages.rounds.map((stage, i) => (
                                                <div key={i} className="col">
                                                    { i === 0 ?
                                                        <hr className="w-100 my-5" />
                                                    :
                                                        <hr className="w-100 mb-5" />
                                                    }
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>Stage name</p>
                                                            <p className="main-color font-weight-bold">{stage.name}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Tokens for stage</p>
                                                            <p className="main-color font-weight-bold">{stage.tokensAmount}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Stage token price</p>
                                                            <p className="main-color font-weight-bold">{stage.tokenPrice}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Start date</p>
                                                            <p className="main-color font-weight-bold">{stage.startDate}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Finish date</p>
                                                            <p className="main-color font-weight-bold">{stage.finishDate}</p>
                                                        </div>
                                                        <div className="w-100"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    :
                                        <div className="col">
                                            <div className="col-md-12 form-group">
                                                <p>1 ETH buys</p>
                                                <p className="main-color font-weight-bold">{stages.tokenPrice}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Start Date</p>
                                                <p className="main-color font-weight-bold">{stages.startDate}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Finish date</p>
                                                <p className="main-color font-weight-bold">{stages.finishDate}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Minimum investing amount ({token.symbol})</p>
                                                <p className="main-color font-weight-bold">{stages.minInvest}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Maximum investing amount ({token.symbol})</p>
                                                <p className="main-color font-weight-bold">{stages.maxInvest}</p>
                                            </div>
                                            <div className="w-100"></div>
                                        </div>
                                    }
                                </div>: null
                            }

                            <div className="w-100 mb-5"></div>
                            <div className="col form-group">
                                { step > 1 ?
                                    <button className="editor-btn big mb-5" onClick={this.goToPrev}>Prev</button> : null
                                }
                                { step < 5 ?
                                    <button type="submit" className="editor-btn big mb-5">Continue</button> : null
                                }
                                { step === 5 ?
                                    <button className="editor-btn big mb-5" onClick={this.onSubmit}>Deploy</button> : null
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
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
                                            { !this.state.transactions.issue ?
                                                <div className="col-md-12" style={{textAlign:"center"}}>
                                                    <p className="Title my-3 mb-5" style={{textAlign:"center"}}>
                                                        <b>Making transaction ...</b><br/>
                                                        <i>NOTE: don't switch your Mtamask account until the all 4 transactions confirmation.</i><br/>
                                                    </p>
                                                    <p className="Title my-3" style={{textAlign:"left"}}>
                                                        1. Deploying Token contract - { this.state.transactions.token.status }
                                                    </p>
                                                    <p className="Title my-3" style={{textAlign:"left"}}>
                                                        2. Deploying Crowdsale contract - { this.state.transactions.crowdsale.status }
                                                    </p>
                                                    <p className="Title my-3" style={{textAlign:"left"}}>
                                                        3. Transfering tokens for Crowdsale - { this.state.transactions.transfer.status }
                                                    </p>
                                                    <p className="Title my-3" style={{textAlign:"left"}}>
                                                        4. Setting necessary values for Crowdsale stages - { this.state.transactions.settings.status }
                                                    </p>
                                                    <div className="w-100 my-5"></div>
                                                    { (this.state.transactions.settings.status === "Done" &&
                                                        this.state.transactions.transfer.status === "Done") ?
                                                        <div>
                                                            <hr className="w-100 my-5" />
                                                            <p className="Title my-5" style={{textAlign:"center"}}>
                                                                Congratulations! Your crowdsale contract deployed.
                                                                <br></br>
                                                                Address - <a href={this.state.transactions.crowdsale.url} style={{color: "#45467e"}} target="_blank">{ this.state.transactions.crowdsale.address }</a>
                                                            </p>
                                                            <div className="col">
                                                                <a href="/crowdsales" className="editor-btn main big my-5">Manage crowdsale</a>
                                                                <span onClick={this.closeModal.bind(this)} className="editor-btn copy big my-5">Close modal</span>
                                                            </div>
                                                        </div> : null
                                                    }
                                                </div>
                                            :
                                                <div className="col-md-12" style={{textAlign:"center"}}>
                                                    <p className="Title my-3" style={{textAlign:"center"}}><b>Transaction not created</b></p>
                                                    <div className="w-100 my-5"></div>
                                                    <p className="Title my-5" style={{textAlign:"left"}}>
                                                        { this.state.transactions.issue }
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
       )
    }
}

export default AddCrowdsale;