import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Store, StoreProvider } from './common/AppStore';
import { Parse } from 'parse';

Parse.initialize('B2opqxpHNXzU5KeF3u2pBcgTmomBV8lb7vc46qCd');
Parse.serverURL = 'http://localhost:1337/parse';

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
