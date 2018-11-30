import React, { Component } from 'react'

class CreateStep5Form extends Component{
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
    return (
      <form className='step4-form step-form'>
      <div className='container'>
          <div className='row form-group'>
            <label className='col-md-2'>Filter by<a className='question'></a></label>
            <div className='col-md-8'>
              <div className='toggle-btn'>
                <a className={this.state.formData.standard=='ERC20'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC20')}>
                Banned
                </a>
                <a className={this.state.formData.standard=='ERC223'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC223')}>
                Allowed Countries
                </a>
              </div>
            </div>
          </div>
          <div className='row form-group'>
              <label className='col-md-2 multilines-2line'>
                Allowed Countries
                <a className='question'></a>
              </label>
              <div className='col-md-4'>
                <input type='text'/>
              </div>
          </div>
          <div className='row form-group'>
          <label className='col-md-2 multilines-2line'>
            Required before investing
            <a className='question'></a>
            </label>
            <div className='col-md-8'>
              <p style={{'marginBottom':'0','marginTop':'10px'}}>
                <input type="checkbox" className="check-block" checked={this.state.formData.pausable} />
                <label className="multilines-2line">Yes</label>
              </p>
              
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

export default CreateStep5Form;
