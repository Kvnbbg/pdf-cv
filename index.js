import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './pdf-cv/src/app';
import { name as appName } from './app.json';

// Register for React Native
AppRegistry.registerComponent(appName, () => App);

// Specific setup for web platform
if (Platform.OS === 'web') {
  const ReactDOM = require('react-dom');

  // Define the 'root' div in your web/index.html
  const rootTag = document.getElementById('app-root') || document.getElementById('root');

  ReactDOM.render(<App />, rootTag);
}
