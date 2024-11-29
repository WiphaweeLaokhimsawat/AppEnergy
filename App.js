import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/srceen/LoginPage';
import HomeTabs from './src/srceen/HomePage'; // นำเข้า HomeTabs
import Profile from './src/srceen/ProfilePage';
import Import from './src/srceen/ImportFile';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeTabs} // ใช้ HomeTabs ที่กำหนดใน home.js
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="importfile"
          component={Import}
          options={{ title: 'Import file' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
