import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";

class CreateStep3Form extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      formData: {
        stages: [
          {
            name: '',
            price: '',
            token_count: '',
            min_contribution_amount: '',
            max_contribution_amount: '',
            start_date: '',
            finish_date: ''
          }
        ]
      }
    }
  }
  addStage(){
    let { stages } = this.state.formData;
    stages.push({
      token_name: '',
      token_price: '',
      token_count: '',
      min_contribution_amount: '',
      max_contribution_amount: '',
      start_date: '',
      finish_date: ''
    })
    this.setState(...this.state,{
      formData:{
        stages: stages
      }
    })
  }
  changeHandler(index, key){
    return function(event){
      let stages = this.state.formData.stages;
      stages[index][key] = event.target.value;

      this.setState(...this.state, {formData: {stages: stages}});
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
  render(){
    const { stages } = this.state.formData;
    return (
      <form className='step3-form step-form'>
        <div className='container'>
          {stages.map((stage, i) => (
            <div key={i}>
              <div className='row form-group'>
                <label className='col-md-2'>
                  Stage name
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <input type='text' onChange={this.changeHandler(i, 'token_name').bind(this)}/>
                </div>
                <label className='col-md-2'>
                  Start date
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <DatePicker />
                </div>
              </div>
              <div className='row form-group'>
                <label className='col-md-2'>
                  Token price
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <input type='text' onChange={this.changeHandler(i, 'token_price').bind(this)}/>
                </div>
                <label className='col-md-2'>
                  Finish date
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <DatePicker  />
                </div>
              </div>
              <div className='row form-group'>
                <label className='col-md-2 multilines-2line'>
                  Tokens for this page
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <input type='number' onChange={this.changeHandler(i, 'token_count').bind(this)}/>
                </div>
              </div>
              <div className='row form-group'>
                <label className='col-md-2 multilines-2line'>
                  Min contribution amount(ETH)
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <input type='number' onChange={this.changeHandler(i, 'min_contribution_amount').bind(this)}/>
                </div>
              </div>
              <div className='row form-group'>
                <label className='col-md-2 multilines-2line'>
                  Max contribution amount(ETH)
                  <a className='question'></a>
                </label>
                <div className='col-md-4'>
                  <input type='number' onChange={this.changeHandler(i, 'min_contribution_amount').bind(this)}/>
                </div>
              </div>
            </div>
          ))}
          <div className='row form-group'>
            <label className='col-md-2 multilines-2line'>
              Create new stages
              <a className='question'></a>
            </label>
            <div className='col-md-4'>
              <button type='button' className='add-btn' onClick={this.addStage.bind(this)}>+ Add</button>
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

export default CreateStep3Form;
