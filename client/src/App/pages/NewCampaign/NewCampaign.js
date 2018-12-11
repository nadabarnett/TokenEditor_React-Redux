import React     from 'react';
import { Link }  from 'react-router-dom';
import Modal from 'react-modal';

import SideBar   from '../../components/SideBar';
import NavBar    from '../../components/NavBar';
import CreateDialog from  '../../components/Campaign/CreateDialog';
import ManageDialog from  '../../components/Campaign/ManageDialog';
import campaign_eye from "./campaign_eye.svg"
import pen from "./pen.svg"
import development from "./development.svg"

import campaignImg from "./campaign2.png"
import questionMarkPurple from "./Layer 3 copy.svg"
import dummy from "./dummy.svg"
import people from "./people.svg"
import users from "./users.svg"

const FundingItem = React.memo(({current, target}) => (
  <div className='col text-left'>
    <h2 className='funding-target'>{current}</h2>
    <p className='funding-achieved'>{target}</p>
  </div>
))

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
        <div className="row justify-content-between" style={{marginTop: '50px'}}>
          <div className="float_myright">
            <button className="create-btn-campaign" onClick={this.openCreateDialog.bind(this)}>Create Campaign</button>
          </div>
        </div>
        <div className='row justify-content-between campaign-wrapper'>
            <div className='col-12 col-xl-6 campaign-section'>
              <div className='clearfix campaign-section-header'>
                <span className='float-left'>EXAMPLE CAMPAIGN</span>
                <span className='float-right'>
                  <img src={campaign_eye} className='ml-3'  style={{height: '22px', width: '16px' }}/>
                  <img src={pen} className='ml-3' style={{height: '22px', width: '16px' }}/>
                  <img src={development} className='ml-3'  style={{height: '22px', width: '16px' }}/>
                </span>
              </div>

              <div className='clearfix campaign-description'>
                <span className='float-left'>Description of Campaign</span>
              </div>
        
              <div className='clearfix campaign-eth-text'>
                <span className='float-left font-weight-bold' style={{fontSize: '7vmin'}}>ETH 237,650</span>
              </div>

              <div className='clearfix text-left'>
                <span style={{color: '#666674', fontFamily: 'SF Pro Text', fontSize: '18px'}}>Raised</span>

                <div class="progress" style={{ height: '7px', borderRadius: '2px', marginBottom: '37px', marginTop: '15px', marginRight: '2px' }}>
                  <div class="progress-bar" role="progressbar" style={{ width: '75%', backgroundImage: "linear-gradient(90deg, #ef4d5b 0%, #fe687b 100%)" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>

              </div>

              <div className='row'>
                <FundingItem current='60 ETH' target='Funding goal' />
                <FundingItem current='6 ETH' target='Fund Raised' />
                <FundingItem current='54' target='Days to go' />
              </div>
            </div>

            <div className='col-12 col-xl-6 px-0' >
              <img src={campaignImg} className='img-fluid w-100  h-100' />
            </div>
            <Modal isOpen={this.state.showCreateModal} style={{content:{border:'0 none', background:'none', top: '80px', left: '180px', bottom: '80px', right: '180px'}}}>
            <CreateDialog onClose={this.closeCreateDialog.bind(this)}/>
          </Modal>
          <Modal isOpen={this.state.showManageModal} style={{content:{border:'0 none', background:'none', top: '80px', left: '180px', bottom: '80px', right: '180px'}}}>
            <ManageDialog onClose={this.closeManageDialog.bind(this)}/>
          </Modal>
        </div>
      </div>
    )
  }
}
class Campaigns extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isSideBarHidden: false,
      showCreateModal: false,
      showManageModal: false,
    }
    this.toggleSideNav = this.toggleSideNav.bind(this)
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
              <SideBar />
            </div>
            <Content onSidebarToggle={this.toggleSideNav}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Campaigns;
