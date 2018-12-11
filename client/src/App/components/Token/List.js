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
        {tokens.map((token, i) =>{
          return (
            <li className='tr' key={i}>
              <ul>
                <li>{token.name}</li>
                <li>{token.symbol}</li>
                <li>
                  <span >{token.address}</span>
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
