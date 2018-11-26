import React, { Component } from 'react'
import Switch from 'react-switch';
import DatePicker from 'react-datepicker'
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { parse } from 'url';
import { throws } from 'assert';
import { crowdsaleAbi, crowdsaleBytecode, tokenAbi, tokenBytecode } from './../ContractStore';

import "react-datepicker/dist/react-datepicker.css";
// import Toggle from "react-toggle-component"
// import "react-toggle-component/styles.css"
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

class CreateStep1Form extends React.Component{
  constructor(props){
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
    this.viewflag = 1;
    this.state1 = {
      formData: {
        name: '',
        symbol: '',
        decimals: '',
        initial: '',
        pausable: false,
        freezable: false,
        mintable: false,
        standard: 'ERC20'
      }
    };
    this.state2 = {
      formData: {
        owner_address: '',
        investiments_address: '',
        soft_cap: '',
        hard_cap: '',
        start_time: '',
        end_time: '',
        whitelisting: 'yes',
        minmax_investments: 'yes',
        transferable_dates: 'yes',
        changing_date: 'yes',
        burn_unsold_tokens: 'yes'
      }
    }
    this.state3 = {
      formData: {
        stages_old: [
          {
            name: '',
            price: '',
            token_count: '',
            min_contribution_amount: '',
            max_contribution_amount: '',
            start_date: '',
            finish_date: ''
          }
        ]
      }
    }
    this.state4 = {
      formData: {
        addresses: [
          {
            address: '',
            until_date: '',
            amount: '',
            frozen: 'yes'
          }
        ]
      }
    }
    this.state5 = {
      formData: {
      }
    }
  }
  toggleHandler1(key, value) {
    this.setState( prevState => {
      return {
          token : {
              ...prevState.token,
              erc223: !this.state.token.erc223
          }
      };
  });

  }
  changeHandler1(key){
    return function(event){
      let formData = this.state1.formData;
      formData[key] = event.target.value;
      this.setState(...this.state1, {formData: formData});
    }
  }
  checkedHandler1(key){
    return function(event){
      let formData = this.state.formData;
      formData[key] = event.target.checked;
      this.setState(...this.state, {formData: formData});
    }
  }

  //step2
  toggleHandler2(key, value) {
    let formData = this.state2.formData;
    formData[key] = value;
    this.setState(...this.state2, {formData: formData});
  }
  changeHandler2(key){
    return function(event){
      let formData = this.state2.formData;
      formData[key] = event.target.value;
      this.setState(...this.state2, {formData: formData});
    }
  }
  changeStartDateHandler2(date){
    let formData = this.state2.formData;
    formData['start_time'] = date;
    this.setState(...this.state2, {formData: formData});
  }
  changeEndDateHandler2(date){
    let formData = this.state2.formData;
    formData['end_time'] = date;
    this.setState(...this.state2, {formData: formData});
  }

  //step3
  addStage3(){
    let { stages_old } = this.state3.formData;
    stages_old.push({
      token_name: '',
      token_price: '',
      token_count: '',
      min_contribution_amount: '',
      max_contribution_amount: '',
      start_date: '',
      finish_date: ''
    })
    this.setState(...this.state3,{
      formData:{
        stages_old: stages_old
      }
    })
  }
  changeHandler3(index, key){
    return function(event){
      let stages_old = this.state3.formData.stages_old;
      stages_old[index][key] = event.target.value;

      this.setState(...this.state3, {formData: {stages_old: stages_old}});
    }
  }
  changeStartDateHandler3(date){
    let formData = this.state3.formData;
    formData['start_time'] = date;
    this.setState(...this.state, {formData: formData});
  }
  changeEndDateHandler3(date){
    let formData = this.state3.formData;
    formData['end_time'] = date;
    this.setState(...this.state3, {formData: formData});
  }

