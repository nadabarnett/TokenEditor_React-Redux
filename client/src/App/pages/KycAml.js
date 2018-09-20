import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import Modal                from 'react-modal';
const customStyles = {
  content : {
    width                 : '70%',
    height                : '102%',
    top                   : '52%',
    left                  : '50%',
    right                 : 'auto',
    transform             : 'translate(-50%, -50%)',
    transparent           : '1',
    backgroundColor       : 'rgba(0, 0, 0, .00)',
    webkitboxshadow       : '0 1px 1px rgba(0,0,0,.05)',
    boxshadow             : '0 1px 1px rgba(0,0,0,.05)',
    border                : '0px dashed white',
    borderRadius          : '20px'
  }
};
const buttonStyle = {
    border        : 'none',
    // padding       : '0',
    fontSize      : '13px',
    background    : 'inherit',
    color         : 'white',
    cursor        : 'pointer',
};


class KycAml extends Component {

  constructor(props) {
    super(props)
    this.state = {
        showHideSidenav   : "",
        modalIsOpen       : false
    }
    this.openModal     = this.openModal.bind(this);
    this.closeModal   = this.closeModal.bind(this);
  }

  componentDidMount(){
    document.body.id=""
  }

  toggleSidenav() {
    var css = (this.state.showHideSidenav === "active") ? "" : "active";
    this.setState({"showHideSidenav":css});
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {

    return (
      <div className="wrapper">
        <nav id="sidebar" className={this.state.showHideSidenav}>
            <div className="sidebar-header">
                <h5><img width="25%" height="25%" src="https://i.imgur.com/sMK1rIY.png" /><a href="/dashboard">Token Editor</a></h5>
            </div>

            <ul className="list-unstyled">
                <li>
                    <a href="/tokens"><i className="fas fa-lg fa-coins"></i> Tokens</a>
                </li>
                <li>
                    <a href="/Crowdsales"><i className="fas fa-lg fa-trophy"></i> Crowdsales</a>
                </li>
                <li>
                    <a href="/compaign"><i className="fas fa-lg fa-sign"></i> Campaigns</a>
                </li>
                <li className="selected-li">
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

        <div id="content">

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

              <div className="row justify-content-center">
                <h2 className="text-uppercase">KYC/AML</h2>
              </div>

              <div className="row my-4">
                <div className="col-md-12">
                  <div className="row editor-block">
                      <div className="col-md-12">
                        <div className="row text-center align-items-center square">
                          <div className="col">
                            <p>Choose your campagin</p>

                            <div className="dropdown toggle col-md-6">
                              <input id="t1" type="checkbox"></input>
                              <label>Example campagin</label>
                              <ul>
                                <li><a href="#">campagin 1</a></li>
                                <li><a href="#">campagin 2</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive editor-block">
                <table className="table" bordercolor="white">
                  <thead style={{fontSize:"15px", textAlign:"center"}}>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Country</th>
                      <th>Wallet address</th>
                      <th>Verified</th>
                    </tr>
                  </thead>

                  <tbody style={{fontSize:"13px", textAlign:"center"}}>
                    <tr onClick={this.openModal}>
                      <td>Stive</td>
                      <td>stive22@gmail.com</td>
                      <td>United States</td>
                      <td>0xad4777029ae71f2b2kall</td>
                      <td>No</td>
                      <button className="editor-btn main small">
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="editor-btn main small">
                        <i className="fas fa-times"></i> Decline
                      </button>
                    </tr>
                    <tr onClick={this.openModal}>
                      <td>Stive</td>
                      <td>stive22@gmail.com</td>
                      <td>United States</td>
                      <td>0xad4777029ae71f2b2kall</td>
                      <td>No</td>
                      <button className="editor-btn main small">
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="editor-btn main small">
                        <i className="fas fa-times"></i> Decline
                      </button>
                    </tr>
                    <tr onClick={this.openModal}>
                      <td>Stive</td>
                      <td>stive22@gmail.com</td>
                      <td>United States</td>
                      <td>0xad4777029ae71f2b2kall</td>
                      <td>No</td>
                      <button className="editor-btn main small">
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="editor-btn main small">
                        <i className="fas fa-times"></i> Decline
                      </button>
                    </tr>
                    <tr onClick={this.openModal}>
                      <td>Stive</td>
                      <td>stive22@gmail.com</td>
                      <td>United States</td>
                      <td>0xad4777029ae71f2b2kall</td>
                      <td>No</td>
                      <button className="editor-btn main small">
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="editor-btn main small">
                        <i className="fas fa-times"></i> Decline
                      </button>
                    </tr>
                    <tr onClick={this.openModal}>
                      <td>Stive</td>
                      <td>stive22@gmail.com</td>
                      <td>United States</td>
                      <td>0xad4777029ae71f2b2kall</td>
                      <td>No</td>
                      <button className="editor-btn main small">
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="editor-btn main small">
                        <i className="fas fa-times"></i> Decline
                      </button>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Token buyer information"
        >
          <div className="panel panel-danger">
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div id="stats" style={{backgroundColor: "rgb(69, 70, 123)", color:"white", height:"50px", width:"100%"}}>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-11">
                        <div className="col-md-8">
                          <p className="Title" style={{textAlign:"right"}}>Steve Wasovski info</p>
                        </div>
                      </div>
                      <div className="col-md-1">
                        <div className="col-md-12">
                          <button style = {buttonStyle}
                            onClick={this.closeModal}
                            type="button"
                            aria-label="close">
                            <p style={{textAlign:"center"}}>CLOSE</p>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-body">
            <div className="row container-fluid my-4">
                  <div className="col-md-6">
                    <div className="col-md-12 form-group my-5">
                      <div className="col">
                        <p className="Title my-3" style={{textAlign:"center"}}>Name</p>
                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>Steve</p>
                      </div>
                    </div>

                    <div className="col-md-12 form-group my-5">
                      <div className="col">
                        <p className="Title my-3" style={{textAlign:"center"}}>Country</p>
                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>Poland</p>
                      </div>
                    </div>

                    <div className="col-md-12 form-group my-5">
                      <div className="col">
                        <p className="Title my-3" style={{textAlign:"center"}}>Email</p>
                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>Steve.Wasovski@gmail.com</p>
                      </div>
                    </div>

                  </div>
                  <div className="col-md-6">
                    <div className="col-md-12 form-group my-5">
                      <div className="col">
                        <p className="Title my-3" style={{textAlign:"center"}}>Surname</p>
                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>Wasovski</p>
                      </div>
                    </div>

                    <div className="col-md-12 form-group my-5">
                      <div className="col">
                        <p className="Title my-3" style={{textAlign:"center"}}>Wallet address</p>
                        <p className="Amount" style={{textAlign:"center", color:"rgb(69, 70, 123)"}}>0xd5b93c49c4201db2a674a7d0fc5f3f733ebade80</p>
                      </div>
                    </div>

                    <div className="col-md-12 form-group my-5">
                      <div className="col">
                        <p className="Title my-3" style={{textAlign:"center"}}>Attached document</p>
                        <p className="Amount" style={{textAlign:"center", color:"blue"}}>Password</p>
                      </div>
                    </div>

                  </div>
                  <div className="col-md-12" style={{textAlign:"center"}}>
                        <button onClick={this.closeModal} className="editor-btn main small">
                            <i className="fas fa-check"></i> Approve
                        </button>
                        <button onClick={this.closeModal} className="editor-btn main small">
                            <i className="fas fa-times"></i> Decline
                        </button>
                  </div>
                </div>
            </div>
          </div>
        </Modal>

        <footer className="footer">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-4" id="stats">
                <div className="row text-center main-color">
                  <div className="col">
                    <i className="fas fa-2x fa-user-friends"></i>
                    <p className="m-0">Unique users</p>
                    <p className="m-0">13433</p>
                  </div>
                  <div className="col">
                    <i className="fas fa-2x fa-shopping-cart"></i>
                    <p className="m-0">ICO buyers</p>
                    <p className="m-0">189</p>
                  </div>
                  <div className="col">
                    <i className="fas fa-2x fa-dollar-sign"></i>
                    <p className="m-0">Total investment</p>
                    <p className="m-0">$56542</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
    );
  }
}
export default KycAml;
