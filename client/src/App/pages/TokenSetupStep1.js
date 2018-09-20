import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Switch from 'react-toggle-switch';

class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
          showHideSidenav: "",
          switched: false
        }
    }
    componentDidMount(){
        document.body.id="token-setup-step1"
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    toggleSwitch = () => {
        this.setState(prevState => {
            return {
            switched: !prevState.switched
            };
        });
    };

    render() {
        return (

        <div className="container my-4">
            <div className="row text-center my-10">
            <div className="col mb-5">
                <div className="editor-token-setup">
                    <div className="step-section text-uppercase">
                        Step 1/5
                    </div>
                    <h2 className="title-section text-uppercase">Token Setup</h2>
                </div>
            </div>
            <div className="w-100 my-2"></div>
            <div className="col">
                <form className="row justify-content-center" onSubmit={this.handleSubmit}>
                    <div className="col-md-5 form-group">
                        <p>Token name <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Token Name tooltip on top"></i></p>
                        <input type="text" className="editor-input w-100" placeholder="My Token Name" />
                    </div>

                    <div className="w-100"></div>
                    <div className="col-md-5 form-group">
                        <p>Token symbol <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Token symbol tooltip on top"></i></p>
                        <input type="text" className="editor-input w-100" placeholder="MTN" />
                    </div>

                    <div className="w-100"></div>
                    <div className="col-md-5 form-group">
                        <p>Decimals <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Number of decimals Price tooltip on top"></i></p>
                        <input type="text" className="editor-input w-100" placeholder="18" />
                    </div>

                    <div className="w-100"></div>
                    <div className="col-md-5 form-group">
                        <p>Initial supply <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                        <input type="text" className="editor-input w-100" placeholder="100000000" />
                    </div>

                    <div className="w-100"></div>
                    <div className="col-md-5 mt-3 form-group">
                        <p>Token standard <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                        <div className="row justify-content-center">
                            ERC20
                            <span className="span-space" />
                            <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                            <span className="span-space" />
                            ERC223
                        </div>
                    </div>

                    <div className="w-100"></div>
                    <div className="col-md-5 mt-3 form-group">
                        <p>Token type <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                        <div className="d-flex justify-content-between form-group">
                            <label for="pausable">Pausable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                            <input type="checkbox" id="pausable" className="check-block"/>
                        </div>
                        <div className="d-flex justify-content-between form-group">
                            <label for="freezable">Freezable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                            <input type="checkbox" id="freezable" className="check-block"/>
                        </div>
                        <div className="d-flex justify-content-between form-group">
                            <label for="mintable">Future minting <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                            <input type="checkbox" id="mintable" className="check-block"/>
                        </div>
                    </div>

                    <div className="w-100"></div>
                    <div className="col form-group">
                        <Link to={'/step2'}>
                            <button className="editor-btn big">Continue</button>
                        </Link>
                    </div>
                </form>
            </div>
            </div>
        </div>
        );
    }
}

export default Register;
