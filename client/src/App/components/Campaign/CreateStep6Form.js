import React, { Component } from 'react'

class CreateStep6Form extends Component{
  constructor(props){
    super(props);
    this.state = {
      formData: {
        name: '',
        symbol: '',
        decimals: '',
        initial: '',
        pausable: false,
        freezable: false,
        mintable: false,
        standard: 'ERC20'
      }
    };
  }
  toggleHandler(key, value) {
    let formData = this.state.formData;
    formData[key] = value;
    this.setState(...this.state, {formData: formData});
  }
  
  goNext(){
    const formData = this.state.formData;
    /*
    */

    return this.props.onNextBtn();
  }
  goBack(){
    return this.props.onBackBtn();
  }

  render(){
    return (
      <form className='step4-form step-form'>
      <div className='container'>
          <div className='row form-group'>
              <label className='col-md-2 multilines-2line'>
                Terms and conditions
                <a className='question'></a>
              </label>
              <div className='col-md-8'>
                <textarea style={{'height':'300px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum metus felis, eu lobortis nisi vestibulum facilisis. Duis vestibulum, augue vitae feugiat sollicitudin, nibh dui tempor diam, quis tristique justo ante vel nulla. Curabitur rutrum sit amet mi id auctor. Nunc pellentesque, sem quis tincidunt semper, massa ligula venenatis enim, nec euismod turpis tellus quis libero. Duis ullamcorper ullamcorper ullamcorper. Nam eget dictum enim. Donec vitae enim non ipsum dapibus tempus a quis mi. Maecenas nec fringilla eros. Suspendisse et sem hendrerit, tempus lorem vel, mollis neque. Praesent viverra, ligula vel consectetur iaculis, odio orci bibendum erat, in blandit ante ipsum non tortor. Nunc vel orci rutrum, vehicula ex quis, fringilla risus. Pellentesque varius augue id mollis mollis. Vivamus in purus dolor. Aliquam dignissim pulvinar eros sollicitudin fermentum. Cras dapibus fringilla lorem, sed facilisis lacus efficitur eu. Curabitur sem purus, pellentesque ac tempus quis, semper ac libero. Nulla facilisi. Maecenas congue tincidunt purus non placerat. Aliquam ante metus, vestibulum ac vestibulum nec, dictum vel dui. Quisque et massa at erat tincidunt posuere. Morbi placerat nisi sapien, vel iaculis dui posuere eu. Vivamus vel finibus ipsum, non pharetra odio. Nulla eget est sed enim lacinia elementum. Curabitur euismod nisl eget dolor dapibus, in condimentum enim blandit. Pellentesque pulvinar ornare posuere. Integer porttitor placerat ligula, sed congue mi porta vel. Integer sit amet diam lectus. Quisque a varius dui. Suspendisse odio enim, ultricies eget aliquam eget, commodo a mauris. Sed mollis eu diam at ultrices.</textarea>
              </div>
          </div>
          <div className='row form-group'>
          <div className='col-md-4'></div>
            <div className='col-md-8'>
              <p style={{'marginBottom':'0','marginTop':'10px'}}>
                <input type="checkbox" className="check-block" checked={this.state.formData.pausable} />
                <label className="multilines-2line">I agree with the terms and conditions</label>
              </p>
              
            </div>
          </div>
       
        <div className='row form-actions'>
          <button className='back-btn' type='button' onClick={this.goBack.bind(this)}>
            Back
          </button>
          <button className='next-btn' type='button' onClick={this.goNext.bind(this)}>Continue</button>
        </div>
      </div>
    </form>
    )
  }
}

export default CreateStep6Form;
