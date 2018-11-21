import React, { Component } from 'react'

class CreateStep5Form extends Component{
  constructor(props){
    super(props);
    this.state = {
      formData: {

      }
    }
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
      <form className='step5-form step-form'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-4'>
              <div className='w-100 info-block'>
                <label>Coin or Token name / symbol</label>
                <h3 >ExampleToken/ETX</h3>
              </div>
              <div className='w-100 info-block'>
                <label>Crowdsale setup name</label>
                <h3 >Example</h3>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='w-100 info-block'>
                <label>Wallet address</label>
                <h3>0x1ca3q56rd23123asdqwe213</h3>
              </div>
              <div className='row info-block'>
                <label className='col-md-6'>Start time:</label>
                <span className='col-md-6'>01 / 10 / 2018</span>
                <label className='col-md-6'>End time:</label>
                <span className='col-md-6'>01 / 10 / 2018</span>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4'>
              <div className='info-block'>
                <label className='w-100'>First Period</label>
                <h4 className='w-100'>8</h4>
              </div>
              <div className='info-block'>
                <label className='w-100'>Second Period</label>
                <h4 className='w-100'>10</h4>
              </div>
              <div className='info-block'>
                <label className='w-100'>Third Period</label>
                <h4 className='w-100'>15</h4>
              </div>
            </div>
            <div className='col-md-8'>
              <div className='row'>
                <div className='info-block up-border'>
                  <label className='col-md-4'>Version number of token:</label>
                  <span className='col-md-2'>1.0</span>
                  <label className='col-md-4'>Token Price (ETH):</label>
                  <span className='col-md-2'>0.5 ETH</span>
                  <label className='col-md-4'>Initial supply:</label>
                  <span className='col-md-2'>10 000 000</span>
                  <label className='col-md-4'>Supply:</label>
                  <span className='col-md-2'>10 000</span>
                  <label className='col-md-4'>Number of decimals:</label>
                  <span className='col-md-2'>8</span>
                  <label className='col-md-4'>Duration:</label>
                  <span className='col-md-2'>30</span>
                  <label className='col-md-4'>ICO type:</label>
                  <span className='col-md-2'>Hard Cup</span>
                  <label className='col-md-4'>Burn token:</label>
                  <span className='col-md-2'>No</span>
                </div>
                <div className='info-block up-border'>
                  <label className='col-md-4'>First bonus:</label>
                  <span className='col-md-2'>20</span>
                  <label className='col-md-4'>Second bonus:</label>
                  <span className='col-md-2'>10</span>
                  <label className='col-md-4'>Third bonus:</label>
                  <span className='col-md-2'>15</span>
                  <label className='col-md-4'>Presale bonus:</label>
                  <span className='col-md-2'>50</span>
                </div>
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

export default CreateStep5Form;
