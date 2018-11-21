import React, { Component } from 'react'
import Switch from 'react-switch';

class Manage2ndForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  };

  render() {
    return (
      <form className='second-form'>
        <div className='row'>
          <div className='col-md-8'>
            <div className='display-block'>
              <h4>Transfer token </h4>
              <div className='form-group row'>
                <div className='col-md-4'>
                  <label>
                    ETH address
                    <a className='question'></a>
                  </label>
                </div>
                <div className='col-md-8'>
                  <input type='text'/>
                </div>
              </div>
              <div className='form-group row'>
                <div className='col-md-4'>
                  <label>
                    Amound of tokens
                    <a className='question'></a>
                  </label>
                </div>
                <div className='col-md-8'>
                  <input type='number'/>
                </div>
              </div>
              <div className='form-actions row'>
                <div className='col-md-4'></div>
                <div className='col-md-8'>
                  <button type='button' className='send-token-btn'>
                    Send token
                  </button>
                </div>
              </div>
            </div>
            <div className='display-block'>
              <h4> Burn unsold tokens </h4>
              <div className='form-group row'>
                <div className='col-md-4'>
                  <label>
                    Amound of tokens
                    <a className='question'></a>
                  </label>
                </div>
                <div className='col-md-8'>
                  <input type='number'/>
                </div>
              </div>
              <div className='form-actions row'>
                <div className='col-md-4'></div>
                <div className='col-md-8'>
                  <button type='button' className='burn-btn'>
                    Burn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }    
}

export default Manage2ndForm;