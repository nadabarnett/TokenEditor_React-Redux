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
              Date
            </li>
            <li>
              Country
            </li>
            <li>
              Token
            </li>
            <li>
              Token amount
            </li>
            <li>
              Source amount
            </li>
            <li>
              Username
            </li>
            <li>
              Fee
            </li>
          </ul>
        </li>
        {tokens.map((token, i) =>{
          return (
            <li className='tr' key={i}>
              <ul>
                <li>{token.date}</li>
                <li>{token.country}</li>
                <li>{token.tokenname}</li>
                <li>{token.tokenamount}</li>
                <li>{token.sourceamount}</li>
                <li>{token.username}</li>
                <li>{token.fee}</li>
              </ul>
            </li>
          )
        })}
      </ol>
    )
  }
}

export default TokenList;
