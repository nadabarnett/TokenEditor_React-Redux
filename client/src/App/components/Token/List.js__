import React, { Component } from 'react';
import { controllerAbi, tokenAbi, crowdsaleAbi, controllerAddress } from './../ContractStore';
const web3Context = window.web3;
class TokenList extends Component{
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
  }
  onClickItem(){
    this.props.onClickItem();
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
            })
            .then((crowdsaleInfo) => {
                return new Promise((resolve, reject) => {
                    crowdsaleInstance.token((error, tokenAddress) => {
                        if(!error)
                            return resolve([crowdsaleInfo, tokenAddress])
                        else
                            return reject(error)
                    })
                })
            })
            .then(data => {
                return new Promise((resolve, reject) => {
                    const tokenContract = web3Context.eth.contract(tokenAbi).at(data[1]);
                    tokenContract.symbol((error, symbol) => {
                        if(!error)
                            return resolve([data, symbol])
                        else
                            return reject(error)
                    })
                })
            })
            .then(final => {
                const symbol = final[1];
                const data = final[0][0];

                const contract = {
                    tokenSymbol: symbol,
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
    const { tokens } = this.props;
    return (
      <ol className='table'>
        <li className='thead'>
          <ul>
            <li>
              Token Name
            </li>
            <li>
              Symbol
            </li>
            <li>
              Address
            </li>
          </ul>
        </li>
        { this.state.contracts.map((contract, i) => {
          return (
            <li className='tr' key={i}>
              <ul>
                <li>{contract.tokenSymbol}</li>
                <li>{contract.tokenSymbol}</li>
                <li>
                  <span >{"https://rinkeby.etherscan.io/address/" + contract.address}</span>
                  <button className='edit-btn' onClick={this.onClickItem.bind(this)}></button>
                </li>
              </ul>
            </li>
          )
        })}
          
      </ol>
    )
  }
}

export default TokenList;
