import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {name as appName} from './pdf-cv/app.json';

AppRegistry.registerComponent(appName, () => App);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
