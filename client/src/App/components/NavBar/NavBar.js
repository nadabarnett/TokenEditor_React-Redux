import React, { Fragment }          from 'react';
import { Link }       from 'react-router-dom';
import Avatar from 'react-avatar';
import headerLogo from './icons/headerLogo.svg';

import './NavBar.scss'
import message from './icons/13_1_Message.png';
import exit from './icons/11_1_Exit.png';
import notifications from './icons/12_1_notifications.png';

import ellipse from './icons/Ellipse.svg';
import MobileMenu from './MobileMenu';

const NavBarIcon = React.memo(props => (
  <Link to='#'>
    <img {...props} className='mx-30px'/>
  </Link>
))

const NavBarAvatar = React.memo(({wrapperClass = '', ...props}) => (
  <span className={wrapperClass}>
    <Avatar
      color='#a39bf0'
      name='English'
      initials={() => 'EN'}
      size='50'
      textSizeRatio={2}
      round
      {...props}
      className={`top-navbar-avatar ${props.className}`}
      style={{ fontFamily: "SF Pro Text", fontWeight: 'bold', ...props.style }}
    />
  </span>
))

const NavBarIconGroup = React.memo(() => (
  <Fragment>
    <NavBarIcon src={message} title='Message' />
    <NavBarIcon src={notifications} title='Notifications' />
    <NavBarIcon src={exit} title='Exit' />
  </Fragment>
))

export default React.memo(() => (
  <nav className="navbar navbar-expand-lg navbar-light sticky-top top-navbar py-0 rounded-0 mb-0">
    <div className='container-fluid'>
      <div className="navbar-header">
        <Link className="navbar-brand" to='/'>
          <img src={headerLogo} alt='Token Editor' className='top-navbar-logo'/>
        </Link>
      </div>
        
	  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span className="navbar-toggler-icon"></span>
	  </button>
	  		  
  
      <div className="collapse navbar-collapse" id="navbarSupportedContent">		
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <span className='navbar-text top-navbar-ico-text'>
              +NEW ICO
            </span>
          </li>
        </ul>
  
        <div className='mb-3 mb-lg-0'>
          <div className='my-3 d-lg-inline' style={{fontFamily: 'Roboto'}}>
            <Link className='nav-item' to='#' style={{ verticalAlign: 'text-top', color: '#939899', marginRight: '27px' }}>
              <img src={ellipse} className='top-navbar-ellipse'/>
              Mainnet
              </Link>
            <Link className='nav-item' to='#' style={{ verticalAlign: 'text-top', color: '#939899', marginRight: '6px' }}>0x6A830...03B</Link>
          </div>
  
          <NavBarIconGroup />
        </div>

        <div className='mr-lg-5'>
          <ul className='navbar-nav'>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle caret-off" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <NavBarAvatar wrapperClass='language-switch'/>
              </a>
              <div className="dropdown-menu dropdown-menu-custom text-center" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item language-switch-item" href="#"><NavBarAvatar color='#eaa0a2' initials={() => 'JP'} /></a>
                <a className="dropdown-item language-switch-item" href="#"><NavBarAvatar color='#5fdbdb' initials={() => 'ES'} /></a>
                <a className="dropdown-item language-switch-item" href="#"><NavBarAvatar color='#fbd87f' initials={() => 'CN'} /></a>
              </div>
            </li>
          </ul>
        </div>
		<MobileMenu/>
      </div>
    </div>
  </nav>
))
