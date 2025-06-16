import React, { useReducer } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider

// Import your screens
import HomeScreen from './pdf-cv/src/screens/HomeScreen'; // Updated path
import DetailsScreen from './pdf-cv/src/screens/DetailsScreen'; // Updated path

// Create a stack navigator
const Stack = createStackNavigator();

const initialState = {
  pdf: null,
  uploading: false,
  uploadProgress: 0,
  stars: 0,
  tips: [], // Added tips to initial state
  errorMessage: "",
  isDetailsOpen: false,
  firstName: "",
  email: "",
  contact: "",
  analysisStepMessage: "", // Added for granular updates
};

// Removed Greet component and react-dom/server import

function reducer(state, action) {
  console.log(`[REDUCER] Action: ${action.type}`, action.payload !== undefined ? action.payload : '');
  switch (action.type) {
    case "SET_PDF":
      return { ...state, pdf: action.payload, analysisStepMessage: "", errorMessage: "", stars: 0, tips: [] }; // Clear analysis message and results
    case "UPLOAD_START":
      return { ...state, uploading: true, uploadProgress: 0, errorMessage: "", analysisStepMessage: "Initiating upload..." };
    case "UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload };
    case "SET_ANALYSIS_MESSAGE":
      return { ...state, analysisStepMessage: action.payload };
    case "UPLOAD_SUCCESS":
      console.log("[REDUCER] UPLOAD_SUCCESS: Stars -", action.payload.stars, "Tips -", action.payload.tips ? action.payload.tips.length : 0);
      return {
        ...state,
        uploading: false,
        stars: action.payload.stars,
        tips: action.payload.tips,
        uploadProgress: 100,
        errorMessage: "",
        analysisStepMessage: "Analysis complete!",
      };
    case "UPLOAD_FAIL":
      console.error("[REDUCER] UPLOAD_FAIL:", action.payload);
      return {
        ...state,
        uploading: false,
        errorMessage: action.payload,
        uploadProgress: 0,
        analysisStepMessage: "Process failed.",
      };
    case "TOGGLE_DETAILS":
      return { ...state, isDetailsOpen: !state.isDetailsOpen };
    case "SET_FIRST_NAME":
      return { ...state, firstName: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_CONTACT":
      return { ...state, contact: action.payload };
    default:
      console.warn(`[REDUCER] Unknown action type: ${action.type}`);
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Removed unused count state

  // UI rendering logic and related functions (pickDocument, uploadAndAnalyze, getStarEmoji) removed

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} state={state} dispatch={dispatch} />}
          </Stack.Screen>
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;

// Styles removed as they are related to UI elements moved to HomeScreen