import React from 'react';
import ReactDOM from 'react-dom';
import {AppRegistry} from 'react-native';
import App from './pdf-cv/src/app';
import {name as main} from './app.json';

AppRegistry.registerComponent(main, () => App);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app-root')
);
