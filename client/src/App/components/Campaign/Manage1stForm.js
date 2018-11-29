import React, { Component } from 'react'
import Switch from 'react-switch';

class Manage1stForm extends React.Component{
	constructor(props){
		super(props);
		this.state = {}
	};

	render() {
		return (
			<form className="first-form">
				<div className='form-group row'>
					<div className='display-block col-md-12'>
						<label style={{textTransform:'uppercase'}}>Example Token name / symbol</label>
					</div>
				</div>
        <div className='form-group row'>
					<div className='col-md-4 display-block'>
						<label>Total supply</label>
						<h4>EXT 237,650,000</h4>
					</div>
					<div className='col-md-8'>
						<div className='display-block'>
              <div className='row'>
                <label className="col-md-3">Creation date:</label>
                <span className='col-md-3'>01 / 10 / 2018</span>
              </div>
              <div className='row'>
                <label className="col-md-3">Creation time:</label>
                <span className='col-md-3'>23 : 11 : 57</span>
              </div>
						</div>
            <div className='display-block up-border'>
              <div className='row'>
                <label className="col-md-3">Pausable:</label>
                <span className='col-md-3'>TRUE</span>
                <label className="col-md-3">Mintable:</label>
                <span className='col-md-3'>TRUE</span>
              </div>
              <div className='row'>
                <label className="col-md-3">Freezable:</label>
                <span className='col-md-3'>TRUE</span>
                <label className="col-md-3">Decimals:</label>
                <span className='col-md-3'>18</span>
              </div>
						</div>

					</div>
				</div>
				<div className='form-acitons row'>
					<div className='col-md-12'>
						<button type='button' className='see-btn'>
              See on Etherscan
						</button>
					</div>
				</div>
			</form>
		)
	}
}

export default Manage1stForm;