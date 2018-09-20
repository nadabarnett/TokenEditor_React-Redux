import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Register extends Component {

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
                        Step 3/5
                    </div>
                    <h2 className="title-section text-uppercase">Stages</h2>
                </div>
            </div>
            <div className="w-100 my-2"></div>
            <div className="col">
              <form className="row justify-content-center" onSubmit={this.handleSubmit}>
                  <div className="col">
                      <div className="row justify-content-center">
                        <div className="col-md-12 form-group">
                          <p>Stage name <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: Private sale"></i></p>
                          <input type="number" className="editor-input w-100" placeholder="10" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 form-group">
                          <p>Start date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: 1000 (1 ETH = 1000 Tokens)"></i></p>
                          <input type="date" className="editor-input w-100" placeholder="01.10.2018" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 form-group">
                          <p>Tokens for this stage <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Third Period tooltip on top"></i></p>
                          <input type="number" className="editor-input w-100" placeholder="ex: 10000" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 form-group">
                          <p>Maximum contribution amount (ETH) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Forth Period tooltip on top"></i></p>
                          <input type="number" className="editor-input w-100" placeholder="1000 " />
                        </div>
                        <div className="w-100"></div>
                      </div>
                  </div>
                  <div className="col">
                      <div className="row justify-content-center">
                        <div className="col-md-12 form-group">
                          <p>Token price <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="ex: 1000 (1 ETH = 1000 Tokens)"></i></p>
                          <input type="number" className="editor-input w-100" placeholder="10" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 form-group">
                          <p>Finish date <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Second Bonus tooltip on top"></i></p>
                          <input type="date" className="editor-input w-100" placeholder="01.10.2018" />
                        </div>
                        <div className="w-100"></div>

                        <div className="col-md-12 form-group">
                          <p>Minimum contribution amount (ETH) <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Third Bonus tooltip on top"></i></p>
                          <input type="number" className="editor-input w-100" placeholder="10" />
                        </div>
                        <div className="w-100"></div>

                        <div className="w-100"></div>
                        <div className="col-md-6 form-group">
                            <p>Create new stages <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Presale Bonus tooltip on top"></i></p>
                            <button className="editor-btn big"><i className="fa fa-plus"></i> Add</button>
                        </div>
                      </div>
                  </div>
                  <div className="w-100"></div>
                  <div className="col form-group">
                    <Link to={'/step2'}>
                        <button className="editor-btn big">Back</button>
                      </Link>
                    <Link to={'/step4'}>
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
