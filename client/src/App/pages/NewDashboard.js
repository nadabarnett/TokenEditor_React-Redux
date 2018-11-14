import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import SideBar              from './SideBar';
import NavBar               from './NavBar';

const Content = ({onSidebarToggle}) => (
  <div id="content">
    <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">

            <button type="button" id="sidebarCollapse" onClick={onSidebarToggle} className="editor-btn main">
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

    <div className="row justify-content-center mb-5">
        <div className="col-md-4 mb-3">
            <div className="row text-center align-items-center editor-block square" id="first">
                <div className="col">
                    <p>Want to generate token?</p>
                    <Link to={'/addToken'} className="nav-link">
                        <button className="editor-btn main big"><i className="fa fa-lg fa-coins"></i> Create token</button>
                    </Link>
                </div>
            </div>
        </div>
        <div className="w-100"></div>
        <div className="col-md-4">
            <div className="row text-center align-items-center editor-block square" id="second">
                <div className="col">
                    <p>Want to generate crowdsale contract?</p>
                    <Link to={'/step1'} className="nav-link">
                        <button className="editor-btn main big"><i className="fab fa-lg fa-ethereum"></i> Genetate crowdsale</button>
                    </Link>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="row text-center align-items-center editor-block square" id="third">
                <div className="col">
                    <p>Want to create a campaign?</p>
                    <Link to={'/compaign'} className="nav-link">
                        <button className="editor-btn main big"><i className="fas fa-lg fa-sign"></i> Create campaign</button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  </div>
)


class Dashboard extends React.PureComponent {
  state = { isSideBarHidden: false };

  componentDidMount() {
    document.body.id = '';
  }

  toggleSidenav() {
    this.setState(({ isSideBarHidden }) => ({
      isSideBarHidden: !isSideBarHidden
    }))
  }

  render() {
    return (
      <div className="App">
        <NavBar />

        <div className='d-flex'>
          <div id="sidebar" className={this.state.isSideBarHidden ? 'active' : ''}>
            <SideBar />
          </div>
          <Content onSidebarToggle={this.toggleSidenav.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default Dashboard;
