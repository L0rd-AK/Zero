import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import TaskListScreen from './screens/TaskListScreen';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return <ActivityIndicator size="large" />;
  }

  return isLoggedIn ? <TaskListScreen /> : <LoginScreen setIsLoggedIn={setIsLoggedIn} />;
};

export default App;