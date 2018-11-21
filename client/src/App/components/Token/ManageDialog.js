import React, { Component } from 'react';

import './ManageDialog.scss';

import Manage1stForm from './Manage1stForm';
import Manage2ndForm from './Manage2ndForm';
import Manage3rdForm from './Manage3rdForm';

class ManageDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentTab: 'token_info'
    };
  }
  closeDialog() {
    this.props.onClose();
  }
  selectTab(tab) {
    this.setState(...this.state,{
      currentTab: tab
    });
  }
  render() {
    return (
      <div className='modal-wrapper manage-token'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h2>MANAGE TOKEN</h2>
            <button onClick={this.closeDialog.bind(this)} arial_label='close' className='btn_close'>
              <i className='fa fa-times'></i>
            </button>
          </div>
          <div className='modal-body'>
            <div className='tabs'>
              <ul>
                <li className=''>
                  <button onClick={this.selectTab.bind(this, 'token_info')} className={['token_info', this.state.currentTab=='token_info'?'active':''].join(' ')}>
                    Token info
                  </button>
                </li>
                <li className=''>
                  <button onClick={this.selectTab.bind(this, 'basic_features')} className={['basic_features', this.state.currentTab=='basic_features'?'active':''].join(' ')}>
                    Basic features
                  </button>
                </li>
                <li className=''>
                  <button onClick={this.selectTab.bind(this, 'extra_features')} className={['extra_features', this.state.currentTab=='extra_features'?'active':''].join(' ')}>
                    Extra features
                  </button>
                </li>
              </ul>
            </div>
            <div className='tab-contents'>
              {this.state.currentTab == 'token_info' &&
                <Manage1stForm />
              }
              {this.state.currentTab == 'basic_features' &&
                <Manage2ndForm />
              }
              {this.state.currentTab == 'extra_features' &&
                <Manage3rdForm />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ManageDialog;