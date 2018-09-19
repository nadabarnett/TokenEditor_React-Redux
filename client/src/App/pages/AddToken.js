import React, { Component } from 'react';
import Switch from 'react-toggle-switch';

import { Link } from 'react-router-dom';

class AddToken extends Component {

    constructor(props) {
        super(props)
        this.state = {
          showHideSidenav: "",
          switched: false
        }
    }

    componentDidMount() {
        document.body.id = "";
    }

    toggleSidenav() {
        var css = (this.state.showHideSidenav === "active") ? "" : "active";
        this.setState({ "showHideSidenav": css });
    }

    toggleSwitch = () => {
        this.setState(prevState => {
            return {
            switched: !prevState.switched
            };
        });
    };

    render() {
        console.log(this.props);
        return (
            <div className="wrapper">
                <nav id="sidebar" className={this.state.showHideSidenav}>
                    <div className="sidebar-header">
                        <h5><img width="25%" height="25%" src="https://i.imgur.com/sMK1rIY.png" />Token Editor</h5>
                    </div>

                    <ul className="list-unstyled">
                        <li>
                            <a href="/Crowdsales"><i className="fas fa-lg fa-trophy"></i> Crowdsales</a>
                        </li>
                        <li>
                            <a href="/compaign"><i className="fas fa-lg fa-sign"></i> Campaigns</a>
                        </li>
                        <li>
                            <a href="/KycAml"><i className="fas fa-lg fa-sign"></i> KYC/AML</a>
                        </li>
                        <li>
                            <a href="/Transactions"><i className="fas fa-lg fa-chart-bar"></i> Transactions</a>
                        </li>
                        <li>
                            <a href="/Affiliate"><i className="fas fa-lg fa-users"></i> Affiliate</a>
                        </li>
                        <li>
                            <a href="/setting"><i className="fas fa-lg fa-cog"></i> Settings</a>
                        </li>
                    </ul>
                    <div className="row my-5 px-2 align-items-center no-gutters">
                        <div className="col">
                            <i className="fas fa-2x fa-user"></i>
                        </div>
                        <div className="col">
                            <p className="m-0">Oleh</p>
                            <span className="profile-email">typicaladmsky@gmail.com</span>
                        </div>
                        {this.props.location.state ? (
                            <div className="col">
                                <a href={"https://etherscan.io/address/" + this.props.location.state.address} target="_blank" className="m-0 break-word link">{this.props.location.state.address}</a>
                            </div>
                        ) : null}
                    </div>
                    <div className="row justify-content-center main-color my-5">
                        <div className="col-auto">
                            <a href="http://twitter.com/" target="_blank"><i className="fab fa-lg fa-twitter"></i></a>
                        </div>
                        <div className="col-auto">
                            <a href="http://www.facebook.com/" target="_blank"><i className="fab fa-lg fa-facebook-f"></i></a>
                        </div>
                        <div className="col-auto">
                            <a href="https://medium.com/" target="_blank"><i className="fab fa-lg fa-medium-m"></i></a>
                        </div>
                        <div className="col-auto">
                            <a href="https://www.youtube.com/" target="_blank"><i className="fab fa-lg fa-youtube"></i></a>
                        </div>
                    </div>
                    <p className="text-muted text-center my-5">@ 2018 Token Editor</p>
                </nav>
                <div id="content" className="mb-5">
                    <nav className="navbar navbar-expand-lg">
                        <div className="container-fluid">
                            <button type="button" id="sidebarCollapse" onClick={this.toggleSidenav.bind(this)} className="editor-btn main">
                                <i className="fas fa-align-left"></i>
                                <span> Collapse menu</span>
                            </button>
                            <button className="editor-btn main d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <i className="fas fa-align-justify"></i>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="nav navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <Link to={'/'} className="nav-link">
                                            Log out
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className="container-fluid px-md-5">
                        <div className="row my-4 text-center">
                        <div className="col col-md-12">
                            <div className="row justify-content-center">
                                <h2 className="text-uppercase">Create token contract</h2>
                            </div>
                            <form className="row justify-content-left my-4" onSubmit={this.handleSubmit}>
                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 form-group">
                                        <p>Token name</p>
                                        <input type="text" className="editor-input w-100" placeholder="My Token Name" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Token symbol</p>
                                        <input type="text" className="editor-input w-100" placeholder="MTN" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Decimals</p>
                                        <input type="text" className="editor-input w-100" placeholder="18" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Token standard</p>
                                        <div className="row justify-content-center">
                                            ERC20
                                            <span className="span-space" />
                                            <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                            <span className="span-space" />
                                            ERC223
                                        </div>
                                    </div>
                                    <div className="w-100"></div>
                                </div>
                                <div className="w-100"></div>
                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 form-group">
                                        <p>Token owner</p>
                                        <input type="text" className="editor-input w-100" placeholder="ex. 0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80" />
                                    </div>
                                    <div className="w-100"></div>
                                    <div className="col-md-12 form-group">
                                        <p>Token type</p>
                                        <div className="d-flex justify-content-between form-group">
                                            <label for="pausable">Pausable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" id="pausable" className="check-block"/>
                                        </div>
                                        <div className="d-flex justify-content-between form-group">
                                            <label for="freezable">Freezable token <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" id="freezable" className="check-block"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100"></div>
                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 form-group">
                                        <p><b>Add address for distribution</b></p><hr/>
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Address</p>
                                        <input type="text" className="editor-input w-100" placeholder="ex. 0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80" />
                                    </div>
                                    <div className="w-100"></div>

                                    <div className="col-md-12 form-group">
                                        <p>Amount</p>
                                        <input type="text" className="editor-input w-100" placeholder="ex. 100000" />
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

                                    <button type="button" className="editor-btn main">
                                        <i className="fas fa-plus"></i>
                                        <span>&nbsp;&nbsp; Add new address</span>
                                    </button>
                                </div>
                                <div className="w-100"></div>
                                <div className="col-lg-4 input-card px-3 py-4 my-3">
                                    <div className="col-md-12 m-0 form-group">
                                        <div className="d-flex m-0 justify-content-between form-group">
                                            <label className="m-0" for="mintable">Future minting <i className="fa fa-question-circle main-color" data-toggle="tooltip" data-placement="top" title="Start Time tooltip on top"></i></label>
                                            <input type="checkbox" id="mintable" className="check-block"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100"></div>
                                <div className="col-md-4 col-md-push-8">
                                    <button className="editor-btn main big" onClick={this.openModal}><i className="fa fa-plus-circle"></i>&nbsp;&nbsp; Deploy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddToken;
