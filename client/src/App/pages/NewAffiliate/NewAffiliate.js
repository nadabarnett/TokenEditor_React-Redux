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
import redeye from "./redeye.svg"
import dollar from "./dollar.svg"
import book from "./book.svg"
import pluspeople from "./pluspeople.svg"
import tower from "./tower.svg"

import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";

const DashboardCard = React.memo(({ variant, icon, title, stitle, ssubTitle, subTitle, sicon }) => (
  <div className={`my-1 col dashboard-card-double dashboard-card-${variant}`} style={{padding:'0'}}>
    <div className="card border-0" style={{height:'100%'}}>
      <div className="card-body pb-0" style={{position:'relative',marginTop:'20px'}}>
              <img className='' src={icon} style={{ width: '30px', height: '30px', position:'absolute', top: '20px', right: '30px'}} />

        <h5  style={{fontSize: '2rem',letterSpacing:'-1px', fontFamily:'Roboto',fontWeight:'999', textAlign: 'left', marginLeft: '20px', marginTop: '20px'}} className="card-title pl-0 my-auto"> {title} </h5>
        <p className="card-text float-left" style={{ fontSize:'1rem', textAlign:'left', wordWrap: 'break-word', marginLeft: '20px', color:'#787885',marginTop:'5px' }}>{subTitle}</p>
      </div>

      <div className="card-body pb-0" style={{position:'relative'}}>
              <img className='' src={sicon} style={{ width: '30px', height: '30px', position:'absolute', top: '20px', right: '30px'}} />

        <h5  style={{fontSize: '2rem',letterSpacing:'-1px', fontFamily:'Roboto',fontWeight:'999', textAlign: 'left', marginLeft: '20px', marginTop: '20px'}} className="card-title pl-0 my-auto"> {stitle} </h5>
        <p className="card-text float-left" style={{ fontSize:'1rem', textAlign:'left', wordWrap: 'break-word', marginLeft: '20px' , color:'#787885',marginTop:'5px'}}>{ssubTitle}</p>
      </div>
    </div>
  </div>
));


const DashboardCardSingle = React.memo(({ variant, icon, title, subTitle }) => (
  <div className={`my-1 col dashboard-card-affiliate dashboard-card-${variant}`} style={{padding:'0'}}>
    <div className="card border-0" style={{height:'100%'}}>
      <div className="card-body pb-0" style={{position:'relative',marginTop:'20px'}}>
              <img className='' src={icon} style={{ width: '30px', height: '30px', position:'absolute', top: '20px', right: '30px'}} />

        <h5  style={{fontSize: '2rem',letterSpacing:'-1px', fontFamily:'Roboto',fontWeight:'999', textAlign: 'left', marginLeft: '20px'}} className="card-title pl-0 my-auto"> {title} </h5>
        <p className="card-text float-left" style={{ fontSize:'1rem', textAlign:'left', wordWrap: 'break-word', marginLeft: '20px' , color:'#787885',marginTop:'5px'}}>{subTitle}</p>
      </div>

      
    </div>
  </div>
));
const DashboardCards = () => (
  <div className="row justify-content-between" style={{marginTop: '50px'}}>
    <DashboardCard variant='sunglo' title='743' stitle='100' subTitle='Visits' ssubTitle='Sold' icon={redeye} sicon={pluspeople}/>
    <DashboardCard variant='viking' title='10.00 ETH' subTitle='Sales' stitle='1.0%' ssubTitle='Commistion rate' icon={dollar} sicon={tower}/>
    <DashboardCardSingle variant='portag' title='10.00 ETH' subTitle='Paid'  icon={book} />

  </div>
)
const DashboardCards1 = () => (
  <div className="row justify-content-between" style={{marginTop: '50px'}}>
    <DashboardCard variant='portag' title='$234' subTitle='Earnings' icon={book} />
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
            <div className='float-left'>
              <h2>Affiliate</h2>
            </div>
          </div>
          <br></br>
          <div className='row section-content col-md-12'>
            <div className="col-md-4">
              <label >
                  Start date            
              </label>
              <DatePicker/>
            </div>
            <div className="col-md-4">
            <label >
                End date            
            </label>
            <DatePicker/>
          </div>
          </div>
         
        </div>
          <DashboardCards />
         
        <div className='justify-content-between kyc-wrapper'>
          <div className='section-header'>
          </div>
          <div className='section-content row col-md-12'>

              <label className="affilatelink col-md-3">Your referral link:</label>
                  <input className="col-md-6" value="https://example.com /ref/4321" style={{color:"#9a95ec"}} type='text'/>
                <button className="affiliate-copy-btn col-md-2">Copy the link</button>
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
