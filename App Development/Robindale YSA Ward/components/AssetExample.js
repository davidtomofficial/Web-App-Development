// AssetExample.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { bibleQuotes } from '../assets/bibleQuotes'; // Adjust the path if needed
import { createExternalLinkActions } from '../utils/externalLinks';

const { openAppOrStore, openUrl } = createExternalLinkActions({ Linking, Alert, Platform });

export default function AssetExample({ navigation }) {
  // State to hold the randomly selected quote
  const [randomQuote, setRandomQuote] = useState("");

  // Set a random quote when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleQuotes.length);
    setRandomQuote(bibleQuotes[randomIndex]);
  }, []);

  // Function to open Google Calendar directly or via store/web fallback
  const openGoogleCalendar = () => {
    const googleCalendarUrl = 'https://calendar.google.com/calendar/u/0/r';
    const googleCalendarStoreUrl =
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=com.google.android.calendar'
        : 'https://apps.apple.com/us/app/google-calendar-get-organised/id909319292';

    openAppOrStore('googlecalendar://', googleCalendarStoreUrl, googleCalendarUrl);
  };

  // Function to open the LDS Tools app or provide a download link
  const openLdsTools = () => {
    const appScheme = 'ldstools://';
    const webFallbackUrl = 'https://www.churchofjesuschrist.org/';
    const storeUrl =
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=org.lds.ldstools&hl=en_US&gl=US'
        : 'https://apps.apple.com/us/app/member-tools/id391093033';

    openAppOrStore(appScheme, storeUrl, webFallbackUrl);
  };

  // Function to open GroupMe or provide a download link
  const openGroupMe = () => {
    const appScheme = 'groupme://';
    const webFallbackUrl = 'https://groupme.com/en-US/';
    const storeUrl =
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=com.groupme.android'
        : 'https://apps.apple.com/us/app/groupme/id392796698';

    openAppOrStore(appScheme, storeUrl, webFallbackUrl);
  };

  // Function to navigate to the volunteering and feedback forms
  const openForm = (formName) => {
    navigation.navigate(formName);
  };

  // Function to open the default email client for bug reports
  const openEmailClient = () => {
    const email = 'support@RobindaleYSA.com';
    const subject = 'Bug Report or Feedback';
    const body = 'Hello, I would like to report a bug or provide feedback. Please provide details here:';

    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return openUrl(emailUrl);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.paragraph}>Robindale YSA Ward</Text>
      <Image style={styles.logo} source={require('../assets/Robindale-YSA-logo.jpg')} />
      <Text style={styles.slogan}>Be mindful.</Text>
      <Text style={styles.bibleQuote}>{randomQuote}</Text>

      {/* Empty Boxes for Different Sections */}
      <View style={styles.boxContainer}>
        <TouchableOpacity accessibilityRole="button" style={styles.box} onPress={openGoogleCalendar}>
          <Text style={styles.boxText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.box} onPress={openLdsTools}>
          <Text style={styles.boxText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.box} onPress={openGroupMe}>
          <Text style={styles.boxText}>Messaging</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.box} onPress={() => openForm('VolunteeringForm')}>
          <Text style={styles.boxText}>Volunteering</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.box} onPress={() => openForm('FeedbackForm')}>
          <Text style={styles.boxText}>Suggestions</Text>
        </TouchableOpacity>
      </View>

      {/* Bug Feedback Section with Hyperlink */}
      <View style={styles.bugFeedbackContainer}>
        <TouchableOpacity accessibilityRole="button" onPress={openEmailClient}>
          <Text style={styles.bugFeedbackText}>Report a bug or give feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 128,
    width: 128,
  },
  slogan: {
    fontSize: 14,
    marginVertical: 16,
  },
  bibleQuote: {
    fontSize: 12,
    marginTop: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  boxContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#f0f8ff',
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bugFeedbackContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: '#c0c0c0',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  bugFeedbackText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
