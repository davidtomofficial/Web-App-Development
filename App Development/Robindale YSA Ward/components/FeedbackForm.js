// FeedbackForm.js
import React from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';

export default function FeedbackForm({ navigation }) {
  // A directly loaded browser URL has no prior app screen to return to.
  const goBack = () => {
    if (Platform.OS === 'web' && !navigation.canGoBack()) {
      navigation.replace('AssetExample');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Feedback Form</Text>
      <Text>Portfolio demonstration only. This preview does not collect or submit feedback.</Text>
      {/* Form fields and submit button go here */}
      <Button title="Back" onPress={goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
