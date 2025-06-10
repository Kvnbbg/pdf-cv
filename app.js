import React, { useReducer } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
};

// Removed Greet component and react-dom/server import

function reducer(state, action) {
  console.log(`[REDUCER] Action: ${action.type}`, action.payload !== undefined ? action.payload : '');
  switch (action.type) {
    case "SET_PDF":
      return { ...state, pdf: action.payload };
    case "UPLOAD_START":
      return { ...state, uploading: true, uploadProgress: 0, errorMessage: "" };
    case "UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload };
    case "UPLOAD_SUCCESS":
      console.log("[REDUCER] UPLOAD_SUCCESS: Stars -", action.payload.stars, "Tips -", action.payload.tips ? action.payload.tips.length : 0);
      return {
        ...state,
        uploading: false,
        stars: action.payload.stars,
        tips: action.payload.tips,
        uploadProgress: 100,
        errorMessage: "", // Clear previous errors on new success
      };
    case "UPLOAD_FAIL":
      console.error("[REDUCER] UPLOAD_FAIL:", action.payload);
      return {
        ...state,
        uploading: false,
        errorMessage: action.payload, // User-friendly message
        uploadProgress: 0,
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {props => <HomeScreen {...props} state={state} dispatch={dispatch} />}
        </Stack.Screen>
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// Styles removed as they are related to UI elements moved to HomeScreen