import React, { Component } from 'react'
import Switch from 'react-switch';

class Manage3rdForm extends React.Component{
	constructor(props){
		super(props);
		this.state = {}
	};

	render() {
		return (
			<form className='third-form'>
        <div className='row'>
          <div className='col-md-8'>
            <div className='display-block'>
              <h4>Mint token</h4>
              <div className='form-group row'>
                <div className='col-md-4'>
                  <label>
                    Receiver address
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
                  <button type='button' className='mint-btn'>
                    Mint
                  </button>
                </div>
              </div>
            </div>
            <div className='display-block'>
              <h4> Freeze / Unfreeze address </h4>
              <div className='form-group row'>
                <div className='col-md-4'>
                  <label>
                    Address
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
                  <button type='button' className='freeze-btn'>
                    Freeze
                  </button>
									<button type='button' className='unfreeze-btn'>
                    Unfreeze
                  </button>
                </div>
              </div>
            </div>
						<div className='display-block'>
              <h4> Transfer ownership </h4>
              <div className='form-group row'>
                <div className='col-md-4'>
                  <label>
                    Address
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
                  <button type='button' className='transfer-btn'>
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
				<div className='row form-actions'>
          <div className='col-md-12'>
            <button className='emergency-resume-btn'>Emergency resume</button>
            <button className='emergency-pause-btn'>Emergency pause</button>
          </div>
				</div>
      </form>
		)
	}
}

export default Manage3rdForm;