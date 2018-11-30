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
              Description
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <textarea type='text' onChange={this.changeHandler('owner_address').bind(this)}></textarea>
            </div>
            
          </div>
          <div className='row form-group'>
            <label className='col-md-2 multilines-2line'>
              Short Description
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <textarea type='text' onChange={this.changeHandler('investiments_address').bind(this)}></textarea>
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
