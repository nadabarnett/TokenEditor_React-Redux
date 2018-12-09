import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";

class CreateStep4Form extends Component{
  constructor(props){
    super(props);
    this.state = {
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
  }
  changeHandler(index, key){
    return function(event){
      let addresses = this.state.formData.addresses;
      addresses[index][key] = event.target.value;

      this.setState(...this.state, {formData: {addresses: addresses}});
    }
  }
  toggleHandler(index, key, value) {
    let addresses = this.state.formData.addresses;
    addresses[index][key] = value;

    this.setState(...this.state, {formData: {addresses: addresses}});
  }
  addAddress(){
    let { addresses } = this.state.formData;
    addresses.push({
      address: '',
      until_date: '',
      amount: '',
      frozen: 'yes'
    })
    this.setState(...this.state,{
      formData:{
        addresses: addresses
      }
    })
  }
  goNext(){
    const formData = this.state.formData;
    /*
    */

    return this.props.onNextBtn();
  }
  goBack(){
    return this.props.onBackBtn();
  }
  render(){
    const { addresses } = this.state.formData;
    return(
      <form className='step4-form step-form'>
        <div className='container'>
          {addresses.map((address, i) => (
            <div key={i}>
              <div className='row form-group'>
                <label className='col-md-2'>
                  Address
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <input type='text' onChange={this.changeHandler(i, 'address').bind(this)}/>
                </div>
                <label className='col-md-2'>
                  Until date
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <DatePicker />
                </div>
              </div>
              <div className='row form-group'>
                <label className='col-md-2'>
                  Amount
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <input type='number' onChange={this.changeHandler(i, 'amount').bind(this)}/>
                </div>
              </div>
              <div className='row form-group'>
                <label className='col-md-2'>
                  Frozen
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <div className='toggle-btn'>
                    <a className={address.frozen=='yes'?'active':''} onClick={this.toggleHandler.bind(this,i, 'frozen','yes')}>
                    Yes
                    </a>
                    <a className={address.frozen=='no'?'active':''} onClick={this.toggleHandler.bind(this,i, 'frozen','no')}>
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
              <button type='button' className='add-btn' onClick={this.addAddress.bind(this)}>+ Add</button>
            </div>
          </div>
          <div className='row form-actions'>
            <button className='back-btn' type='button' onClick={this.goBack.bind(this)}>
              Back
            </button>
            <button className='next-btn' type='button' onClick={this.goNext.bind(this)}>Continue</button>
          </div>
        </div>
      </form>
    )
  }
}

export default CreateStep4Form;
