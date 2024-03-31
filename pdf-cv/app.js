import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexGrow}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>App Header</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text>Open up App.js to start working on your app!</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInputText}
              value={inputText}
              placeholder="Enter some text"
            />
            <Text>You entered: {inputText}</Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.footerText}>App Footer</Text>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  flexGrow: {
    flexGrow: 1,
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
  scrollView: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  footer: {
    height: 60,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
