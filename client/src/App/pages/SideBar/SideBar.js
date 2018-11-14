import React        from 'react';
import { Link }     from 'react-router-dom';

import tokens from './icons/tokens.svg';
import dashboard from './icons/dashboard.svg';
import crowdsale from './icons/crowdsale.svg';
import campaigns from './icons/campaigns.svg';
import kycAml from './icons/kyc_aml.svg';
import transactions from './icons/transactions.svg';
import affiliate from './icons/affiliate.svg';
import settings from './icons/settings.svg';

import "./SideBar.css"

const SideBarItem = ({ to, icon, title }) => (
  <li className='side-bar-item text-center'>
    <Link to={to}>
      <img src={icon} alt={title} />
      <div className='side-bar-item-title'>{title}</div>
    </Link>
  </li>
)

export default () => (
  <ul className="list-unstyled side-bar">
    <SideBarItem to='/newdashboard' icon={dashboard} title='Dashboard' />
    <SideBarItem to='/tokens' icon={tokens} title='Tokens' />
    <SideBarItem to='/Crowdsales' icon={crowdsale} title='Crowdsales' />
    <SideBarItem to='/compaign' icon={campaigns} title='Campaigns' />
    <SideBarItem to='/KycAml' icon={kycAml} title='KYC/AML' />
    <SideBarItem to='/Transactions' icon={transactions} title='Transactions' />
    <SideBarItem to='/Affiliate' icon={affiliate} title='Affiliate' />
    <SideBarItem to='/setting' icon={settings} title='Settings' />
  </ul>
)
