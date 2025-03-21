import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a fallback API URL in case environment variable isn't set
const API_BASE_URL = process.env.API_URL || 'http://192.168.186.109:5000';

const login = async (username, password) => {
  try {
    console.log(`Attempting to connect to: ${API_BASE_URL}/auth/login`);
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Clear the timeout if fetch completes
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return response.json(); // { token: "..." }
  } catch (error) {
    console.error('Login request failed:', error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw error;
  }
};

// Apply the same changes to the signup function
const signup = async (username, password) => {
  try {
    console.log(`Attempting to connect to: ${API_BASE_URL}/auth/signup`);
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Clear the timeout if fetch completes
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return response.json(); // { token: "..." }
  } catch (error) {
    console.error('Signup request failed:', error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw error;
  }
};

const LoginScreen = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      setError('');
      const response = isSignup ? await signup(username, password) : await login(username, password);
      await AsyncStorage.setItem('token', response.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please check your network connection and try again.');
      Alert.alert('Authentication Error', error.message || 'Network request failed');
    }
  };

  // Rest of the component remains the same
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.button}>
        <Button
          title={isSignup ? 'Sign Up' : 'Log In'}
          onPress={handleAuth}
          color="#000"
        />
      </View>
      <View style={styles.button}>
        <Button
          title={`Switch to ${isSignup ? 'Log In' : 'Sign Up'}`}
          onPress={() => setIsSignup(!isSignup)}
          color="#000"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;