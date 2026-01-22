import React, { useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "./context/ThemeContext";
import HomeScreen from "./pdf-cv/src/screens/HomeScreen";
import DetailsScreen from "./pdf-cv/src/screens/DetailsScreen";

const Stack = createStackNavigator();
const UPLOAD_COMPLETE_PROGRESS = 100;
const INITIAL_UPLOAD_PROGRESS = 0;
const DEFAULT_ERROR_MESSAGE = "Upload failed.";

const logger = {
  info: () => undefined,
  warn: () => undefined,
  error: (message, error) => {
    if (process.env.NODE_ENV === "production") {
      return;
    }
    if (error instanceof Error) {
      console.error(message, { message: error.message, stack: error.stack });
      return;
    }
    console.error(message, error);
  },
};

const initialState = {
  pdf: null,
  uploading: false,
  uploadProgress: INITIAL_UPLOAD_PROGRESS,
  stars: 0,
  tips: [],
  errorMessage: "",
  isDetailsOpen: false,
  firstName: "",
  email: "",
  contact: "",
  analysisStepMessage: "",
};

const clampNumber = (value, min, max) => Math.min(Math.max(value, min), max);
const normalizeTips = (tips) => (Array.isArray(tips) ? tips : []);

/**
 * Reducer for app-level state updates.
 * @param {object} state - Current application state.
 * @param {object} action - Dispatched action with type and payload.
 * @returns {object} Updated application state.
 */
function reducer(state, action) {
  if (!action?.type) {
    logger.warn("Reducer received an invalid action.", action);
    return state;
  }

  switch (action.type) {
    case "SET_PDF": {
      const pdf = action.payload ?? null;
      return {
        ...state,
        pdf,
        analysisStepMessage: "",
        errorMessage: "",
        stars: 0,
        tips: [],
      };
    }
    case "UPLOAD_START":
      return {
        ...state,
        uploading: true,
        uploadProgress: INITIAL_UPLOAD_PROGRESS,
        errorMessage: "",
        analysisStepMessage: "Initiating upload...",
      };
    case "UPLOAD_PROGRESS": {
      const progressValue = Number.isFinite(action.payload)
        ? action.payload
        : INITIAL_UPLOAD_PROGRESS;
      return {
        ...state,
        uploadProgress: clampNumber(
          progressValue,
          INITIAL_UPLOAD_PROGRESS,
          UPLOAD_COMPLETE_PROGRESS
        ),
      };
    }
    case "SET_ANALYSIS_MESSAGE": {
      const message =
        typeof action.payload === "string" ? action.payload : "";
      return { ...state, analysisStepMessage: message };
    }
    case "UPLOAD_SUCCESS": {
      const payload = action.payload ?? {};
      const stars = Number.isFinite(payload.stars) ? payload.stars : 0;
      const tips = normalizeTips(payload.tips);
      return {
        ...state,
        uploading: false,
        stars,
        tips,
        uploadProgress: UPLOAD_COMPLETE_PROGRESS,
        errorMessage: "",
        analysisStepMessage: "Analysis complete!",
      };
    }
    case "UPLOAD_FAIL": {
      const errorMessage =
        typeof action.payload === "string"
          ? action.payload
          : DEFAULT_ERROR_MESSAGE;
      logger.error("Upload failed.", action.payload);
      return {
        ...state,
        uploading: false,
        errorMessage,
        uploadProgress: INITIAL_UPLOAD_PROGRESS,
        analysisStepMessage: "Process failed.",
      };
    }
    case "TOGGLE_DETAILS":
      return { ...state, isDetailsOpen: !state.isDetailsOpen };
    case "SET_FIRST_NAME": {
      const firstName =
        typeof action.payload === "string" ? action.payload : "";
      return { ...state, firstName };
    }
    case "SET_EMAIL": {
      const email = typeof action.payload === "string" ? action.payload : "";
      return { ...state, email };
    }
    case "SET_CONTACT": {
      const contact = typeof action.payload === "string" ? action.payload : "";
      return { ...state, contact };
    }
    default:
      logger.warn("Reducer received an unknown action type.", action.type);
      return state;
  }
}

/**
 * Root application component.
 * @returns {JSX.Element} App layout with navigation and theme context.
 */
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

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
