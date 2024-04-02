import React from 'react';
import ReactDOM from 'react-dom';
import App from './pdf-cv/src/app';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app-root')
);
