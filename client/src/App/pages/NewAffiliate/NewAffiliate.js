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
  <div className={`my-1 col dashboard-card dashboard-card-${variant}`} style={{padding:'0'}}>
    <div className="card border-0" style={{height:'100%'}}>
      <div className="card-body pb-0" style={{position:'relative'}}>
        <h5  style={{fontSize: '2rem',letterSpacing:'-1px', fontFamily:'Roboto',fontWeight:'999', textAlign: 'left'}} className="card-title pl-0 my-auto"> {title} </h5>
        <p className="card-text float-left" style={{ fontSize:'1rem', textAlign:'left', wordWrap: 'break-word' }}>{subTitle}</p>
      </div>
    </div>
  </div>
));

const DashboardCards = () => (
  <div className="row justify-content-between" style={{marginTop: '50px'}}>
    <DashboardCard variant='portag' title='10' subTitle='Unpaid referrals' icon={questionMarkPurple} />
    <DashboardCard variant='sunglo' title='3' subTitle='Paid referrals, Yesterday' icon={dummy} />
    <DashboardCard variant='viking' title='743' subTitle='Visits'  icon={people} />
    <DashboardCard variant='sweet-corn' title='30%' subTitle='Conversion rate'  icon={users} />

  </div>
)
const DashboardCards1 = () => (
  <div className="row justify-content-between" style={{marginTop: '50px'}}>
    <DashboardCard variant='portag' title='$234' subTitle='Unpaid earnings' icon={questionMarkPurple} />
    <DashboardCard variant='sunglo' title='$3642' subTitle='Paid earning' icon={dummy} />
    <DashboardCard variant='viking' title='10%' subTitle='Commission rate'  icon={people} />
   
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
          <div className='section-header'>
            
              <h2 className="affilatelink">Your referral link</h2>
                  <input className="affiliate-input" value="https://example.com /ref/4321" type='text'/>
                <button className="affiliate-copy-btn">Copy</button>
          </div>
          <div className='section-content'>
          </div>
         
        </div>
        <div className='justify-content-between kyc-wrapper'>
          <div className='section-content'>
          <DashboardCards />
          <DashboardCards1 />
          </div>
         
        </div>
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
