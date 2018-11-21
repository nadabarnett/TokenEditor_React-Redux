import React, { Component } from 'react';
import { NavLink }     from 'react-router-dom';

class MobileMenu extends Component{
  render(){
    return(
		<ul className="navbar-nav mr-auto d-lg-none">
		  <li className="nav-item"><NavLink className="nav-link" to={'/newdashboard'}>Dashboard</NavLink></li>
		  <li className="nav-item"><NavLink className="nav-link" to={'/tokens'}>Tokens</NavLink></li>
		  <li className="nav-item"><NavLink className="nav-link" to={'/crowdsales'}>Crowdsales</NavLink></li>
		  <li className="nav-item"><NavLink className="nav-link" to={'/compaign'}>Campaigns</NavLink></li>
		  <li className="nav-item"><NavLink className="nav-link" to={'/KycAml'}>KYC/AML</NavLink></li>
		  <li className="nav-item"><NavLink className="nav-link" to={'/Transactions'}>Transactions</NavLink></li>
		  <li className="nav-item"><NavLink className="nav-link" to={'/Affiliate'}>Affiliate</NavLink></li>
		  <li className="nav-item"><NavLink className="nav-link" to={'/setting'}>Settings</NavLink></li>
		</ul>
    )
  }
}

export default MobileMenu;