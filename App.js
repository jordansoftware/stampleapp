import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import { DashboardScreen } from './screens/DashboardScreen';
import { AddWorkDayScreen } from './screens/AddWorkDayScreen';
import { PdfViewerScreen } from './screens/PdfViewerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="AddWorkDay"
          component={AddWorkDayScreen}
          options={{
            headerShown: true,
            title: 'Neuer Arbeitstag',
            headerStyle: { backgroundColor: '#2196F3' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="PdfViewer"
          component={PdfViewerScreen}
          options={{
            headerShown: true,
            title: 'PDF',
            headerStyle: { backgroundColor: '#2196F3' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
