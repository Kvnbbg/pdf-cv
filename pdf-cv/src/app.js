// App.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import LottieView from 'lottie-react-native'; // Ensure lottie-react-native is installed

export default function App() {
  const [pdf, setPdf] = useState(null); // State to store selected PDF
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const [stars, setStars] = useState(0); // State to store analysis result as star rating

  // Function to pick a document
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setPdf(result.uri);
    }
  };

  // Mock function to simulate PDF upload and analysis
  const uploadAndAnalyze = async () => {
    setUploading(true);
    // Simulate a network request
    setTimeout(() => {
      setStars(5); // Mock result of 5 stars
      setUploading(false);
    }, 2000);
  };

  // Function to return stars as emoji
  const getStarEmoji = () => {
    return '⭐'.repeat(stars);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PDF CV Analyzer</Text>
        </View>
        <View style={styles.content}>
          <Button title="Upload CV" onPress={pickDocument} />
          {uploading ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <LottieView
                source={require('./assets/lottie-animation.json')} // Add your Lottie animation file npm install lottie-web
                autoPlay
                loop
              />
            </>
          ) : (
            <>
              {pdf && <Button title="Analyze CV" onPress={uploadAndAnalyze} />}
              {stars > 0 && (
                <Text style={styles.resultText}>
                  CV Quality: {getStarEmoji()}
                </Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray backgroundColor for SafeAreaView
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 24,
    marginVertical: 10,
  },
  stars: {
    fontSize: 30,
    color: '#ffd700',
  },
});
