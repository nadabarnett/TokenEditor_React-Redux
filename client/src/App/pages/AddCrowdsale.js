import React, { Component } from 'react';
import Switch from 'react-toggle-switch';
import { Link } from 'react-router-dom';
import { crowdsaleAbi, crowdsaleBytecode, tokenAbi, tokenBytecode } from './../components/ContractStore';
import Modal from 'react-modal';
import { parse } from 'url';
import { throws } from 'assert';

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

const initialState = {
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
            id: 0,
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
            id: 0,
            name: '',
            tokensForSale: '',
            tokenPrice: '',
            startDate: '',
            finishDate: '',
            minInvest: '',
            maxInvest: '',
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
            case 1:
                this.checkAddress();
                break;
            case 3:
                this.calculateTokensForSale();
                break;
            case 4:
                this.calculateTotalSupply();
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

    detectValue = (e) => {
        let target = e.target;
        let name = target.name;
        let value;

        if(target.type === 'checkbox')
            value = target.checked;
        else if(target.type === 'number')
            value = parseInt(target.value)
        else
            value = target.value;

        value = Number.isNaN(value) ? '' : value;

        return [name, value];
    }

    onChange = (e) => {
        const [name, value] = this.detectValue(e);
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
        const [name, value] = this.detectValue(e);
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
        const [name, value] = this.detectValue(e);
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
            return (receiver.amount ? receiver.amount : 0);
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

    calculateTokensForSale = () => {
        let sum = this.state.stages.tokensForSale;

        if(this.state.stages.multiStages) {
            let amounts = this.state.stages.rounds.map((stage, i) => {
                return (stage.tokensForSale != "" ? stage.tokensForSale : 0);
            });
            sum = amounts.reduce((a, b) => a + b, 0);
        }

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
            id: this.state.stages.rounds.length,
            name: '',
            tokensForSale: '',
            tokenPrice: '',
            startDate: '',
            finishDate: '',
            minInvest: '',
            maxInvest: '',
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

    onDeleteStage = (id) => {
        const sampleRoundes = this.state.stages.rounds.filter(round => round.id !== id)
        this.setState( prevState => {
            return {
                stages: {
                    ...prevState.stages,
                    rounds: sampleRoundes
                }
            };
        });
    }

    onAddReceiver = () => {
        const newAddress = {
            id: this.state.token.receivers.length,
            address: '',
            amount: '',
            frozen: false,
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

    ////
    //  Submit final form
    ////

    onSubmit = (e) => {
        e.preventDefault();

        const tokenData = this.getTokenParams();
        const icoData = this.getCrowdsaleParams();

        this.setState({modalIsOpen: true});

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
        });
    }

    showIssue = (error) => {
        console.error(error);
        this.setState({
            transactions: {
                issue: "Something goes wrong :( Please try again."
            }
        });
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
    }

    getUser = () => {
        const user = this.state.user;
        if(user !== this.state.ico.owner)
            alert("The owner of ICO is this address " + this.state.ico.owner +". Now you used this address " + user + ". Please switch account for continue and deploy the contract.")
        else
            return user;
    }

    isAddressValid = (e) => {
        const address = e.target.value;
        if(web3Context.isAddress(address) || address === '')
            return true
        else
            alert("The wrong ETH address found, please check it.")
            return false;
    }

    checkAddress = () => {
        if(!this.state.ico.owner) {
            this.setState( prevState => {
                return {
                    ico : {
                        ...prevState.ico,
                        owner: web3Context.eth.coinbase
                    }
                };
            });
        }
    }

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
                return web3Context.toChecksumAddress(receiver.address);
            }),
            amounts: tokenState.receivers.map((receiver, i) => {
                return i === 0 ? this.toBigNumber(this.state.stages.tokensForSale) : this.toBigNumber(receiver.amount);
            }),
            frozen: tokenState.receivers.map((receiver, i) => {
                return receiver.frozen;
            }),
            untilDate: tokenState.receivers.map((receiver, i) => {
                return receiver.untilDate ? (new Date(receiver.untilDate).getTime() / 1000) : '';
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
                }, (error, result) => {
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
                            resolve(result.address);
                        }
                    else {
                        this.setState( prevState => {
                            return {
                                ...prevState,
                                transactions: {
                                    ...prevState.transactions,
                                    issue: 'You have denied the transaction. Please try again.'
                                }
                            }
                        });
                        reject(error)
                    }
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
                    if(result)
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
                            resolve(result.address);
                        }
                    else {
                        this.setState({
                            transactions: {
                                issue: 'Transaction was failed. Please try again.'
                            }
                        });
                        reject(error);
                    }
                }
            )
        });
    }

    getStages = () => {
        const _stages = this.state.stages;
        let stages = {};

        if(_stages.multiStages)
            stages = {
                tokenPrices: _stages.rounds.map((stage, i) => {
                    return stage.tokenPrice;
                }),
                tokensForSale: _stages.rounds.map((stage, i) => {
                    return this.toBigNumber(stage.tokensForSale);
                }),
                minInvest: _stages.rounds.map((stage, i) => {
                    return stage.minInvest ? this.toBigNumber(stage.minInvest) : 0;
                }),
                maxInvest: _stages.rounds.map((stage, i) => {
                    return stage.maxInvest ? this.toBigNumber(stage.maxInvest) : this.toBigNumber(stage.tokensForSale);
                }),
                startDates: _stages.rounds.map((stage, i) => {
                    return stage.startDate ? (new Date(stage.startDate).getTime() / 1000) : 0;
                }),
                finishDates: _stages.rounds.map((stage, i) => {
                    return stage.finishDate ? (new Date(stage.finishDate).getTime() / 1000) : 1924981199;
                })
            }
        else
            stages = {
                tokenPrice: _stages.tokenPrice,
                tokensForSale: this.toBigNumber(_stages.tokensForSale),
                minInvest: _stages.minInvest ? this.toBigNumber(_stages.minInvest) : 0,
                maxInvest: _stages.maxInvest ? this.toBigNumber(_stages.maxInvest) : this.toBigNumber(_stages.tokensForSale),
                startDate: _stages.startDate ? (new Date(_stages.startDate).getTime() / 1000) : 0,
                finishDate: _stages.finishDate ? (new Date(_stages.finishDate).getTime() / 1000) : 1924981199
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
                stageData.minInvest,
                stageData.maxInvest,
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
        const step = this.state.step;
        const token = this.state.token;
        const ico = this.state.ico;
        const stages = this.state.stages;

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
                                                <input type="text" name="fundsAddress" required={true} onBlur={this.isAddressValid} onChange={this.onChange} value={ico.fundsAddress} className="editor-input w-100" placeholder="0x..." />
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
                                                            <p>Amount of tokens for sale <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                                                            <input type="number" required={true} value={stages.tokensForSale} onChange={this.onChange} name="tokensForSale" className="editor-input w-100" placeholder="ex: 100000" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Start date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="date" name="startDate" onChange={this.onChange} value={stages.startDate} className="editor-input w-100" placeholder="01.10.2018" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Minimum contribution amount ({token.symbol}) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="number" name="minInvest" onChange={this.onChange} value={stages.minInvest} className="editor-input w-100" placeholder="ex: 10" />
                                                        </div>
                                                        <div className="w-100"></div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12 form-group">
                                                            <p>Tokens for 1 ETH <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                                                            <input type="number" name="tokenPrice" required={true} onChange={this.onChange} value={stages.tokenPrice} className="editor-input w-100" placeholder="ex: 1000 (1 ETH = 1000 Tokens)" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Finish date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="date" name="finishDate" onChange={this.onChange} value={stages.finishDate} className="editor-input w-100" placeholder="01.12.2018" />
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Maximum contribution amount ({token.symbol}) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                            <input type="number" name="maxInvest" onChange={this.onChange} value={stages.maxInvest} className="editor-input w-100" placeholder="ex: 100000" />
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

                                                    <h2 style={{minHeight: 38}} className="w-100 mb-5">{stage.name}</h2>
                                                    <div className="col">
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-12 form-group">
                                                                <p>Stage name <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: Private sale"></i></p>
                                                                <input type="text" name="name" required={true} onChange={this.onStagesChange(i)} value={stage.name} className="editor-input w-100" placeholder="Pre sale" />
                                                            </div>
                                                            <div className="w-100"></div>

                                                            <div className="col-md-12 form-group">
                                                                <p>Minimum contribution amount ({token.symbol}) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                                <input type="number" name="minInvest" onChange={this.onStagesChange(i)} value={stage.minInvest} className="editor-input w-100" placeholder="ex: 10" />
                                                            </div>
                                                            <div className="w-100"></div>

                                                            <div className="col-md-12 form-group">
                                                                <p>Start date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: 1000 (1 ETH = 1000 Tokens)"></i></p>
                                                                <input type="date" name="startDate" onChange={this.onStagesChange(i)} value={stage.startDate} className="editor-input w-100" placeholder="01-10-2018" />
                                                            </div>
                                                            <div className="w-100"></div>

                                                            <div className="col-md-12 form-group">
                                                                <p>Tokens amount for sale <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Third Period tooltip on top"></i></p>
                                                                <input type="number" name="tokensForSale" required={true} onChange={this.onStagesChange(i)} value={stage.tokensForSale} className="editor-input w-100" placeholder="10000" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-12 form-group">
                                                                <p>Tokens for 1ETH <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: 1000 (1 ETH = 1000 Tokens)"></i></p>
                                                                <input type="number" name="tokenPrice" required={true} onChange={this.onStagesChange(i)} value={stage.tokenPrice} className="editor-input w-100" placeholder="ex: 1000 (1 ETH = 1000 Tokens)" />
                                                            </div>
                                                            <div className="w-100"></div>

                                                            <div className="col-md-12 form-group">
                                                                <p>Maximum contribution amount ({token.symbol}) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                                                                <input type="number" name="maxInvest" onChange={this.onStagesChange(i)} value={stage.maxInvest} className="editor-input w-100" placeholder="ex: 100000" />
                                                            </div>
                                                            <div className="w-100"></div>

                                                            <div className="col-md-12 form-group">
                                                                <p>Finish date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Second Bonus tooltip on top"></i></p>
                                                                <input type="date" name="finishDate" onChange={this.onStagesChange(i)} value={stage.finishDate} className="editor-input w-100" placeholder="01-10-2018" />
                                                            </div>
                                                            <div className="w-100"></div>

                                                            { i !== 0 ?
                                                                <div className="col-md-12 form-group">
                                                                    <p>Remove round <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Presale Bonus tooltip on top"></i></p>
                                                                    <button onClick={() => this.onDeleteStage(stage.id)} className="editor-btn main"><i className="fa fa-minus"></i> Remove</button>
                                                                </div>
                                                                : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="w-100 mt-5"></div>
                                            <div className="offset-md-3 col-md-6 form-group">
                                                <p>Add new stage <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Presale Bonus tooltip on top"></i></p>
                                                <button onClick={this.onAddStage} className="editor-btn main"><i className="fa fa-plus"></i> Add</button>
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
                                                            <input type="text" name="address" required={true} placeholder="0x..." onBlur={this.isAddressValid} onChange={this.ondistributionAddressesChange(i)} value={receiver.address} className="editor-input w-100" />
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

                                                        <div className="w-100"></div>
                                                        <div className="col-md-12 form-group">
                                                            <p>Remove receiver <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Presale Bonus tooltip on top"></i></p>
                                                            <button onClick={() => this.onDeleteReceiver(receiver.id)} className="editor-btn main"><i className="fa fa-minus"></i> Remove</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    ))}

                                    <div className="w-100 mt-5"></div>
                                    <div className="offset-md-3 col-md-6 form-group">
                                        <p>Add new receiver <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Presale Bonus tooltip on top"></i></p>
                                        <button onClick={this.onAddReceiver} type="button" className="editor-btn main"><i className="fas fa-plus"></i> Add</button>
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
                                                            <p className="main-color font-weight-bold">{stage.tokensForSale}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Stage token price</p>
                                                            <p className="main-color font-weight-bold">{stage.tokenPrice}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Start date</p>
                                                            <p className="main-color font-weight-bold">{stage.startDate ? stage.startDate : "Not setted"}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Finish date</p>
                                                            <p className="main-color font-weight-bold">{stage.finishDate ? stage.finishDate : "Not setted"}</p>
                                                        </div>
                                                        <div className="w-100"></div>

                                                        <div className="col-md-12 form-group">
                                                            <p>Min/Max investments amounts</p>
                                                            <p className="main-color font-weight-bold">{Number(stage.minInvest) ? Number(stage.minInvest) : "Not setted"} / {Number(stage.maxInvest) ? Number(stage.maxInvest) : "Not setted"}</p>
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
                                                <p className="main-color font-weight-bold">{stages.startDate ? stages.startDate : "Not setted"}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Finish date</p>
                                                <p className="main-color font-weight-bold">{stages.finishDate ? stages.finishDate : "Not setted"}</p>
                                            </div>
                                            <div className="w-100"></div>

                                            <div className="col-md-12 form-group">
                                                <p>Min/Max investments amounts</p>
                                                <p className="main-color font-weight-bold">{Number(stages.minInvest) ? Number(stages.minInvest) : "Not setted"} / {Number(stages.maxInvest) ? Number(stages.maxInvest) : "Not setted"}</p>
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
                                                        <i>NOTE: please don't reload the page <br/> and dont switch your Metamask account until the all 4 transactions confirmation.</i><br/>
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