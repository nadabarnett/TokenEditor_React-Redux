import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Switch from 'react-toggle-switch';


class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {switched: false}
    }

    toggleSwitch = () => {
        this.setState(prevState => {
            return {
            switched: !prevState.switched
            };
        });
    };

    componentDidMount(){
        document.body.id="token-setup-step1"
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="container my-4">
                <div className="row text-center my-10">
                    <div className="col mb-5">
                        <div className="editor-token-setup">
                            <div className="step-section text-uppercase">
                                Step 4/5
                            </div>
                            <h2 className="title-section text-uppercase">Token distribution (team, advisors ...)</h2>
                        </div>
                    </div>
                    <div className="w-100 my-2"></div>
                    <div className="col">
                        <form className="row justify-content-center" onSubmit={this.handleSubmit}>
                            <div className="w-100"></div>
                            <div className="col">
                                <div className="row justify-content-center">
                                    <div className="col-md-12 form-group">
                                        <p>Address</p>
                                        <input type="text" className="editor-input w-100" placeholder="ex. 0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <div className="d-flex justify-content-between form-group">
                                            <div className="col-md-6 form-group">
                                                <p>Frozen</p>
                                                <div className="row justify-content-center">
                                                    Yes
                                                    <span className="span-space" />
                                                    <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                                    <span className="span-space" />
                                                    No
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                            <p>Until date</p>
                                            <input type="date" className="editor-input w-100 min-w-100" placeholder="01.10.2018" />
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row justify-content-center">
                                    <div className="col-md-12 form-group">
                                        <p>Amount</p>
                                        <input type="text" className="editor-input w-100" placeholder="ex. 100000" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 my-4 form-group">
                                        <button type="button" className="editor-btn main">
                                            <i className="fas fa-plus"></i>
                                            <span>&nbsp;&nbsp; Add new address</span>
                                        </button>
                                    </div>
                                    <div className="w-100"></div>
                                </div>
                            </div>
                            <div className="w-100"></div>
                            <div className="col form-group">
                                <Link to={'/step3'}>
                                    <button className="editor-btn big">Back</button>
                                </Link>
                                <Link to={'/step5'}>
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
