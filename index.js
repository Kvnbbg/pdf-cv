import React from "react";
import { AppRegistry, Platform } from "react-native";
import App from "/pdf-cv/src/app";
import { name as appName } from "/pdf-cv/src/app.json";

// Register for React Native
import ReactDOM from "react-dom"; // Add the missing import statement

AppRegistry.registerComponent(appName, () => App);

// Specific setup for web platform
if (Platform.OS === "web") {
  // Define the 'root' div in your web/index.html
  const rootTag =
    document.getElementById("app-root") || document.getElementById("root");

  ReactDOM.render(<App />, rootTag); // Wrap the rendering of the App component in ReactDOM.render
}
