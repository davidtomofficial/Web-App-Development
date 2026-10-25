// App.js
import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AssetExample from './components/AssetExample';
import WelcomeScreen from './components/WelcomeScreen';
import VolunteeringForm from './components/Volunteeringform';
import FeedbackForm from './components/FeedbackForm';

// Initialize the stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ title: 'Welcome to Our App' }}
          />
          <Stack.Screen
            name="AssetExample"
            component={AssetExample}
            options={{ title: 'Robindale YSA Ward' }}
          />
          <Stack.Screen
            name="VolunteeringForm"
            component={VolunteeringForm}
            options={{ title: 'Volunteering' }}
          />
          <Stack.Screen
            name="FeedbackForm"
            component={FeedbackForm}
            options={{ title: 'Suggestions' }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
