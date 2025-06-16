import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  // ActivityIndicator, // Replaced by LottieView
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import LottieView from "lottie-react-native"; // Import LottieView
import UserProfile from '../../../components/UserProfile';
import { analyzeCv } from '../../services/cvAnalysisService';
import { useTheme } from '../../../context/ThemeContext';

const HomeScreen = ({ navigation, state, dispatch }) => {
  const { theme, toggleTheme } = useTheme(); // Consume theme context
  const styles = getStyles(theme); // Get dynamic styles

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
    dispatch({ type: 'UPLOAD_START' }); // Sets initial analysisStepMessage

    // Helper function for delays
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
      dispatch({ type: 'UPLOAD_PROGRESS', payload: 0 });
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Reading PDF...' });
      await delay(500); // Simulate reading PDF

      dispatch({ type: 'UPLOAD_PROGRESS', payload: 20 });
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Extracting text...' });
      await delay(700); // Simulate text extraction

      dispatch({ type: 'UPLOAD_PROGRESS', payload: 40 });
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Preparing for analysis...' });
      await delay(300); // Simulate preparation

      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Analyzing CV content...' });
      // No specific progress here, Lottie indicates ongoing work. analyzeCv has its own 2s delay.
      console.log('[HomeScreen] Calling analyzeCv service...');
      const analysisResult = await analyzeCv(state.pdf); // This includes a 2s delay
      console.log('[HomeScreen] Analysis result received:', analysisResult);

      dispatch({ type: 'UPLOAD_PROGRESS', payload: 90 }); // Analysis done, almost complete
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Finalizing results...' });
      await delay(500);

      dispatch({ type: 'UPLOAD_SUCCESS', payload: analysisResult }); // This sets progress to 100 and final message

      console.log('[HomeScreen] Navigating to Details screen with params:', analysisResult);
      navigation.navigate('Details', {
        stars: analysisResult.stars,
        tips: analysisResult.tips,
      });

    } catch (error) {
      console.error('[HomeScreen] Error during CV analysis:', error);
      const userErrorMessage = "CV analysis failed. Please try again or contact support if the issue persists.";
      const detailedErrorMessage = error.message ? `Analysis Error: ${error.message}` : "CV analysis failed due to an unknown error.";
      dispatch({ type: 'UPLOAD_FAIL', payload: userErrorMessage });
      Alert.alert("Analysis Error", userErrorMessage + (error.message ? `\nDetails: ${error.message}`: ''));
      console.error('[HomeScreen] Detailed error for UPLOAD_FAIL dispatch:', detailedErrorMessage);
    }
  };

  const getStarEmoji = () => {
    return '⭐'.repeat(state.stars);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PDF CV Analyzer</Text>
          <Button title="Toggle Theme" onPress={toggleTheme} color={theme.PRIMARY_COLOR} />
        </View>
        <View style={styles.content}>
          <Button title="Upload CV" onPress={pickDocument} color={theme.PRIMARY_COLOR} disabled={state.uploading} />
          {state.uploading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require('../../pdf-cv/src/assets/uploading-animation.json')} // Corrected path
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
              <Text style={styles.progressText}>{state.analysisStepMessage}</Text>
              <Text style={styles.progressText}>{state.uploadProgress}%</Text>
            </View>
          ) : (
            <>
              {state.pdf && (
                <Button title="Analyze CV" onPress={uploadAndAnalyze} color={theme.PRIMARY_COLOR} disabled={state.uploading} />
              )}
              {state.stars > 0 && (
                <Text style={styles.resultText}>
                  CV Quality: {getStarEmoji()}
                </Text>
              )}
              {state.errorMessage && (
                <Text style={styles.errorText}>{state.errorMessage}</Text>
              )}
              {/* Display analysis complete message if not uploading and message exists (e.g. after success before navigating) */}
              {!state.uploading && state.analysisStepMessage && state.analysisStepMessage === "Analysis complete!" && (
                 <Text style={styles.analysisCompleteText}>{state.analysisStepMessage}</Text>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={() => dispatch({ type: 'TOGGLE_DETAILS' })}
            style={styles.collapsibleHeader}
            disabled={state.uploading}
          >
            <Text style={styles.collapsibleHeaderText}>
              {state.isDetailsOpen ? 'Hide Personal Details' : 'Show Personal Details'}
            </Text>
          </TouchableOpacity>
          {state.isDetailsOpen && (
            <View style={styles.collapsibleContent}>
              <UserProfile
                firstName={state.firstName}
                email={state.email}
                contact={state.contact}
                dispatch={dispatch}
                // Pass theme or rely on UserProfile to consume context itself
              />
            </View>
          )}
          <View style={styles.navigationButton}>
            <Button
              title="Go to Analysis Details"
              onPress={() => navigation.navigate('Details', { stars: state.stars, tips: state.tips })}
              color={theme.PRIMARY_COLOR}
              disabled={!state.stars} // Disable if no analysis done
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles are now a function of the theme
const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.BACKGROUND_COLOR,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  loadingContainer: { // Added for Lottie and text
    alignItems: 'center',
    marginVertical: 20,
  },
  lottieAnimation: { // Added for Lottie
    width: 150,
    height: 150,
  },
  header: {
    backgroundColor: theme.HEADER_BACKGROUND_COLOR,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row', // Align title and toggle button
    justifyContent: 'space-between', // Space out title and button
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.TEXT_COLOR,
  },
  content: {
    padding: 20,
  },
  progressText: {
    fontSize: 16,
    color: theme.TEXT_COLOR,
    textAlign: 'center',
    marginVertical: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: theme.STAR_COLOR,
  },
  analysisCompleteText: { // For the "Analysis complete!" message
    fontSize: 16,
    color: theme.TEXT_COLOR, // Or a success color like theme.PRIMARY_COLOR
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: theme.ERROR_TEXT_COLOR,
    textAlign: 'center',
    marginVertical: 10,
  },
  collapsibleHeader: {
    padding: 10,
    backgroundColor: theme.SECONDARY_COLOR,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  collapsibleHeaderText: {
    color: theme.TEXT_COLOR, // Text color for collapsible header
    fontSize: 16,
  },
  collapsibleContent: {
    padding: 10,
    backgroundColor: theme.CARD_BACKGROUND_COLOR, // Use card background for content
    borderWidth: 1,
    borderColor: theme.BORDER_COLOR,
    borderTopWidth: 0, // Header already has a top border effect due to background change
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  navigationButton: {
    marginTop: 30, // Increased margin
    paddingHorizontal: 20,
  }
});

export default HomeScreen;