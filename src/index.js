import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { generatePDF } from './pdfGenerator';

// Register the app component for both native and web platforms
AppRegistry.registerComponent(appName, () => App);

// Enhanced web initialization with detailed content and error handling
if (typeof document !== 'undefined') {
  const rootElementId = 'app-root';
  const rootTag = document.getElementById(rootElementId);

  if (rootTag) {
    // Start the application on web
    AppRegistry.runApplication(appName, {
      initialProps: {},
      rootTag,
    });

    // Informative logging for successful initialization
    console.log(`Application "${appName}" successfully initialized in the web environment.`);
    try {
      // Attempt to generate a PDF, providing detailed options for customization
      generatePDF(appName, {
        title: "User's Profile PDF",
        description: 'Generating a PDF version of the user profile from the React Native app.',
        rootTag,
      });

      // Logging successful PDF generation
      console.log('PDF generation process started successfully.');
    } catch (error) {
      // Detailed error logging for PDF generation failures
      console.error('Error during PDF generation:', error.message);
      alert('Failed to generate the PDF. Please check the console for detailed error information.');
    }
  } else {
    // Error handling when the root element is not found
    const errorMessage = `Failed to find the root element with ID "${rootElementId}" for web initialization.`;
    console.error(errorMessage);
    // Optionally, display a user-friendly message or error modal here
    alert(errorMessage);
  }
}
