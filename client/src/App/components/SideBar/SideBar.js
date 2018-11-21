import React        from 'react';
import { Link }     from 'react-router-dom';
import { withRouter } from "react-router";

import Dashboard from './icons/1_1_Dashboard.png';
import DashboardActive from './icons/1_2_Dashboard.png';

import Tokens from './icons/2_1_Tokens.png';
import TokensActive from './icons/2_2_Tokens.png';

import Crowdsale from './icons/3_1_Crowdsale.png';
import CrowdsaleActive from './icons/3_2_Crowdsale.png';

import Affiliate from './icons/4_1_Affiliate.png';
import AffiliateActive from './icons/4_2_Affiliate.png';

import Campaigns from './icons/5_1_Campaigns.png';
import CampaignsActive from './icons/5_2_Campaigns.png';

import KYC_AML from './icons/6_1_KYC_AML.png';
import KYC_AMLActive from './icons/6_2_KYC_AML.png';

import Settings from './icons/7_1_Settings.png';
import SettingsActive from './icons/7_2_Settings.png';

import Transactions from './icons/8_1_Transactions.png';
import TransactionsActive from './icons/8_2_Transactions.png';

import "./SideBar.css"

class SideBarItem_ extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isHovering: false }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onMouseEnter(e) {
    this.setState({ isHovering: true })
  }

  onMouseLeave(e) {
    this.setState({ isHovering: false })
  }

  render() {
    const { to, icon, activeIcon, title, location: { pathname } } = this.props

    const isActive = this.state.isHovering || pathname.startsWith(to)
    return (
      <li className='side-bar-item text-center' onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <Link to={to}>
          <img src={isActive ? activeIcon : icon} alt={title} />
          <div className={`side-bar-item-title${isActive ? ' side-bar-item-title--active' : ''}`}>{title}</div>
        </Link>
      </li>
    )
  }
}

const SideBarItem = withRouter(SideBarItem_)

export default React.memo(() => (
  <ul className="list-unstyled side-bar mb-0">
    <SideBarItem title='Dashboard'    to='/newdashboard' icon={Dashboard} activeIcon={DashboardActive} />
    <SideBarItem title='Tokens'       to='/tokens' icon={Tokens} activeIcon={TokensActive} />
    <SideBarItem title='Crowdsales'   to='/crowdsales' icon={Crowdsale} activeIcon={CrowdsaleActive} />
    <SideBarItem title='Campaigns'    to='/compaign' icon={Campaigns} activeIcon={CampaignsActive} />
    <SideBarItem title='KYC/AML'      to='/KycAml' icon={KYC_AML}  activeIcon={KYC_AMLActive}/>
    <SideBarItem title='Transactions' to='/Transactions' icon={Transactions} activeIcon={TransactionsActive} />
    <SideBarItem title='Affiliate'     to='/Affiliate' icon={Affiliate} activeIcon={AffiliateActive} />
    <SideBarItem title='Settings'     to='/setting' icon={Settings} activeIcon={SettingsActive} />
  </ul>
))
