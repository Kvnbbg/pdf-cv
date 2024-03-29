import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { generatePDF } from './pdfGenerator';

// Register the app component for both native and web
AppRegistry.registerComponent(pdf-cv, () => App);

// This ensures the app's entry point is correct for web
if (typeof document !== 'undefined') {
  AppRegistry.runApplication(pdf-cv, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
  });
}
// Generate a PDF file from the React Native app

// Call the generatePDF function with the desired options
generatePDF(pdf-cv, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
});