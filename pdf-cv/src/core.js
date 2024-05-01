import React, { useReducer, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import LottieView from "lottie-react-native";

const initialState = {
  pdf: null,
  uploading: false,
  uploadProgress: 0,
  stars: 0,
  errorMessage: "",
  isDetailsOpen: false,
  firstName: "",
  email: "",
  contact: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PDF":
      return { ...state, pdf: action.payload };
    case "UPLOAD_START":
      return { ...state, uploading: true, uploadProgress: 0, errorMessage: "" };
    case "UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        uploading: false,
        stars: action.payload,
        uploadProgress: 100,
      };
    case "UPLOAD_FAIL":
      return {
        ...state,
        uploading: false,
        errorMessage: action.payload,
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
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [count, setCount] = useState(0); // Add the missing import statement for useState hook

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      dispatch({ type: "SET_PDF", payload: result.uri });
    } else if (result.type === "cancel") {
      Alert.alert("Document Picker", "No document picked");
    } else {
      dispatch({ type: "UPLOAD_FAIL", payload: "Failed to pick document" });
    }
  };

  const uploadAndAnalyze = async () => {
    dispatch({ type: "UPLOAD_START" });
    try {
      const timer = setInterval(() => {
        dispatch({
          type: "UPLOAD_PROGRESS",
          payload: state.uploadProgress + 10,
        });
        if (state.uploadProgress >= 100) {
          clearInterval(timer);
          dispatch({ type: "UPLOAD_SUCCESS", payload: 5 });
        }
      }, 200);
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL", payload: "Upload failed" });
    }
  };

  const getStarEmoji = () => {
    return "⭐".repeat(state.stars);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>PDF CV Analyzer and Contact Hub</Text>
        </View>
        <View style={styles.content}>
          <Button title="Upload CV" onPress={pickDocument} />
          {state.uploading ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <LottieView
                source={require("./assets/uploading-animation.json")}
                autoPlay
                loop
              />
              <Text>{state.uploadProgress}%</Text>
            </>
          ) : (
            <>
              {state.pdf && (
                <Button title="Analyze CV" onPress={uploadAndAnalyze} />
              )}
              {state.stars > 0 && (
                <Text style={styles.resultText}>
                  CV Quality: {getStarEmoji()}
                </Text>
              )}
              {state.errorMessage && (
                <Text style={styles.errorText}>{state.errorMessage}</Text>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={() => dispatch({ type: "TOGGLE_DETAILS" })}
            style={styles.collapsibleHeader}
          >
            <Text>
              {state.isDetailsOpen ? "Click to collapse" : "Click to expand"}
            </Text>
          </TouchableOpacity>
          {state.isDetailsOpen && (
            <View style={styles.collapsibleContent}>
              <Text>This content can be expanded or collapsed.</Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.formHeader}>Personal Details</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={state.firstName}
              onChangeText={(text) =>
                dispatch({ type: "SET_FIRST_NAME", payload: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={state.email}
              onChangeText={(text) =>
                dispatch({ type: "SET_EMAIL", payload: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Contact"
              value={state.contact}
              onChangeText={(text) =>
                dispatch({ type: "SET_CONTACT", payload: text })
              }
            />
            <Button title="Submit" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  resultText: {
    fontSize: 24,
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginVertical: 10,
  },
  stars: {
    fontSize: 30,
    color: "#ffd700",
  },
  collapsibleHeader: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: "center",
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: "#fff",
  },
  form: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  formHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});
import React, { useReducer, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import LottieView from "lottie-react-native";

const initialState = {
  pdf: null,
  uploading: false,
  uploadProgress: 0,
  stars: 0,
  errorMessage: "",
  isDetailsOpen: false,
  firstName: "",
  email: "",
  contact: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PDF":
      return { ...state, pdf: action.payload };
    case "UPLOAD_START":
      return { ...state, uploading: true, uploadProgress: 0, errorMessage: "" };
    case "UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        uploading: false,
        stars: action.payload,
        uploadProgress: 100,
      };
    case "UPLOAD_FAIL":
      return {
        ...state,
        uploading: false,
        errorMessage: action.payload,
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
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [count, setCount] = useState(0); // Add the missing import statement for useState hook

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      dispatch({ type: "SET_PDF", payload: result.uri });
    } else if (result.type === "cancel") {
      Alert.alert("Document Picker", "No document picked");
    } else {
      dispatch({ type: "UPLOAD_FAIL", payload: "Failed to pick document" });
    }
  };

  const uploadAndAnalyze = async () => {
    dispatch({ type: "UPLOAD_START" });
    try {
      const timer = setInterval(() => {
        dispatch({
          type: "UPLOAD_PROGRESS",
          payload: state.uploadProgress + 10,
        });
        if (state.uploadProgress >= 100) {
          clearInterval(timer);
          dispatch({ type: "UPLOAD_SUCCESS", payload: 5 });
        }
      }, 200);
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL", payload: "Upload failed" });
    }
  };

  const getStarEmoji = () => {
    return "⭐".repeat(state.stars);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>PDF CV Analyzer and Contact Hub</Text>
        </View>
        <View style={styles.content}>
          <Button title="Upload CV" onPress={pickDocument} />
          {state.uploading ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <LottieView
                source={require("./assets/uploading-animation.json")}
                autoPlay
                loop
              />
              <Text>{state.uploadProgress}%</Text>
            </>
          ) : (
            <>
              {state.pdf && (
                <Button title="Analyze CV" onPress={uploadAndAnalyze} />
              )}
              {state.stars > 0 && (
                <Text style={styles.resultText}>
                  CV Quality: {getStarEmoji()}
                </Text>
              )}
              {state.errorMessage && (
                <Text style={styles.errorText}>{state.errorMessage}</Text>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={() => dispatch({ type: "TOGGLE_DETAILS" })}
            style={styles.collapsibleHeader}
          >
            <Text>
              {state.isDetailsOpen ? "Click to collapse" : "Click to expand"}
            </Text>
          </TouchableOpacity>
          {state.isDetailsOpen && (
            <View style={styles.collapsibleContent}>
              <Text>This content can be expanded or collapsed.</Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.formHeader}>Personal Details</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={state.firstName}
              onChangeText={(text) =>
                dispatch({ type: "SET_FIRST_NAME", payload: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={state.email}
              onChangeText={(text) =>
                dispatch({ type: "SET_EMAIL", payload: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Contact"
              value={state.contact}
              onChangeText={(text) =>
                dispatch({ type: "SET_CONTACT", payload: text })
              }
            />
            <Button title="Submit" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  resultText: {
    fontSize: 24,
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginVertical: 10,
  },
  stars: {
    fontSize: 30,
    color: "#ffd700",
  },
  collapsibleHeader: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: "center",
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: "#fff",
  },
  form: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  formHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});
