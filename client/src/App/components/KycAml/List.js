import React, { Component } from 'react';

class TokenList extends Component{
  constructor(props) {
    super(props);
  }
  onClickItem(){
    this.props.onClickItem();
  }
  render() {
    const { tokens } = this.props;
    return (
      <ol className='table'>
        <li className='thead'>
          <ul>
            <li>
              Name
            </li>
            <li>
              Email
            </li>
            <li>
              Country
            </li>
            <li>
              Wallet address
            </li>
            <li>
              Verified
            </li>
            <li>
              Action
            </li>
          </ul>
        </li>
        {tokens.map((token, i) =>{
          return (
            <li className='tr' key={i}>
              <ul>
                <li>{token.name}</li>
                <li>{token.email}</li>
                <li>{token.country}</li>
                <li>{token.address}</li>
                <li>{token.verified}</li>
                <li>
                  <button className='approve-btn' onClick><span>&#x2714;</span> Manage</button>

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
