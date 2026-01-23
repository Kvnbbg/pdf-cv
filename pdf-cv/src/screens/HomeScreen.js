import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import LottieView from 'lottie-react-native';
import UserProfile from '../../../components/UserProfile';
import { analyzeCv } from '../../services/cvAnalysisService';
import { useTheme } from '../../../context/ThemeContext';

const INSIGHT_CARDS = [
  { icon: '⚡️', label: 'Avg. scan', value: '~2s' },
  { icon: '🧠', label: 'Smart checks', value: '5' },
  { icon: '🔒', label: 'Privacy', value: 'Local only' },
];

const PROCESS_STEPS = [
  {
    icon: '📤',
    title: 'Upload PDF',
    description: 'Drop your CV and we will parse it safely on device.',
  },
  {
    icon: '🔎',
    title: 'Run analysis',
    description: 'Get instant quality signals and structure insights.',
  },
  {
    icon: '✨',
    title: 'Improve fast',
    description: 'Apply guided tips to elevate your CV score.',
  },
];

const HomeScreen = ({ navigation, state, dispatch }) => {
  const { theme, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const formatFileSize = (sizeInBytes) => {
    if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) {
      return 'Unknown size';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const unitIndex = Math.min(Math.floor(Math.log(sizeInBytes) / Math.log(1024)), units.length - 1);
    const size = sizeInBytes / Math.pow(1024, unitIndex);
    return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      const asset = result.assets[0];
      console.log('[HomeScreen] Document picked successfully. URI:', asset.uri);
      dispatch({
        type: 'SET_PDF',
        payload: {
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
        },
      });
    } else if (result.canceled) {
      console.log('[HomeScreen] Document picking cancelled by user.');
      Alert.alert('Document Picker', 'No document was selected. Please try again if you wish to upload a CV.');
    } else {
      console.error('[HomeScreen] Failed to pick document. Result:', result);
      const errorMessage = 'Failed to pick document. Please try again.';
      Alert.alert('Document Picker', errorMessage);
      dispatch({ type: 'UPLOAD_FAIL', payload: errorMessage });
    }
  };

  const uploadAndAnalyze = async () => {
    if (!state.pdf) {
      Alert.alert('No CV Selected', 'Please upload a CV first to analyze it.');
      return;
    }
    console.log('[HomeScreen] Starting CV upload and analysis for URI:', state.pdf);
    dispatch({ type: 'UPLOAD_START' });

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      dispatch({ type: 'UPLOAD_PROGRESS', payload: 0 });
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Reading PDF...' });
      await delay(500);

      dispatch({ type: 'UPLOAD_PROGRESS', payload: 20 });
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Extracting text...' });
      await delay(700);

      dispatch({ type: 'UPLOAD_PROGRESS', payload: 40 });
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Preparing for analysis...' });
      await delay(300);

      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Analyzing CV content...' });
      console.log('[HomeScreen] Calling analyzeCv service...');
      const analysisResult = await analyzeCv(state.pdf);
      console.log('[HomeScreen] Analysis result received:', analysisResult);

      dispatch({ type: 'UPLOAD_PROGRESS', payload: 90 });
      dispatch({ type: 'SET_ANALYSIS_MESSAGE', payload: 'Finalizing results...' });
      await delay(500);

      dispatch({ type: 'UPLOAD_SUCCESS', payload: analysisResult });

      console.log('[HomeScreen] Navigating to Details screen with params:', analysisResult);
      navigation.navigate('Details', {
        stars: analysisResult.stars,
        tips: analysisResult.tips,
      });
    } catch (error) {
      console.error('[HomeScreen] Error during CV analysis:', error);
      const userErrorMessage = 'CV analysis failed. Please try again or contact support if the issue persists.';
      const detailedErrorMessage = error.message
        ? `Analysis Error: ${error.message}`
        : 'CV analysis failed due to an unknown error.';
      dispatch({ type: 'UPLOAD_FAIL', payload: userErrorMessage });
      Alert.alert('Analysis Error', userErrorMessage + (error.message ? `\nDetails: ${error.message}` : ''));
      console.error('[HomeScreen] Detailed error for UPLOAD_FAIL dispatch:', detailedErrorMessage);
    }
  };

  const getStarEmoji = () => {
    return '⭐'.repeat(state.stars);
  };

  const renderPrimaryButton = ({ label, onPress, disabled }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
      disabled={disabled}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );

  const renderSecondaryButton = ({ label, onPress, disabled }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
      disabled={disabled}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>PDF CV Analyzer</Text>
            <Text style={styles.headerSubtext}>Polish your resume with data-driven feedback.</Text>
          </View>
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [styles.themeToggle, pressed && styles.themeTogglePressed]}
          >
            <Text style={styles.themeToggleText}>Toggle</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>Ship a standout CV</Text>
            <Text style={styles.heroSubtitle}>
              Smart scoring, instant insights, and guided improvements built for modern hiring.
            </Text>
          </View>
          <View style={styles.heroActions}>
            {renderPrimaryButton({ label: 'Upload CV', onPress: pickDocument, disabled: state.uploading })}
            {state.pdf &&
              renderSecondaryButton({
                label: 'Analyze CV',
                onPress: uploadAndAnalyze,
                disabled: state.uploading,
              })}
          </View>
          <View style={styles.insightRow}>
            {INSIGHT_CARDS.map((item) => (
              <View key={item.label} style={styles.insightCard}>
                <Text style={styles.insightIcon}>{item.icon}</Text>
                <Text style={styles.insightValue}>{item.value}</Text>
                <Text style={styles.insightLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {state.uploading ? (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Analyzing your CV</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{state.uploadProgress}%</Text>
              </View>
            </View>
            <LottieView
              source={require('../assets/uploading-animation.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.statusMessage}>{state.analysisStepMessage}</Text>
          </View>
        ) : (
          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Upload status</Text>
              <Text style={styles.statusMessage}>
                {state.pdf ? 'CV ready for analysis.' : 'No CV selected yet.'}
              </Text>
              <View style={styles.statusBadgeNeutral}>
                <Text style={styles.statusBadgeText}>{state.pdf ? 'Ready' : 'Waiting'}</Text>
              </View>
            </View>
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Quality score</Text>
              <Text style={styles.statusMessage}>
                {state.stars > 0 ? `CV Quality: ${getStarEmoji()}` : 'Run analysis to see score.'}
              </Text>
              {state.stars > 0 && (
                <View style={styles.statusBadgeAccent}>
                  <Text style={styles.statusBadgeText}>{state.stars} / 5</Text>
                </View>
              )}
            </View>
            {state.errorMessage ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>Something went wrong</Text>
                <Text style={styles.errorText}>{state.errorMessage}</Text>
              </View>
            ) : null}
          </View>
        )}

        {!state.uploading && state.analysisStepMessage === 'Analysis complete!' && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{state.analysisStepMessage}</Text>
          </View>
        )}

        {!state.uploading && state.pdf && (
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Confirmation</Text>
            <Text style={styles.confirmationText}>
              Selected CV: {state.pdfName || 'Unnamed file'} ({formatFileSize(state.pdfSize)})
            </Text>
            <Text style={styles.confirmationSubtext}>
              Review the file details before running the analysis.
            </Text>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>How it works</Text>
          {PROCESS_STEPS.map((step) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepIconWrapper}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

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
            />
          </View>
        )}

        <View style={styles.navigationButton}>
          {renderPrimaryButton({
            label: 'Go to Analysis Details',
            onPress: () => navigation.navigate('Details', { stars: state.stars, tips: state.tips }),
            disabled: !state.stars,
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const buildShadow = (theme) => ({
  shadowColor: theme.SHADOW_COLOR,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.12,
  shadowRadius: 12,
  elevation: 4,
});

const getStyles = (theme) => {
  const shadow = buildShadow(theme);
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    scrollViewContent: {
      paddingBottom: 32,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerText: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
    },
    headerSubtext: {
      marginTop: 4,
      color: theme.MUTED_TEXT_COLOR,
      fontSize: 14,
    },
    themeToggle: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    themeTogglePressed: {
      opacity: 0.8,
    },
    themeToggleText: {
      fontWeight: '600',
      color: theme.TEXT_COLOR,
    },
    heroCard: {
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...shadow,
    },
    heroHeader: {
      marginBottom: 16,
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
    },
    heroSubtitle: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 22,
      color: theme.MUTED_TEXT_COLOR,
    },
    heroActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: theme.PRIMARY_COLOR,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: theme.BUTTON_TEXT_COLOR,
      fontWeight: '700',
      fontSize: 15,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.SECONDARY_SURFACE_COLOR,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    secondaryButtonText: {
      color: theme.TEXT_COLOR,
      fontWeight: '700',
      fontSize: 15,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonPressed: {
      transform: [{ scale: 0.98 }],
    },
    insightRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    insightCard: {
      flex: 1,
      padding: 12,
      borderRadius: 14,
      backgroundColor: theme.BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      alignItems: 'center',
    },
    insightIcon: {
      fontSize: 18,
    },
    insightValue: {
      marginTop: 6,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
    },
    insightLabel: {
      marginTop: 4,
      fontSize: 12,
      color: theme.MUTED_TEXT_COLOR,
    },
    statusGrid: {
      marginTop: 20,
      gap: 16,
    },
    statusCard: {
      marginHorizontal: 20,
      padding: 18,
      borderRadius: 16,
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...shadow,
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
    },
    statusMessage: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.MUTED_TEXT_COLOR,
      marginBottom: 10,
    },
    statusBadge: {
      backgroundColor: theme.PRIMARY_COLOR,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    statusBadgeNeutral: {
      alignSelf: 'flex-start',
      backgroundColor: theme.SECONDARY_SURFACE_COLOR,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    statusBadgeAccent: {
      alignSelf: 'flex-start',
      backgroundColor: theme.ACCENT_COLOR,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    statusBadgeText: {
      color: theme.BUTTON_TEXT_COLOR,
      fontWeight: '700',
      fontSize: 12,
    },
    lottieAnimation: {
      width: '100%',
      height: 160,
      alignSelf: 'center',
    },
    successBanner: {
      marginTop: 16,
      marginHorizontal: 20,
      backgroundColor: theme.SUCCESS_BACKGROUND_COLOR,
      padding: 12,
      borderRadius: 12,
    },
    successBannerText: {
      textAlign: 'center',
      color: theme.SUCCESS_TEXT_COLOR,
      fontWeight: '600',
    },
    confirmationCard: {
      marginTop: 16,
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...shadow,
    },
    confirmationTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
      marginBottom: 8,
    },
    confirmationText: {
      fontSize: 14,
      color: theme.TEXT_COLOR,
      marginBottom: 6,
    },
    confirmationSubtext: {
      fontSize: 12,
      color: theme.MUTED_TEXT_COLOR,
    },
    errorCard: {
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.ERROR_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.ERROR_BORDER_COLOR,
    },
    errorTitle: {
      fontWeight: '700',
      color: theme.ERROR_TEXT_COLOR,
      marginBottom: 6,
    },
    errorText: {
      color: theme.ERROR_TEXT_COLOR,
    },
    sectionCard: {
      marginTop: 24,
      marginHorizontal: 20,
      padding: 18,
      borderRadius: 16,
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...shadow,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
      marginBottom: 12,
    },
    stepRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 14,
    },
    stepIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.SECONDARY_SURFACE_COLOR,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    stepIcon: {
      fontSize: 16,
    },
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
    },
    stepDescription: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: theme.MUTED_TEXT_COLOR,
    },
    collapsibleHeader: {
      marginTop: 24,
      marginHorizontal: 20,
      padding: 14,
      backgroundColor: theme.SECONDARY_SURFACE_COLOR,
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    collapsibleHeaderText: {
      color: theme.TEXT_COLOR,
      fontSize: 15,
      fontWeight: '600',
    },
    collapsibleContent: {
      marginHorizontal: 20,
      padding: 12,
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      borderTopWidth: 0,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    navigationButton: {
      marginTop: 24,
      marginHorizontal: 20,
    },
  });
};

export default HomeScreen;
