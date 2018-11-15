import React, { Fragment }          from 'react';
import { Link }       from 'react-router-dom';
import Avatar from 'react-avatar';
import headerLogo from './icons/headerLogo.svg';

import message from './icons/13_1_Message.png';
import exit from './icons/11_1_Exit.png';
import notifications from './icons/12_1_notifications.png';

import ellipse from './icons/Ellipse.svg';

const NavBarIcon = React.memo(props => (
  <Link to='#'>
    <img {...props} className='mx-30px'/>
  </Link>
))

const NavBarAvatar = React.memo(() => (
  <span className='ml-30px'>
    <Avatar
      color='#a39bf0'
      name='English'
      initials={() => 'EN'}
      size='50'
      textSizeRatio={2}
      round
      className='top-navbar-avatar'
      style={{ boxShadow: "0px 5px 10px rgba(108,92,231,0.27)", fontFamily: "SF Pro Text", fontWeight: 'bold' }}
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
  <nav className="navbar navbar-expand-lg sticky-top top-navbar py-0 rounded-0 mb-0 navbar-light bg-light">
    <div>
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

      <div className='mr-5 mb-3 mb-lg-0'>
        <div className='my-3 d-lg-inline' style={{fontFamily: 'Roboto'}}>
          <Link className='nav-item' to='#' style={{ verticalAlign: 'text-top', color: '#939899', marginRight: '27px' }}>
            <img src={ellipse} className='top-navbar-ellipse'/>
            Mainnet
            </Link>
          <Link className='nav-item' to='#' style={{ verticalAlign: 'text-top', color: '#939899', marginRight: '6px' }}>0x6A830...03B</Link>
        </div>

        <NavBarIconGroup />
        <NavBarAvatar />
      </div>
    </div>
  </nav>
))
