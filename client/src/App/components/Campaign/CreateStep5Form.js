import React, { Component } from 'react'
import Select from 'react-select';
class CreateStep5Form extends Component{
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
            <label className='col-md-2'>Filter by<a className='question'></a></label>
            <div className='col-md-8'>
              <div className='toggle-btn'>
                <a className={this.state.formData.standard=='ERC20'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC20')}>
                Banned
                </a>
                <a className={this.state.formData.standard=='ERC223'?'active':''} onClick={this.toggleHandler.bind(this,'standard','ERC223')}>
                Allowed Countries
                </a>
              </div>
            </div>
          </div>
          <div className='row form-group'>
              <label className='col-md-2 multilines-2line'>
                Allowed Countries
                <a className='question'></a>
              </label>
              <div className='col-md-4'>
              <Select
                isMulti
                name="colors"
                options={[
 
                  { value: "Afghanistan", label: "Afghanistan" },
                  { value: "Albania", label: "Albania" },
                  { value: "Algeria", label: "Algeria" },
                  { value: "American Samoa", label: "American Samoa" },
                  { value: "Andorra", label: "Andorra" },
                  { value: "Angola", label: "Angola" },
                  { value: "Anguilla", label: "Anguilla" },
                  { value: "Antartica", label: "Antarctica" },
                  { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
                  { value: "Argentina", label: "Argentina" },
                  { value: "Armenia", label: "Armenia" },
                  { value: "Aruba", label: "Aruba" },
                  { value: "Australia", label: "Australia" },
                  { value: "Austria", label: "Austria" },
                  { value: "Azerbaijan", label: "Azerbaijan" },
                  { value: "Bahamas", label: "Bahamas" },
                  { value: "Bahrain", label: "Bahrain" },
                  { value: "Bangladesh", label: "Bangladesh" },
                  { value: "Barbados", label: "Barbados" },
                  { value: "Belarus", label: "Belarus" },
                  { value: "Belgium", label: "Belgium" },
                  { value: "Belize", label: "Belize" },
                  { value: "Benin", label: "Benin" },
                  { value: "Bermuda", label: "Bermuda" },
                  { value: "Bhutan", label: "Bhutan" },
                  { value: "Bolivia", label: "Bolivia" },
                  { value: "Bosnia and Herzegowina", label: "Bosnia and Herzegowina" },
                  { value: "Botswana", label: "Botswana" },
                  { value: "Bouvet Island", label: "Bouvet Island" },
                  { value: "Brazil", label: "Brazil" },
                  { value: "British Indian Ocean Territory", label: "British Indian Ocean Territory" },
                  { value: "Brunei Darussalam", label: "Brunei Darussalam" },
                  { value: "Bulgaria", label: "Bulgaria" },
                  { value: "Burkina Faso", label: "Burkina Faso" },
                  { value: "Burundi", label: "Burundi" },
                  { value: "Cambodia", label: "Cambodia" },
                  { value: "Cameroon", label: "Cameroon" },
                  { value: "Canada", label: "Canada" },
                  { value: "Cape Verde", label: "Cape Verde" },
                  { value: "Cayman Islands", label: "Cayman Islands" },
                  { value: "Central African Republic", label: "Central African Republic" },
                  { value: "Chad", label: "Chad" },
                  { value: "Chile", label: "Chile" },
                  { value: "China", label: "China" },
                  { value: "Christmas Island", label: "Christmas Island" },
                  { value: "Cocos Islands", label: "Cocos (Keeling) Islands" },
                  { value: "Colombia", label: "Colombia" },
                  { value: "Comoros", label: "Comoros" },
                  { value: "Congo", label: "Congo" },
                  { value: "Congo", label: "Congo, the Democratic Republic of the" },
                  { value: "Cook Islands", label: "Cook Islands" },
                  { value: "Costa Rica", label: "Costa Rica" },
                  { value: "Cota D'Ivoire", label: "Cote d'Ivoire" },
                  { value: "Croatia", label: "Croatia (Hrvatska)" },
                  { value: "Cuba", label: "Cuba" },
                  { value: "Cyprus", label: "Cyprus" },
                  { value: "Czech Republic", label: "Czech Republic" },
                  { value: "Denmark", label: "Denmark" },
                  { value: "Djibouti", label: "Djibouti" },
                  { value: "Dominica", label: "Dominica" },
                  { value: "Dominican Republic", label: "Dominican Republic" },
                  { value: "East Timor", label: "East Timor" },
                  { value: "Ecuador", label: "Ecuador" },
                  { value: "Egypt", label: "Egypt" },
                  { value: "El Salvador", label: "El Salvador" },
                  { value: "Equatorial Guinea", label: "Equatorial Guinea" },
                  { value: "Eritrea", label: "Eritrea" },
                  { value: "Estonia", label: "Estonia" },
                  { value: "Ethiopia", label: "Ethiopia" },
                  { value: "Falkland Islands", label: "Falkland Islands (Malvinas)" },
                  { value: "Faroe Islands", label: "Faroe Islands" },
                  { value: "Fiji", label: "Fiji" },
                  { value: "Finland", label: "Finland" },
                  { value: "France", label: "France" },
                  { value: "France Metropolitan", label: "France, Metropolitan" },
                  { value: "French Guiana", label: "French Guiana" },
                  { value: "French Polynesia", label: "French Polynesia" },
                  { value: "French Southern Territories", label: "French Southern Territories" },
                  { value: "Gabon", label: "Gabon" },
                  { value: "Gambia", label: "Gambia" },
                  { value: "Georgia", label: "Georgia" },
                  { value: "Germany", label: "Germany" },
                  { value: "Ghana", label: "Ghana" },
                  { value: "Gibraltar", label: "Gibraltar" },
                  { value: "Greece", label: "Greece" },
                  { value: "Greenland", label: "Greenland" },
                  { value: "Grenada", label: "Grenada" },
                  { value: "Guadeloupe", label: "Guadeloupe" },
                  { value: "Guam", label: "Guam" },
                  { value: "Guatemala", label: "Guatemala" },
                  { value: "Guinea", label: "Guinea" },
                  { value: "Guinea-Bissau", label: "Guinea-Bissau" },
                  { value: "Guyana", label: "Guyana" },
                  { value: "Haiti", label: "Haiti" },
                  { value: "Heard and McDonald Islands", label: "Heard and Mc Donald Islands" },
                  { value: "Holy See", label: "Holy See (Vatican City State)" },
                  { value: "Honduras", label: "Honduras" },
                  { value: "Hong Kong", label: "Hong Kong" },
                  { value: "Hungary", label: "Hungary" },
                  { value: "Iceland", label: "Iceland" },
                  { value: "India", label: "India" },
                  { value: "Indonesia", label: "Indonesia" },
                  { value: "Iran", label: "Iran (Islamic Republic of)" },
                  { value: "Iraq", label: "Iraq" },
                  { value: "Ireland", label: "Ireland" },
                  { value: "Israel", label: "Israel" },
                  { value: "Italy", label: "Italy" },
                  { value: "Jamaica", label: "Jamaica" },
                  { value: "Japan", label: "Japan" },
                  { value: "Jordan", label: "Jordan" },
                  { value: "Kazakhstan", label: "Kazakhstan" },
                  { value: "Kenya", label: "Kenya" },
                  { value: "Kiribati", label: "Kiribati" },
                  { value: "Democratic People's Republic of Korea", label: "Korea, Democratic People's Republic of" },
                  { value: "Korea", label: "Korea, Republic of" },
                  { value: "Kuwait", label: "Kuwait" },
                  { value: "Kyrgyzstan", label: "Kyrgyzstan" },
                  { value: "Lao", label: "Lao People's Democratic Republic" },
                  { value: "Latvia", label: "Latvia" },
                  { value: "Lebanon" , label: "Lebanon" },
                  { value: "Lesotho", label: "Lesotho" },
                  { value: "Liberia", label: "Liberia" },
                  { value: "Libyan Arab Jamahiriya", label: "Libyan Arab Jamahiriya" },
                  { value: "Liechtenstein", label: "Liechtenstein" },
                  { value: "Lithuania", label: "Lithuania" },
                  { value: "Luxembourg", label: "Luxembourg" },
                  { value: "Macau", label: "Macau" },
                  { value: "Macedonia", label: "Macedonia, The Former Yugoslav Republic of" },
                  { value: "Madagascar", label: "Madagascar" },
                  { value: "Malawi", label: "Malawi" },
                  { value: "Malaysia", label: "Malaysia" },
                  { value: "Maldives", label: "Maldives" },
                  { value: "Mali", label: "Mali" },
                  { value: "Malta", label: "Malta" },
                  { value: "Marshall Islands", label: "Marshall Islands" },
                  { value: "Martinique", label: "Martinique" },
                  { value: "Mauritania", label: "Mauritania" },
                  { value: "Mauritius", label: "Mauritius" },
                  { value: "Mayotte", label: "Mayotte" },
                  { value: "Mexico", label: "Mexico" },
                  { value: "Micronesia", label: "Micronesia, Federated States of" },
                  { value: "Moldova", label: "Moldova, Republic of" },
                  { value: "Monaco", label: "Monaco" },
                  { value: "Mongolia", label: "Mongolia" },
                  { value: "Montserrat", label: "Montserrat" },
                  { value: "Morocco", label: "Morocco" },
                  { value: "Mozambique", label: "Mozambique" },
                  { value: "Myanmar", label: "Myanmar" },
                  { value: "Namibia", label: "Namibia" },
                  { value: "Nauru", label: "Nauru" },
                  { value: "Nepal", label: "Nepal" },
                  { value: "Netherlands", label: "Netherlands" },
                  { value: "Netherlands Antilles", label: "Netherlands Antilles" },
                  { value: "New Caledonia", label: "New Caledonia" },
                  { value: "New Zealand", label: "New Zealand" },
                  { value: "Nicaragua", label: "Nicaragua" },
                  { value: "Niger", label: "Niger" },
                  { value: "Nigeria", label: "Nigeria" },
                  { value: "Niue", label: "Niue" },
                  { value: "Norfolk Island", label: "Norfolk Island" },
                  { value: "Northern Mariana Islands", label: "Northern Mariana Islands" },
                  { value: "Norway", label: "Norway" },
                  { value: "Oman", label: "Oman" },
                  { value: "Pakistan", label: "Pakistan" },
                  { value: "Palau", label: "Palau" },
                  { value: "Panama", label: "Panama" },
                  { value: "Papua New Guinea", label: "Papua New Guinea" },
                  { value: "Paraguay", label: "Paraguay" },
                  { value: "Peru", label: "Peru" },
                  { value: "Philippines", label: "Philippines" },
                  { value: "Pitcairn", label: "Pitcairn" },
                  { value: "Poland", label: "Poland" },
                  { value: "Portugal", label: "Portugal" },
                  { value: "Puerto Rico", label: "Puerto Rico" },
                  { value: "Qatar", label: "Qatar" },
                  { value: "Reunion", label: "Reunion" },
                  { value: "Romania", label: "Romania" },
                  { value: "Russia", label: "Russian Federation" },
                  { value: "Rwanda", label: "Rwanda" },
                  { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" }, 
                  { value: "Saint LUCIA", label: "Saint LUCIA" },
                  { value: "Saint Vincent", label: "Saint Vincent and the Grenadines" },
                  { value: "Samoa", label: "Samoa" },
                  { value: "San Marino", label: "San Marino" },
                  { value: "Sao Tome and Principe", label: "Sao Tome and Principe" }, 
                  { value: "Saudi Arabia", label: "Saudi Arabia" },
                  { value: "Senegal", label: "Senegal" },
                  { value: "Seychelles", label: "Seychelles" },
                  { value: "Sierra", label: "Sierra Leone" },
                  { value: "Singapore", label: "Singapore" },
                  { value: "Slovakia", label: "Slovakia (Slovak Republic)" },
                  { value: "Slovenia", label: "Slovenia" },
                  { value: "Solomon Islands", label: "Solomon Islands" },
                  { value: "Somalia", label: "Somalia" },
                  { value: "South Africa", label: "South Africa" },
                  { value: "South Georgia", label: "South Georgia and the South Sandwich Islands" },
                  { value: "Span", label: "Spain" },
                  { value: "SriLanka", label: "Sri Lanka" },
                  { value: "St. Helena", label: "St. Helena" },
                  { value: "St. Pierre and Miguelon", label: "St. Pierre and Miquelon" },
                  { value: "Sudan", label: "Sudan" },
                  { value: "Suriname", label: "Suriname" },
                  { value: "Svalbard", label: "Svalbard and Jan Mayen Islands" },
                  { value: "Swaziland", label: "Swaziland" },
                  { value: "Sweden", label: "Sweden" },
                  { value: "Switzerland", label: "Switzerland" },
                  { value: "Syria", label: "Syrian Arab Republic" },
                  { value: "Taiwan", label: "Taiwan, Province of China" },
                  { value: "Tajikistan", label: "Tajikistan" },
                  { value: "Tanzania", label: "Tanzania, United Republic of" },
                  { value: "Thailand", label: "Thailand" },
                  { value: "Togo", label: "Togo" },
                  { value: "Tokelau", label: "Tokelau" },
                  { value: "Tonga", label: "Tonga" },
                  { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
                  { value: "Tunisia", label: "Tunisia" },
                  { value: "Turkey", label: "Turkey" },
                  { value: "Turkmenistan", label: "Turkmenistan" },
                  { value: "Turks and Caicos", label: "Turks and Caicos Islands" },
                  { value: "Tuvalu", label: "Tuvalu" },
                  { value: "Uganda", label: "Uganda" },
                  { value: "Ukraine", label: "Ukraine" },
                  { value: "United Arab Emirates", label: "United Arab Emirates" },
                  { value: "United Kingdom", label: "United Kingdom" },
                  { value: "United States", label: "United States" },
                  { value: "United States Minor Outlying Islands", label: "United States Minor Outlying Islands" },
                  { value: "Uruguay", label: "Uruguay" },
                  { value: "Uzbekistan", label: "Uzbekistan" },
                  { value: "Vanuatu", label: "Vanuatu" },
                  { value: "Venezuela", label: "Venezuela" },
                  { value: "Vietnam", label: "Viet Nam" },
                  { value: "Virgin Islands (British)", label: "Virgin Islands (British)" },
                  { value: "Virgin Islands (U.S)", label: "Virgin Islands (U.S.)" },
                  { value: "Wallis and Futana Islands", label: "Wallis and Futuna Islands" },
                  { value: "Western Sahara", label: "Western Sahara" },
                  { value: "Yemen", label: "Yemen" },
                  { value: "Yugoslavia", label: "Yugoslavia" },
                  { value: "Zambia", label: "Zambia" },
                  { value: "Zimbabwe", label: "Zimbabwe" },
              
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              </div>
          </div>
          <div className='row form-group'>
          <label className='col-md-2 multilines-2line'>
            Required before investing
            <a className='question'></a>
            </label>
            <div className='col-md-8'>
              <p style={{'marginBottom':'0','marginTop':'10px'}}>
                <input type="checkbox" className="check-block" checked={this.state.formData.pausable} />
                <label className="multilines-2line">Yes</label>
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

export default CreateStep5Form;
