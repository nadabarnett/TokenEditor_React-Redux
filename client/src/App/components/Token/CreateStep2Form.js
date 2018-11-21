import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";

class CreateStep2Form extends React.Component{
  constructor(props){
    super(props);
    this.state = {
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
  changeStartDateHandler(date){
    let formData = this.state.formData;
    formData['start_time'] = date;
    this.setState(...this.state, {formData: formData});
  }
  changeEndDateHandler(date){
    let formData = this.state.formData;
    formData['end_time'] = date;
    this.setState(...this.state, {formData: formData});
  }
  goNext(){
    const formData = this.state.formData;
    /*
    if(formData.owner_address==''||formData.investiments_address==''||formData.soft_cap==''||formData.hard_cap==''||formData.start_time==''||formData.end_time==''){
      alert('Please input owner_address, investiments_address, soft_cap, hard_cap, and dates.');
      return;
    }
    */

    return this.props.onNextBtn();
  }
  goBack(){
    return this.props.onBackBtn();
  }
  render() {
    return (
      <form className='step2-form step-form'>
        <div className='container'>
          <div className='row form-group'>
            <label className='col-md-2'>
              Owner address
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <input type='text' onChange={this.changeHandler('owner_address').bind(this)}/>
            </div>
            <label className='col-md-2'>
              Start time
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <DatePicker selected={this.state.formData.start_time}  onChange={this.changeStartDateHandler.bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-2 multilines-2line'>
              Investiments storage address
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <input type='text' onChange={this.changeHandler('investiments_address').bind(this)}/>
            </div>
            <label className='col-md-2'>
              End time
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <DatePicker selected={this.state.formData.end_time}  onChange={this.changeEndDateHandler.bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-2'>
              Soft Cap
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <input type='number' onChange={this.changeHandler('soft_cap').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-2'>
              Hard Cap
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <input type='number' onChange={this.changeHandler('hard_cap').bind(this)}/>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-2'>
              Whitelisting
              <a className='question'></a>
            </label>
            <div className='col-md-2'>
              <div className='toggle-btn'>
                <a className={this.state.formData.whitelisting=='yes'?'active':''} onClick={this.toggleHandler.bind(this,'whitelisting','yes')}>
                Yes
                </a>
                <a className={this.state.formData.whitelisting=='no'?'active':''} onClick={this.toggleHandler.bind(this,'whitelisting','no')}>
                No
                </a>
              </div>
            </div>
            <label className='col-md-2 multilines-2line'>
              Min/Max investiments
              <a className='question'></a>
            </label>
            <div className='col-md-2'>
              <div className='toggle-btn'>
                <a className={this.state.formData.minmax_investments=='yes'?'active':''} onClick={this.toggleHandler.bind(this,'minmax_investments','yes')}>
                Yes
                </a>
                <a className={this.state.formData.minmax_investments=='no'?'active':''} onClick={this.toggleHandler.bind(this,'minmax_investments','no')}>
                No
                </a>
              </div>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-2 multilines-2line'>
              Transferable dates
              <a className='question'></a>
            </label>
            <div className='col-md-2'>
              <div className='toggle-btn'>
                <a className={this.state.formData.transferable_dates=='yes'?'active':''} onClick={this.toggleHandler.bind(this,'transferable_dates','yes')}>
                Yes
                </a>
                <a className={this.state.formData.transferable_dates=='no'?'active':''} onClick={this.toggleHandler.bind(this,'transferable_dates','no')}>
                No
                </a>
              </div>
            </div>
            <label className='col-md-2 '>
              Changing dates
              <a className='question'></a>
            </label>
            <div className='col-md-2'>
              <div className='toggle-btn'>
                <a className={this.state.formData.changing_date=='yes'?'active':''} onClick={this.toggleHandler.bind(this,'changing_date','yes')}>
                Yes
                </a>
                <a className={this.state.formData.changing_date=='no'?'active':''} onClick={this.toggleHandler.bind(this,'changing_date','no')}>
                No
                </a>
              </div>
            </div>
          </div>
          <div className='row form-group'>
            <label className='col-md-2 multilines-2line'>
              Burn unsold tokens
              <a className='question'></a>
            </label>
            <div className='col-md-2'>
              <div className='toggle-btn'>
                <a className={this.state.formData.burn_unsold_tokens=='yes'?'active':''} onClick={this.toggleHandler.bind(this,'burn_unsold_tokens','yes')}>
                Yes
                </a>
                <a className={this.state.formData.burn_unsold_tokens=='no'?'active':''} onClick={this.toggleHandler.bind(this,'burn_unsold_tokens','no')}>
                No
                </a>
              </div>
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

export default CreateStep2Form;
