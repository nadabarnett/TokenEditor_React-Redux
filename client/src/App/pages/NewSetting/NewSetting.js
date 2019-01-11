import React     from 'react';
import { Link }  from 'react-router-dom';
import SideBar   from '../../components/SideBar';
import NavBar    from '../../components/NavBar';

import campaign_eye from "./campaign_eye.svg"
import pen from "./pen.svg"
import development from "./development.svg"

import campaignImg from "./campaign2.png"
import questionMarkPurple from "./Layer 3 copy.svg"
import dummy from "./dummy.svg"
import people from "./people.svg"
import users from "./users.svg"

const DashboardCard = React.memo(({ variant, icon, title, subTitle }) => (
  <div className={`my-1 col dashboard-card`} style={{padding:'0'}}>
    <div className="border-0" style={{height:'100%'}}>
      <div className="pb-0" style={{position:'relative'}}>
        <h5  style={{fontSize: '1.2rem',letterSpacing:'-1px', fontFamily:'Roboto',fontWeight:'500'}} className="card-title pl-0 my-auto"> {title} </h5>
        <input className="setting-input" style={{marginTop:'11px'}}/>
      </div>
    </div>
  </div>
));

const DashboardCards = () => (
  <div className="row justify-content-between" style={{marginTop: '8px'}}>
    <DashboardCard variant='portag' title='Username' subTitle='Unpaid referrals' icon={questionMarkPurple} />
    <DashboardCard variant='sunglo' title='Email' subTitle='Paid referrals, Yesterday' icon={dummy} />
  </div>
)
const DashboardCards1 = () => (
  <div className="row justify-content-between" style={{marginTop: '8px'}}>
    <DashboardCard variant='portag' title='First name' subTitle='Unpaid earnings' icon={questionMarkPurple} />
    <DashboardCard variant='sunglo' title='Last name' subTitle='Paid earning' icon={dummy} />   
  </div>
)
const DashboardCards2 = () => (
  <div className="row justify-content-between" style={{marginTop: '8px'}}>
    <DashboardCard variant='portag' title='Website' subTitle='Unpaid earnings' icon={questionMarkPurple} />
    <DashboardCard variant='sunglo' title='Ethereum Wallet Address' subTitle='Paid earning' icon={dummy} />   
  </div>
)
const DashboardCards3 = () => (
  <div className="row justify-content-between" style={{marginTop: '8px'}}>
    <DashboardCard variant='portag' title='Bio' subTitle='Unpaid earnings' icon={questionMarkPurple} />
  </div>
)
const DashboardCards4 = () => (
  <div className="row justify-content-between" style={{marginTop: '8px'}}>
    <DashboardCard variant='portag' title='Old password' subTitle='Unpaid earnings' icon={questionMarkPurple} />
  </div>
)
const DashboardCards5 = () => (
  <div className="row justify-content-between" style={{marginTop: '8px'}}>
    <DashboardCard variant='portag' title='New Password' subTitle='Unpaid earnings' icon={questionMarkPurple} />
    <DashboardCard variant='sunglo' title='Confirm new Password' subTitle='Paid earning' icon={dummy} />     
    </div>
)
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
  render() {
    const { tokens } = this.props
    return (
      <div className='content-wrapper'>
        
        <div className='justify-content-between kyc-wrapper'>
          <div className='section-content'>
          <DashboardCards />
          <DashboardCards1 />
          <DashboardCards2 />
          <DashboardCards3 />


          </div>
         
        </div>
        <div className='justify-content-between kyc-wrapper'>
          <div className='section-content'>
          <DashboardCards4 />
          <DashboardCards5 />
          </div>
         
        </div>
        <button className="setting-save-btn">
          <i className="fas fa-check"></i> Save
        </button>
        
      </div>
    )
  }
}
class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = { isSideBarHidden: false }

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

export default Dashboard;