  //step4
  changeHandler4(index, key){
    return function(event){
      let addresses = this.state4.formData.addresses;
      addresses[index][key] = event.target.value;

      this.setState(...this.state4, {formData: {addresses: addresses}});
    }
  }
  toggleHandler4(index, key, value) {
    let addresses = this.state4.formData.addresses;
    addresses[index][key] = value;

    this.setState(...this.state4, {formData: {addresses: addresses}});
  }
  addAddress4(){
    let { addresses } = this.state4.formData;
    addresses.push({
      address: '',
      until_date: '',
      amount: '',
      frozen: 'yes'
    })
    this.setState(...this.state4,{
      formData:{
        addresses: addresses
      }
    })
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
    return this.props.onNextBtn();

}

goToPrev = (e) => {
    e.preventDefault();
    this.setState({ step: this.state.step - 1 });
    return this.props.onBackBtn();

}
  goNext(){
 //   const formData = this.state.formData;
    /*
    if(formData.name==''||formData.symbol==''||formData.decimals==''||formData.initial==''){
      alert('Please input name, symbol, decimals, initial.');
      return;
    }
    */
   this.viewflag++;
   this.setState({viewflag : 1});
    return this.props.onNextBtn();
  }
  goBack(){
    this.viewflag--;
    this.setState({viewflag : 1});
    return this.props.onBackBtn();
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
render() {
  const step = this.state.step;
  const token = this.state.token;
  const ico = this.state.ico;
  const stages = this.state.stages;

  return (
      <div className="container my-4">
                  <form onSubmit={this.goToNext}>
                      { step === 1 ?
                          <div className="container">
                              <div className="row form-group">
                              <label className='col-md-2'>
                              Token Name
                                  <a className='question'></a>
                                </label>
                              <div className='col-md-8'>                              
                                <input type="text" required={true} value={token.name} onChange={this.onChange} name="name" className="editor-input w-100" placeholder="My Token Name" />
                              </div>
                              </div>
                              <div className='row form-group'>
                              <label className='col-md-2'>Token Symbol<a className='question'></a></label>
                              <div className='col-md-8'>
                                  <input type="text" required={true} value={token.symbol} onChange={this.onChange} name="symbol" className="editor-input w-100" placeholder="MTN" />
                              </div>
                              </div>
                              <div className='row form-group'>
                                <label className='col-md-2'>Decimals<a className='question'></a></label>
                                <div className='col-md-8'>
                                    <input type="number" required={true} value={token.decimals} onChange={this.onChange} name="decimals" className="editor-input w-100" placeholder="18" />
                                </div>
                              </div>
                              <div className='row form-group'>
                              <label className='col-md-2'>Token Standard<a className='question'></a></label>
                              <div className='col-md-8'>
                              <div className='toggle-btn'>
                                  <a className={this.state.token.erc223==false?'active':''} onClick={this.toggleHandler1.bind(this,'standard','ERC20')}>
                                  ERC20
                                  </a>
                                  <a className={this.state.token.erc223==true?'active':''} onClick={this.toggleHandler1.bind(this,'standard','ERC223')}>
                                  ERC223
                                  </a>
                                </div>
                              </div>
                              </div>
                              <div className='row form-group'>
                                <label className='col-md-2'>Token type<a className='question'></a></label>
                                <div className='col-md-8'>
                                  <p style={{'marginBottom':'0'}}>
                                    <label className='token-type'>Pausable token</label>
                                    <input type="checkbox" checked={token.pausable} onChange={this.onChange} name="pausable" id="pausable" className="check-block"/>
                                    <a className='question'></a>
                                  </p>
                                  <p style={{'marginBottom':'0'}}>
                                    <label className='token-type'>Freezable token</label>
                                    <input type="checkbox" checked={token.freezable} onChange={this.onChange} name="freezable" id="freezable" className="check-block"/>
                                    <a className='question'></a>
                                  </p>
                                  <p style={{'marginBottom':'0'}}>
                                    <label className='token-type'>Future minting</label>
                                    <input type="checkbox" checked={token.mintable} onChange={this.onChange} name="mintable" id="mintable" className="check-block"/>
                                    <a className='question'></a>
                                  </p>
                                </div>
                              </div>
                          </div> : null
                      }
                      { step === 2 ?

                          <div className="container">
                              <div className='row form-group'>
                                <label className='col-md-2'>
                                    Owner address
                                    <a className='question'></a>
                                </label>
                                <div className='col-md-4'>                                     
                                  <input type="text" disabled={true} readOnly name="owner" value={ico.owner} className="editor-input w-100" />
                                </div>
                            </div>   

                        <div className='row form-group'>
                          <label className='col-md-2 multilines-2line'>
                              Investiments storage address
                              <a className='question'></a>
                            </label>   
                            <div className='col-md-4'>
                                              
                            <input type="text" name="fundsAddress" required={true} onBlur={this.isAddressValid} onChange={this.onChange} value={ico.fundsAddress} className="editor-input w-100" placeholder="0x..." />
                            </div>
                          </div>

                          <div className='row form-group'>
                        <label className='col-md-2'>
                          Whitelisting
                          <a className='question'></a>
                        </label>
                        <div style={{paddingTop:'10px'}} className='col-md-2'>
                          
                          <input type="checkbox" name="whitelisting" onChange={this.onChange} checked={ico.whitelisting} id="whitelisting" className="check-block"/>
                          
                        </div>
                        
                      </div>
                      <div className='row form-group'>
                        <label className='col-md-2 multilines-2line'>
                          Burn unsold tokens
                          <a className='question'></a>
                        </label>
                        <div style={{paddingTop:'10px'}} className='col-md-2'>
                         
                          <input type="checkbox" checked={ico.burnable} name="burnable" onChange={this.onChange} id="burnable" className="check-block"/>

                         
                        </div>
                      </div>                          
                    </div>
                     : null
                      }
                    { step === 3 ?
                            <div className="container">
                                  { stages.rounds.map((stage, i) => (
                                      <div key={i}>
                                          { i !== 0 ? <hr className="w-100 my-5" /> : null }
                                          <div className='row form-group'>
                                            <label className='col-md-2'>
                                              Stage name
                                              <a className='question'></a>
                                            </label>
                                            <div className='col-md-4'>
                                            <input type="text" name="name" required={true} onChange={this.onStagesChange(i)} value={stage.name} className="editor-input w-100" placeholder="Pre sale" />
                                            </div>
                                            <label className='col-md-2'>
                                              Start date
                                              <a className='question'></a>
                                            </label>
                                            <div className='col-md-4'>
                                              <input type="date" name="startDate" onChange={this.onStagesChange(i)} value={stage.startDate} className="editor-input w-100" placeholder="01-10-2018" />
                                            </div>
                                          </div>
                                          <div className='row form-group'>
                                          <label className='col-md-2'>
                                            Tokens for 1ETH
                                            <a className='question'></a>
                                          </label>
                                          <div className='col-md-4'>
                                            <input type="number" name="tokenPrice" required={true} onChange={this.onStagesChange(i)} value={stage.tokenPrice} className="editor-input w-100" placeholder="ex: 1000 (1 ETH = 1000 Tokens)" />
                                          </div>
                                          <label className='col-md-2'>
                                            Finish date
                                            <a className='question'></a>
                                          </label>
                                          <div className='col-md-4'>
                                            <input type="date" name="finishDate" onChange={this.onStagesChange(i)} value={stage.finishDate} className="editor-input w-100" placeholder="01-10-2018" />
                                          </div>
                                        </div>
                                        <div className='row form-group'>
                                          <label className='col-md-2 multilines-2line'>
                                            Tokens for this stage
                                            <a className='question'></a>
                                          </label>
                                          <div className='col-md-4'>
                                            <input type="number" name="tokensForSale" required={true} onChange={this.onStagesChange(i)} value={stage.tokensForSale} className="editor-input w-100" placeholder="10000" />
                                          </div>
                                        </div>
                                        <div className='row form-group'>
                                          <label className='col-md-2 multilines-2line'>
                                            Min contribution amount(ETH)
                                            <a className='question'></a>
                                          </label>
                                          <div className='col-md-4'>
                                            <input type="number" name="minInvest" onChange={this.onStagesChange(i)} value={stage.minInvest} className="editor-input w-100" placeholder="ex: 10" />
                                          </div>
                                        </div>
                                        <div className='row form-group'>
                                          <label className='col-md-2 multilines-2line'>
                                            Max contribution amount(ETH)
                                            <a className='question'></a>
                                          </label>
                                          <div className='col-md-4'>
                                              <input type="number" name="maxInvest" onChange={this.onStagesChange(i)} value={stage.maxInvest} className="editor-input w-100" placeholder="ex: 100000" />
                                          </div>
                                          <div className='col-md-2'></div>
                                          { i !== 0 ?                                        
                                            <div className='col-md-4'>
                                                <button style={{marginop:'10px'}} onClick={() => this.onDeleteStage(stage.id)} className="add-btn"><i className="fa fa-minus"></i> Remove</button>
                                        </div>
                                            : null
                                        }
                                        </div>                             
                                        </div>
                                      ))}

                                    <div className='row form-group'>
                                      <label className='col-md-2 multilines-2line'>
                                        Create new stages
                                        <a className='question'></a>
                                      </label>
                                      <div className='col-md-4'>
                                        <button onClick={this.onAddStage} className="add-btn"><i className="fa fa-plus"></i> Add</button>
                                      </div>
                                    </div>
                                    
                                </div> : null
                            }
                      { step === 4 ?
                          <div>
                              { token.receivers.map((receiver, i) => (
                                  i === 0 ?
                                      <div key={0}>
                                        <div className='row form-group'>
                                            <label className='col-md-2'>
                                              Address
                                              <a className='question'></a>
                                            </label>
                                            <div className='col-md-4'>
                                              <input type="text" disabled={true} readOnly value="Crowdsale smart contract address" className="editor-input w-100" />
                                            </div>
                                          </div>
                                          <div className='row form-group'>
                                          <label className='col-md-2'>
                                            Amount
                                            <a className='question'></a>
                                          </label>
                                          <div className='col-md-4'>
                                            <input type="number" disabled={true} readOnly value={stages.tokensForSale} className="editor-input w-100" placeholder="This value will be generated automatically" />
                                          </div>
                                        </div>
                                      </div>
                                  :
                                      <div key={i}>
                                        <div className='row form-group'>
                                            <label className='col-md-2'>
                                              Address
                                              <a className='question'></a>
                                            </label>
                                            <div className='col-md-4'>
                                              <input type="text" name="address" required={true} placeholder="0x..." onBlur={this.isAddressValid} onChange={this.ondistributionAddressesChange(i)} value={receiver.address} className="editor-input w-100" />
                                            </div>
                                            <label className='col-md-2'>
                                              Until date
                                              <a className='uestion'></a>
                                            </label>
                                            <div className='col-md-4'>
                                              <input type="date" name="untilDate" required={true} onChange={this.ondistributionAddressesChange(i)} value={receiver.untilDate} className="editor-input w-100 min-w-100" placeholder="01.10.2018" />
                                            </div>
                                          </div>
                                          <div className='row form-group'>
                                            <label className='col-md-2'>
                                              Amount
                                              <a className='question'></a>
                                            </label>
                                            <div className='col-md-4'>
                                                <input type="number" name="amount" required={true} onChange={this.ondistributionAddressesChange(i)} value={receiver.amount} placeholder="ex: 10000" className="editor-input w-100" />
                                            </div>
                                            <div className='col-md-2'></div>
                                            <div className="col-md-4">
                                                  <button onClick={() => this.onDeleteReceiver(receiver.id)} className="add-btn"><i className="fa fa-minus"></i> Remove</button>
                                            </div>
                                          </div>
                                          <div className='row form-group'>
                                            <label className='col-md-2'>
                                              Frozen
                                              <a className='question'></a>
                                            </label>
                                            <div className='col-md-4'>
                                              <div className='toggle-btn'>
                                                <a className='active' >
                                                Yes
                                                </a>
                                                <a className='' >
                                                No
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                      </div>
                              ))}

                                      <div className='row form-group'>
                                      <label className='col-md-2 multilines-2line'>
                                        Add new address
                                        <a className='question'></a>
                                      </label>
                                      <div className='col-md-4'>
                                      <button onClick={this.onAddReceiver} type="button" className="add-btn"><i className="fas fa-plus"></i> Add</button>
                                      </div>
                                    </div>
                          </div> : null
                      }
                      { step === 5 ?
                        <form className='step5-form step-form'>
                        <div className="container">
                          <div className='row'>
                            <div className='col-md-4'>
                              <div className='w-100 info-block'>
                                <label>Token name</label>
                                <h3 >{token.name}</h3>
                              </div>
                              <div className='w-100 info-block'>
                                <label>Symbol</label>
                                <h3 >{token.symbol}</h3>
                              </div>
                              <div className='w-100 info-block'>
                                <label>Decimals</label>
                                <h3 >{token.decimals}</h3>
                              </div>

                            </div>
                            <div className='col-md-4'>
                              <div className='w-100 info-block'>
                                <label>Owner address</label>
                                <h3>{ico.owner}</h3>
                              </div>
                              <div className='w-100 info-block'>
                                <label>Funds address</label>
                                <h3>{ico.fundsAddress}</h3>
                              </div>
                              <div className='row info-block'>
                                <label className='col-md-6'>Tokens for sale</label>
                                <span className='col-md-6'>{stages.tokensForSale}</span>
                                <label className='col-md-6'>Burn unsold tokens after crowdsale</label>
                                <span className='col-md-6'>{String(ico.burnable).toUpperCase()}</span>
                                <label className='col-md-6'>Whitelisting</label>
                                <span className='col-md-6'>{String(ico.whitelisting).toUpperCase()}</span>
                              </div>

                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-md-4'>
                              <div className='info-block'>
                                <label className='w-100'>Total supply</label>
                                <h4 className='w-100'>{token.totalSupply}</h4>
                              </div>
                              <div className='info-block'>
                                <label className='w-100'>Token standard</label>
                                <h4 className='w-100'>{token.erc223 ? "ERC223" : "ERC20"}</h4>
                              </div>
                              <div className='info-block'>
                                <label className='w-100'>Pausable</label>
                                <h4 className='w-100'>{String(token.pausable).toUpperCase()}</h4>
                              </div>
                              <div className='info-block'>
                                <label className='w-100'>Freezable</label>
                                <h4 className='w-100'>{String(token.freezable).toUpperCase()}</h4>
                              </div>
                              <div className='info-block'>
                                <label className='w-100'>Future mintable</label>
                                <h4 className='w-100'>{String(token.mintable).toUpperCase()}</h4>
                              </div>
                            </div>
                            <div className='col-md-8'>
                              <div className='row'>
                                <label className='col-md-4'>Stages amount:</label>
                                <h3 className='col-md-8'>{stages.rounds.length}</h3>
                                { stages.rounds.map((stage, i) => (
                                <div key={i} className='info-block up-border'>
                                  <label className='col-md-4'>Stage name:</label>
                                  <span className='col-md-2'>{stage.name}</span>
                                  <label className='col-md-4'>Tokens for stage:</label>
                                  <span className='col-md-2'>{stage.tokensForSale}</span>
                                  <label className='col-md-4'>Stage token price:</label>
                                  <span className='col-md-2'>{stage.tokenPrice}</span>
                                  <label className='col-md-4'>Start date:</label>
                                  <span className='col-md-2'>{stage.startDate ? stage.startDate : "Not setted"}</span>
                                  <label className='col-md-4'>Finish date:</label>
                                  <span className='col-md-2'>{stage.finishDate ? stage.finishDate : "Not setted"}</span>
                                  <label className='col-md-4'>Min/Max investments amounts:</label>
                                  <span className='col-md-2'>{Number(stage.minInvest) ? Number(stage.minInvest) : "Not setted"} / {Number(stage.maxInvest) ? Number(stage.maxInvest) : "Not setted"}</span>
                                  
                                </div>
                                ))}

                              </div>
                            </div>
                          </div>                                                               
                        </div>
                        </form>: null
                            }

                      <div className="w-100 mb-5"></div>
                      <div className="col form-group">
                          { step > 1 ?
                              <button className="back-btn" onClick={this.goToPrev}>Prev</button> : null
                          }
                          { step < 5 ?
                              <button type="submit" className="next-btn">Continue</button> : null
                          }
                          { step === 5 ?
                              <button className="next-btn" onClick={this.onSubmit}>Deploy</button> : null
                          }
                      </div>
                  </form>
              
        
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

export default CreateStep1Form;
