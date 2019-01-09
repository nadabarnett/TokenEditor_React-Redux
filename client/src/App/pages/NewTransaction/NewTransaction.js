import React     from 'react';
import { Link }  from 'react-router-dom';
import SideBar   from '../../components/SideBar';
import NavBar    from '../../components/NavBar';
import TokenList from '../../components/Transaction/List';

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
        <img className='' src={icon} style={{ width: '30px', height: '30px', position:'absolute', top: '20px', right: '10px'}} />
        <h5  style={{fontSize: '2rem',letterSpacing:'-1px', fontFamily:'Roboto',fontWeight:'999', textAlign: 'left'}} className="card-title pl-0 my-auto"> {title} </h5>
        <p className="card-text float-left" style={{ fontSize:'1rem', textAlign:'left', wordWrap: 'break-word' }}>{subTitle}</p>
      </div>
    </div>
  </div>
));

const DashboardCards = () => (
  <div className="row justify-content-between" style={{marginTop: '50px'}}>
    <DashboardCard variant='portag' title='2/5' subTitle='ICO in public sale' icon={questionMarkPurple} />
    <DashboardCard variant='sunglo' title='3/5' subTitle='ICO in presale' icon={questionMarkPurple} />
    <DashboardCard variant='viking' title='10.3 ETH' subTitle='Total investment'  icon={questionMarkPurple} />
    <DashboardCard variant='sweet-corn' title='2/10' subTitle='Verified KYC users'  icon={users} />
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
        <DashboardCards />

            <div className='justify-content-between transaction-wrapper'>
              <div className='section-content'>
                <TokenList tokens = {tokens} />
              </div>
            
            </div>
      </div>
    )
  }
}
class Tokens extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = { isSideBarHidden: false,tokens: [] }

    this.toggleSideNav = this.toggleSideNav.bind(this)
    this.state.tokens = [
      {
        date: '2018-8-24 23:3',
        country: 'United States',
        tokenname: 'ExampleToken',
        tokenamount: '1.5 ETH',
        sourceamount: '2131 EXT',
        username: 'bearcat',
        fee: '0.075 ETH'
      },
      {
        date: '2018-8-24 23:3',
        country: 'United States',
        tokenname: 'ExampleToken',
        tokenamount: '1.5 ETH',
        sourceamount: '2131 EXT',
        username: 'bearcat',
        fee: '0.075 ETH'
      },
      {
        date: '2018-8-24 23:3',
        country: 'United States',
        tokenname: 'ExampleToken',
        tokenamount: '1.5 ETH',
        sourceamount: '2131 EXT',
        username: 'bearcat',
        fee: '0.075 ETH'
      },
      {
        date: '2018-8-24 23:3',
        country: 'United States',
        tokenname: 'ExampleToken',
        tokenamount: '1.5 ETH',
        sourceamount: '2131 EXT',
        username: 'bearcat',
        fee: '0.075 ETH'
      },
      {
        date: '2018-8-24 23:3',
        country: 'United States',
        tokenname: 'ExampleToken',
        tokenamount: '1.5 ETH',
        sourceamount: '2131 EXT',
        username: 'bearcat',
        fee: '0.075 ETH'
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
              <SideBar />
            </div>
            <Content onSidebarToggle={this.toggleSideNav} tokens={this.state.tokens}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Tokens;
