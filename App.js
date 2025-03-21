import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginScreen from './screens/LoginScreen';
import TaskListScreen from './screens/TaskListScreen';

const Tab = createBottomTabNavigator();

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

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen
            name="Home"
            component={TaskListScreen}
            initialParams={{ status: 'all' }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="On-Going"
            component={TaskListScreen}
            initialParams={{ status: 'on-going' }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="timelapse" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Completed"
            component={TaskListScreen}
            initialParams={{ status: 'completed' }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="check-circle" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Deleted"
            component={TaskListScreen}
            initialParams={{ status: 'deleted' }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="delete" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <LoginScreen setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
};

export default App;