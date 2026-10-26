// Dependencies are supplied by the screen so these behaviors can be tested
// without launching a native app or opening an external service.
function createExternalLinkActions({
  Linking,
  Alert,
  Platform,
  notifyBrowserError = message => globalThis.alert(message),
}) {
  async function openUrl(url) {
    try {
      await Linking.openURL(url);
      return true;
    } catch {
      const title = 'Unable to open link';
      const message = 'Please try again or open the service in your browser.';
      if (Platform.OS === 'web') {
        notifyBrowserError(`${title}. ${message}`);
      } else {
        Alert.alert(title, message);
      }
      return false;
    }
  }

  async function openAppOrStore(appScheme, storeUrl, webFallbackUrl) {
    // Desktop browsers cannot reliably detect a mobile app or show native alerts.
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return openUrl(webFallbackUrl);
    }

    try {
      if (await Linking.canOpenURL(appScheme)) {
        await Linking.openURL(appScheme);
        return true;
      }
    } catch {
      // Both a failed capability query and a failed launch still allow fallback.
    }

    Alert.alert(
      'Open service',
      'The app could not be opened. Choose its website or app store page.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Website', onPress: () => openUrl(webFallbackUrl) },
        { text: 'Download', onPress: () => openUrl(storeUrl) },
      ]
    );
    return false;
  }

  return { openAppOrStore, openUrl };
}

module.exports = { createExternalLinkActions };
