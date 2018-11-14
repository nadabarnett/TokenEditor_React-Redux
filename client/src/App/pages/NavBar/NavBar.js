import React, { Fragment }          from 'react';
import { Link }       from 'react-router-dom';
import headerLogo from './icons/headerLogo.svg';
import inbox from './icons/inbox.svg';
import notification from './icons/notification.svg';
import rightArrow from './icons/right-arrow.svg';
import Avatar from 'react-avatar';

const NavBarIcon = React.memo(props => (
  <img {...props} className='mx-30px'/>
))

const NavBarAvatar = React.memo(() => (
  <span className='ml-30px'>
    <Avatar
      color='#a39bf0'
      name='Mike Tyson'
      size='50'
      textSizeRatio={2}
      round
      className='top-navbar-avatar'
      style={{ boxShadow: "0px 5px 10px rgba(108,92,231,0.27)" }}
    />
  </span>
))

const NavBarIconGroup = React.memo(() => (
  <Fragment>
    <NavBarIcon src={inbox} title='Inbox' />
    <NavBarIcon src={notification} title='Notification' />
    <NavBarIcon src={rightArrow} title='Right Arrow' />
  </Fragment>
))

export default React.memo(() => (
<nav class="navbar navbar-expand-lg sticky-top top-navbar py-0 rounded-0 mb-0 navbar-light bg-light">
  <div>
    <Link className="navbar-brand" to='/'>
      <img src={headerLogo} alt='Token Editor' className='top-navbar-logo'/>
    </Link>
  </div>

  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <span className='navbar-text top-navbar-ico-text'>
          +NEW ICO
        </span>
      </li>
    </ul>
    <div className='mr-5'>
      <NavBarIconGroup />
      <NavBarAvatar />
    </div>
  </div>
</nav>
))

// export default () => (
//   <nav className="navbar sticky-top top-navbar rounded-0 mb-0">

//     <div className='ml-100px'>
//       <Link className="navbar-brand" to='/'>
//         <img src={headerLogo} alt='Token Editor'/>
//       </Link>
//       <span className='navbar-text top-navbar-ico-text'>
//         +NEW ICO
//       </span>
//     </div>

    // <div className='mr-5'>
    //   <NavBarIconGroup />
    //   <NavBarAvatar />
    // </div>
//   </nav>
// )
