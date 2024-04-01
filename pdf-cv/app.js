import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import LottieView from 'lottie-react-native'; // Ensure you have lottie-react-native installed

export default function App() {
  const [pdf, setPdf] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [stars, setStars] = useState(0);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    setPdf(result.uri);
  };

  const uploadAndAnalyze = async () => {
    setUploading(true);
    // Here, add your actual upload and analyze logic and replace the mock code
    setTimeout(() => {
      setStars(5); // This is mock data; replace with actual analysis result
      setUploading(false);
    }, 2000);
  };

  const getStarEmoji = () => {
    return "⭐".repeat(stars); // Returning stars as string of emojis
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PDF CV Analyzer</Text>
        </View>
        <View style={styles.content}>
          <Button title="Upload CV" onPress={pickDocument} />
          {uploading && (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              {/* Ensure you have the animation JSON file in your assets */}
              <LottieView 
                source={require('./path-to-your-lottie-animation.json')} 
                autoPlay 
                loop 
              />
            </>
          )}
          {!uploading && stars > 0 && (
            <>
              <Text style={styles.resultText}>CV Quality:</Text>
              <Text style={styles.stars}>{getStarEmoji()}</Text>
            </>
          )}
          {pdf && !uploading && (
            <Button title="Analyze CV" onPress={uploadAndAnalyze} />
          )}
          {pdf && (
            <Image
              source={{ uri: pdf }}
              style={styles.imagePreview}
            />
          )}
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  imagePreview: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginVertical: 20,
  },
});
