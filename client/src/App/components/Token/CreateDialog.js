import React, { Component } from 'react'
import './CreateDialog.scss'
import CreateStep1Form from './CreateStep1Form'
import CreateStep2Form from './CreateStep2Form'
import CreateStep3Form from './CreateStep3Form'
import CreateStep4Form from './CreateStep4Form'
import CreateStep5Form from './CreateStep5Form'

var classNames = require('classnames');
class CreateDialog extends Component{
  constructor(props){
    super(props);
    this.state ={
      currentTab: 'step1',
      tabClasses: {
        step1: 'step1 active',
        step2: 'step2 ',
        step3: 'step3 ',
        step4: 'step4 ',
        step5: 'step5 '
      }
    };
  }
  closeDialog(){
    this.props.onClose();
  }
  goNext(){
    if (this.state.currentTab=='step1'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 passed';
      tabClasses.step2 = 'step2 active';
      this.setState(...this.state,
        { currentTab: 'step2', tabClasses:tabClasses });
    }
    if (this.state.currentTab=='step2'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 passed';
      tabClasses.step2 = 'step2 passed';
      tabClasses.step3 = 'step3 active';
      this.setState(...this.state,
        { currentTab: 'step3', tabClasses:tabClasses });
    }
    if (this.state.currentTab=='step3'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 passed';
      tabClasses.step2 = 'step2 passed';
      tabClasses.step3 = 'step3 passed';
      tabClasses.step4 = 'step4 active';
      this.setState(...this.state,
        { currentTab: 'step4', tabClasses:tabClasses });
    }
    if (this.state.currentTab=='step4'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 passed';
      tabClasses.step2 = 'step2 passed';
      tabClasses.step3 = 'step3 passed';
      tabClasses.step4 = 'step4 passed';
      tabClasses.step5 = 'step5 active';
      this.setState(...this.state,
        { currentTab: 'step5', tabClasses:tabClasses });
    }
    if (this.state.currentTab=='step5'){
      this.props.onClose();
    }
  }
  goBack(){
    if (this.state.currentTab=='step2'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 active';
      tabClasses.step2 = 'step2';
      tabClasses.step3 = 'step3';
      tabClasses.step4 = 'step4';
      tabClasses.step5 = 'step5';
      this.setState(...this.state,
        { currentTab: 'step1', tabClasses:tabClasses });
    }
    if (this.state.currentTab=='step3'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 passed';
      tabClasses.step2 = 'step2 active';
      tabClasses.step3 = 'step3';
      tabClasses.step4 = 'step4';
      tabClasses.step5 = 'step5';
      this.setState(...this.state,
        { currentTab: 'step2', tabClasses:tabClasses });
    }
    if (this.state.currentTab=='step4'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 passed';
      tabClasses.step2 = 'step2 passed';
      tabClasses.step3 = 'step3 active';
      tabClasses.step4 = 'step4';
      tabClasses.step5 = 'step5';
      this.setState(...this.state,
        { currentTab: 'step3', tabClasses:tabClasses });
    }
    if (this.state.currentTab=='step5'){
      let tabClasses = this.state.tabClasses;
      tabClasses.step1 = 'step1 passed';
      tabClasses.step2 = 'step2 passed';
      tabClasses.step3 = 'step3 passed';
      tabClasses.step4 = 'step4 active';
      tabClasses.step5 = 'step5';
      this.setState(...this.state,
        { currentTab: 'step4', tabClasses:tabClasses });
    }
  }
  render(){
    return (
      <div className='modal-wrapper create-token'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h2>Create New Token</h2>
            <button onClick={this.closeDialog.bind(this)} aria_label='close' className='btn-close'>
              <i className='fa fa-times'></i>
            </button>
          </div>
          <div class='modal-body'>
            <div className='tabs'>
              <ul>
                <li className={this.state.tabClasses.step1}>
                  Token name
                </li>
                <li className={this.state.tabClasses.step2}>
                  ICO Setup
                </li>
                <li className={this.state.tabClasses.step3}>
                  Stages
                </li>
                <li className={this.state.tabClasses.step4}>
                  Token Distribution
                </li>
                <li className={this.state.tabClasses.step5}>
                  Review & Publish
                </li>
              </ul>
            </div>
            <div className='tab-contents'>
 
                <CreateStep1Form onNextBtn={this.goNext.bind(this)} onBackBtn={this.goBack.bind(this)}/>

            </div>
            <div className=''>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CreateDialog;
