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
              Title
              <a className='question'></a>
            </label>
            <div className='col-md-8'>
              <input type='text' onChange={this.changeHandler('name').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Crowdsale<a className='question'></a></label>
            <div className='col-md-8'>
              <input type='text' onChange={this.changeHandler('symbol').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Category<a className='question'></a></label>
            <div className='col-md-8'>
              <input type='text' onChange={this.changeHandler('decimals').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Tag<a className='question'></a></label>
            <div className='col-md-8'>
              <input type='text'onChange={this.changeHandler('initial').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Country<a className='question'></a></label>
            <div className='col-md-8'>
              <input type='text' onChange={this.changeHandler('initial').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4'>Affiliate<a className='question'></a></label>
            <div className='col-md-8'>
              <div className='toggle-btn'>
                <a className={this.state.formData.standard=='ERC20'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC20')}>
                ON
                </a>
                <a className={this.state.formData.standard=='ERC223'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC223')}>
                OFF
                </a>
              </div>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-4 multilines-2line'>
              Affiliate bonus amount %
              <a className='question'></a>
            </label>
            <div className='col-md-8'>
              <input type='text' onChange={this.changeHandler('initial').bind(this)}/>
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
