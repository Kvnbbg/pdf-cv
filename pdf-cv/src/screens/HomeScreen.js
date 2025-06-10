import React from 'react';
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
  // TextInput, // No longer directly used here
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
// import LottieView from "lottie-react-native"; // LottieView can be added back if animations are desired
import UserProfile from '../../../components/UserProfile'; // Adjusted path
import { analyzeCv } from '../../services/cvAnalysisService'; // Import the new service

const HomeScreen = ({ navigation, state, dispatch }) => {
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      const asset = result.assets[0];
      console.log('[HomeScreen] Document picked successfully. URI:', asset.uri);
      dispatch({ type: 'SET_PDF', payload: asset.uri });
    } else if (result.canceled) {
      console.log('[HomeScreen] Document picking cancelled by user.');
      Alert.alert('Document Picker', 'No document was selected. Please try again if you wish to upload a CV.');
    } else {
      console.error('[HomeScreen] Failed to pick document. Result:', result);
      const errorMessage = "Failed to pick document. Please try again.";
      Alert.alert('Document Picker', errorMessage);
      dispatch({ type: 'UPLOAD_FAIL', payload: errorMessage }); // Dispatch more generic user-facing error
    }
  };

  const uploadAndAnalyze = async () => {
    if (!state.pdf) {
      Alert.alert("No CV Selected", "Please upload a CV first to analyze it.");
      return;
    }
    console.log('[HomeScreen] Starting CV upload and analysis for URI:', state.pdf);
    dispatch({ type: 'UPLOAD_START' });

    // Simulate initial progress before actual analysis starts
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress < 50) { // Simulate some initial upload progress
        dispatch({ type: 'UPLOAD_PROGRESS', payload: currentProgress });
      } else {
        clearInterval(progressInterval); // Stop this simulation
      }
    }, 100);


    try {
      console.log('[HomeScreen] Calling analyzeCv service...');
      const analysisResult = await analyzeCv(state.pdf);
      console.log('[HomeScreen] Analysis result received:', analysisResult);
      clearInterval(progressInterval);
      dispatch({ type: 'UPLOAD_PROGRESS', payload: 100 });
      dispatch({ type: 'UPLOAD_SUCCESS', payload: analysisResult });

      console.log('[HomeScreen] Navigating to Details screen with params:', analysisResult);
      navigation.navigate('Details', {
        stars: analysisResult.stars,
        tips: analysisResult.tips,
      });

    } catch (error) {
      console.error('[HomeScreen] Error during CV analysis:', error);
      clearInterval(progressInterval);
      const userErrorMessage = "CV analysis failed. Please try again or contact support if the issue persists.";
      const detailedErrorMessage = error.message ? `Analysis Error: ${error.message}` : "CV analysis failed due to an unknown error.";
      dispatch({ type: 'UPLOAD_FAIL', payload: userErrorMessage }); // User-facing message
      Alert.alert("Analysis Error", userErrorMessage + (error.message ? `\nDetails: ${error.message}`: '')); // Show details if available
      // Log more detailed error internally
      console.error('[HomeScreen] Detailed error for UPLOAD_FAIL dispatch:', detailedErrorMessage);
    }
  };

  const getStarEmoji = () => {
    return '⭐'.repeat(state.stars);
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
              {/* <LottieView
                source={require("../assets/uploading-animation.json")} // Adjusted path for LottieView
                autoPlay
                loop
                style={{ width: 100, height: 100 }} // Example style, adjust as needed
              /> */}
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
            onPress={() => dispatch({ type: 'TOGGLE_DETAILS' })}
            style={styles.collapsibleHeader}
          >
            <Text>
              {state.isDetailsOpen ? 'Click to collapse' : 'Click to expand'}
            </Text>
          </TouchableOpacity>
          {state.isDetailsOpen && (
            <View style={styles.collapsibleContent}>
              <Text>This content can be expanded or collapsed.</Text>
              {/* You can put more detailed analysis results here */}
            </View>
          )}

          {/* Replace form with UserProfile component */}
          <UserProfile
            firstName={state.firstName}
            email={state.email}
            contact={state.contact}
            dispatch={dispatch}
          />

          <View style={styles.navigationButton}>
            <Button
              title="Go to Details Screen"
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Assuming a default white background
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'center', // Center header text
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  resultText: {
    fontSize: 18, // Adjusted for better fit
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18, // Adjusted for better fit
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  collapsibleHeader: {
    padding: 10,
    backgroundColor: '#e0e0e0', // Slightly different background for collapsible header
    marginTop: 20,
    alignItems: 'center',
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  // form, formHeader, and input styles are no longer needed here as UserProfile handles its own styling
  navigationButton: {
    marginTop: 20,
    paddingHorizontal: 50, // Add some horizontal padding to center the button a bit
  }
});

export default HomeScreen;