import React     from 'react';
import { Link }  from 'react-router-dom';
import SideBar   from './SideBar';
import NavBar    from './NavBar';

import campaign_eye from "./campaign_eye.svg"
import campaignImg from "./campaign2.png"

const DashboardCard = React.memo(({ variant, title, subTitle }) => (
  <div className={`my-1 col dashboard-card dashboard-card-${variant}`}>
    <div className="card border-0">
      <div className="card-body pb-0">
        <h5 className="card-title"> {title} </h5>
        <p className="card-text" style={{wordWrap: 'break-word'}}>{subTitle}</p>
      </div>
    </div>
  </div>
))

const DashboardCards = () => (
  <div className="row justify-content-between" style={{marginTop: '50px'}}>
    <DashboardCard variant='portag' title='2,000 ETH' subTitle='Amount Raised' />
    <DashboardCard variant='sunglo' title='1.0%' subTitle='(3cv/ 300uu), Yesterday' />
    <DashboardCard variant='viking' title='1.0%' subTitle='(30cv/ 3000uu), Total' />
    <DashboardCard variant='sweet-corn' title='25 users' subTitle='Unverified AML/KYC' />
  </div>
)

const FundingItem = React.memo(({current, target}) => (
  <div className='col text-left'>
    <h2 className='funding-target'>{current}</h2>
    <p className='funding-achieved'>{target}</p>
  </div>
))

const Content = () => (
  <div className='content-wrapper'>
    <DashboardCards />

    <div className='row justify-content-between campaign-wrapper'>

      <div className='col-12 col-lg-6 example-campaign'>
        <div style={{ color: '#929799' }} className='clearfix'>
          <span className='float-left'>Example campaign</span>
          <span className='float-right'>
            <img src={campaign_eye}/>
          </span>
        </div>

        <div className='clearfix ' style={{marginTop: '70px'}}>
          <span className='float-left'>Description of Campaign</span>
        </div>
  
        <div className='clearfix' style={{ marginTop: '35px', color: '#666674', fontSize: '50px' }}>
          <span className='float-left font-weight-bold' style={{fontSize: '5vmin'}}>ETH 237,650</span>
        </div>

        <div className='clearfix text-left'>
          Raised
          TODO: Add progress
        </div>

        <div className='row'>
          <FundingItem current='60 ETH' target='Funding goal' />
          <FundingItem current='6 ETH' target='Fund Raised' />
          <FundingItem current='54' target='Days to go' />
        </div>
      </div>

      <div className='col-12 col-lg-6 campaign-2 px-0' >
        <img src={campaignImg} className='img-fluid h-100'/>
      </div>
    </div>
  </div>
)
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
