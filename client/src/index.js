import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Web3Provider } from './react-web3';

import './index.css';
import App from './App/App';

render((
  <BrowserRouter>
    <Web3Provider>
        <App/>
    </Web3Provider>
  </BrowserRouter>
), document.getElementById('root'));
