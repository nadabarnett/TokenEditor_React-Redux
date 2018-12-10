import React, { Component } from 'react';
import Modal from 'react-modal';

import SideBar   from '../components/SideBar';
import NavBar    from '../components/NavBar';
import TokenList from '../components/Token/List';
import CreateDialog from  '../components/Token/CreateDialog';
import ManageDialog from  '../components/Token/ManageDialog';

class Content extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCreateModal: false,
      showManageModal: false,
    }
  }
  openCreateDialog(){
    this.setState(...this.state, {
      showCreateModal: true
    })
  }
  closeCreateDialog(){
    this.setState(...this.state, {
      showCreateModal: false
    })
  }
  openManageDialog(){
    this.setState(...this.state, {
      showManageModal: true
    })
  }
  closeManageDialog(){
    this.setState(...this.state, {
      showManageModal: false
    })
  }
  render() {
    const { tokens } = this.props
    return (
      <div className='content-wrapper'>
        <div className='justify-content-between tokens-wrapper'>
          <div className='section-header'>
            <div className='float-left'>
              <h2>My Crowdsales</h2>
            </div>
            <div className='float-right'>
              <button className='create-btn' onClick={this.openCreateDialog.bind(this)}>+ Create Crowdsale</button>
            </div>
          </div>
          <div className='section-content'>
            <TokenList tokens = {tokens} onClickItem={this.openManageDialog.bind(this)}/>
          </div>
          <Modal isOpen={this.state.showCreateModal} style={{content:{border:'0 none', background:'none', top: '80px', left: '180px', bottom: '80px', right: '180px'}}}>
            <CreateDialog onClose={this.closeCreateDialog.bind(this)}/>
          </Modal>
          <Modal isOpen={this.state.showManageModal} style={{content:{border:'0 none', background:'none', top: '10px', left: '180px', bottom: '10px', right: '180px'}}}>
            <ManageDialog onClose={this.closeManageDialog.bind(this)}/>
          </Modal>
        </div>
      </div>
    )
  }
}
class Tokens extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = { isSideBarHidden: false, tokens: [] }

    this.toggleSideNav = this.toggleSideNav.bind(this)

    // for test
    this.state.tokens = [
      {
        name: 'Test_token',
        symbol: 'TTT',
        address: '0xf5d40aBBa01cc50854c742526bae1081d4733fb'
      }
    ]
  }

  componentDidMount() {
    document.body.id = '';
  }

  toggleSideNav() {
    this.setState(({ isSideBarHidden }) => ({
      isSideBarHidden: !isSideBarHidden
    }))
  }

  render() {
    return (
      <div className='text-center'>
        <NavBar />

        <div className="App">
          <div className='d-flex'>
            <div id="sidebar" className={this.state.isSideBarHidden ? 'active' : ''}>
              <SideBar/>
            </div>
            <Content onSidebarToggle={this.toggleSideNav} tokens={this.state.tokens}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Tokens;
