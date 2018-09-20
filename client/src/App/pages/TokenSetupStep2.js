import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Switch from 'react-toggle-switch';


class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
                      Step 2/5
                  </div>
                  <h2 className="title-section text-uppercase">ICO Setup</h2>
              </div>
          </div>
          <div className="w-100 my-2"></div>
          <div className="col">
            <form className="row justify-content-center" onSubmit={this.handleSubmit}>

                <div className="col">
                    <div className="row justify-content-center">
                        <div className="col-md-12 form-group">
                            <p>Owner address <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Wallet address tooltip on top"></i></p>
                            <input type="text" className="editor-input w-100" placeholder="ex: 0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 form-group">
                            <p>Start time <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></p>
                            <input type="date" className="editor-input w-100" placeholder="01.10.2018" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 form-group">
                            <p>Soft Cap <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Wallet address tooltip on top"></i></p>
                            <input type="text" className="editor-input w-100" placeholder="For disable soft cap don't fill this field" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 mt-3 form-group">
                            <p>Whitelisting <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                            <div className="row justify-content-center">
                                Yes
                                <span className="span-space" />
                                <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                <span className="span-space" />
                                No
                            </div>
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 mt-3 form-group">
                            <p>Transferable dates <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                            <div className="row justify-content-center">
                                Yes
                                <span className="span-space" />
                                <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                <span className="span-space" />
                                No
                            </div>
                        </div>
                        <div className="w-100"></div>
                    </div>
                </div>

                <div className="col">
                    <div className="row justify-content-center">
                        <div className="w-100"></div>
                        <div className="col-md-12 form-group">
                            <p>Investments storage address <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Token Price tooltip on top"></i></p>
                            <input type="number" className="editor-input w-100" placeholder="ex: 0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80" />
                        </div>

                        <div className="w-100"></div>
                        <div className="col-md-12 form-group">
                            <p>End time <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="End Time tooltip on top"></i></p>
                            <input type="date" className="editor-input w-100" placeholder="01.10.2018" />
                        </div>

                        <div className="col-md-12 form-group">
                            <p>Hard Cap<i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Wallet address tooltip on top"></i></p>
                            <input type="text" className="editor-input w-100" placeholder="ex: 1000000" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 mt-3 form-group">
                            <p>Changin dates <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                            <div className="row justify-content-center">
                                Yes
                                <span className="span-space" />
                                <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                <span className="span-space" />
                                No
                            </div>
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 mt-3 form-group">
                            <p>Minimum/max investments <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                            <div className="row justify-content-center">
                                Yes
                                <span className="span-space" />
                                <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                <span className="span-space" />
                                No
                            </div>
                        </div>
                        <div className="w-100"></div>
                    </div>
                </div>

                <div className="w-100"></div>
                <div className="col form-group">
                   <div className="col-md-12 mt-3 form-group">
                        <p>Burn unsold tokens <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Initial supply tooltip on top"></i></p>
                        <div className="row justify-content-center">
                            Yes
                            <span className="span-space" />
                            <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                            <span className="span-space" />
                            No
                        </div>
                    </div>
                </div>

                <div className="w-100"></div>
                <div className="col form-group mt-5">
                    <Link to={'/step1'}>
                      <button className="editor-btn big">Back</button>
                    </Link>
                  <Link to={'/step3'}>
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
