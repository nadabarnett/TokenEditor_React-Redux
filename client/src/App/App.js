import React, { Component }       from 'react';
import { Route, Switch }          from 'react-router-dom';
import                                 './App.css';
import Auth                       from './pages/Auth';
import Dashboard                  from './pages/Dashboard';
import Register                   from './pages/Register';
import Setting                    from './pages/Setting';
import Billing                    from './pages/Billingupdate';
import Transactions               from './pages/Transactions';
import Affiliate                  from './pages/Affiliate';
import KycAml                     from './pages/KycAml';
import AddToken                   from './pages/AddToken';
import ViewCampaign               from './pages/ViewCampaign';
import Compaign                   from './pages/Compaign';
import Crowdsales                 from './pages/Crowdsales';
import Tokens                     from './pages/Tokens';
import AddCrowdsale               from './pages/AddCrowdsale';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Auth}/>
          <Route path='/dashboard' component={Dashboard}/>
          <Route path='/Transactions' component={Transactions}/>
          <Route path='/Affiliate' component={Affiliate}/>
          <Route path='/KycAml' component={KycAml}/>
          <Route path='/register' component={Register}/>
          <Route path='/setting' component={Setting}/>
          <Route path='/billing' component={Billing}/>
          <Route path='/Tokens' component={Tokens}/>
          <Route path='/Crowdsales' component={Crowdsales}/>
          <Route path='/ViewCampaign' component={ViewCampaign}/>
          <Route path='/compaign' component={Compaign}/>
          <Route path='/addToken' component={AddToken}/>
          <Route path='/addCrowdsale' component={AddCrowdsale}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
