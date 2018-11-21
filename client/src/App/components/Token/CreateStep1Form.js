import React, { Component } from 'react'
import Switch from 'react-switch';
// import Toggle from "react-toggle-component"
// import "react-toggle-component/styles.css"

class CreateStep1Form extends React.Component{
  constructor(props){
    super(props);
    this.state = {
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
  }
  toggleHandler(key, value) {
    let formData = this.state.formData;
    formData[key] = value;
    this.setState(...this.state, {formData: formData});
  }
  changeHandler(key){
    return function(event){
      let formData = this.state.formData;
      formData[key] = event.target.value;
      this.setState(...this.state, {formData: formData});
    }
  }
  checkedHandler(key){
    return function(event){
      let formData = this.state.formData;
      formData[key] = event.target.checked;
      this.setState(...this.state, {formData: formData});
    }
  }
  goNext(){
    const formData = this.state.formData;
    /*
    if(formData.name==''||formData.symbol==''||formData.decimals==''||formData.initial==''){
      alert('Please input name, symbol, decimals, initial.');
      return;
    }
    */

    return this.props.onNextBtn();
  }
  render() {
    return(
      <form className='step1-form step-form'>
        <div className='container'>
          <div className='row form-group'>
            <label className='col-md-4'>
              Token Name
              <a className='question'></a>
            </label>
            <div className='col-md-8'>
              <input type='text' onChange={this.changeHandler('name').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Token Symbol<a className='question'></a></label>
            <div className='col-md-8'>
              <input type='text' onChange={this.changeHandler('symbol').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Decimals<a className='question'></a></label>
            <div className='col-md-8'>
              <input type='number' placeholder='18' onChange={this.changeHandler('decimals').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Initial<a className='question'></a></label>
            <div className='col-md-8'>
              <input type='number' placeholder='1000000000' onChange={this.changeHandler('initial').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Token Standard<a className='question'></a></label>
            <div className='col-md-8'>
              <div className='toggle-btn'>
                <a className={this.state.formData.standard=='ERC20'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC20')}>
                ERC20
                </a>
                <a className={this.state.formData.standard=='ERC223'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC223')}>
                ERC223
                </a>
              </div>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Token type<a className='question'></a></label>
            <div className='col-md-8'>
              <p style={{'marginBottom':'0'}}>
                <label className='token-type'>Pausable token</label>
                <input type="checkbox" className="check-block" checked={this.state.formData.pausable} onChange={this.checkedHandler('pausable').bind(this)}/>
                <a className='question'></a>
              </p>
              <p style={{'marginBottom':'0'}}>
                <label className='token-type'>Freezable token</label>
                <input type="checkbox" className="check-block" checked={this.state.formData.freezable} onChange={this.checkedHandler('freezable').bind(this)}/>
                <a className='question'></a>
              </p>
              <p style={{'marginBottom':'0'}}>
                <label className='token-type'>Future minting</label>
                <input type="checkbox" className="check-block" checked={this.state.formData.mintable} onChange={this.checkedHandler('mintable').bind(this)}/>
                <a className='question'></a>
              </p>
            </div>
          </div>
          <div className='row form-actions'>
            <button className='next-btn' type='button' onClick={this.goNext.bind(this)}>Continue</button>
          </div>
        </div>
      </form>
    )
  }
}

export default CreateStep1Form;
