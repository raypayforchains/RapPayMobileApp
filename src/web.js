// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { colorCode1 } from './fixed';
import { ActivityIndicator } from '@react-native-material/core';

const WebApps = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(route.params.url); // Initialize URL state


  const [localUIVisible, setLocalUIVisible] = useState(false);

  // This function intercepts URL changes from the WebView
  const onNavigationStateChange = (navState) => {
    const { url } = navState;
    // console.log(url)

    // Check if the URL contains a trigger command
    if (url.includes('https://in.raypay.online/')) {
      const rm = url.substring(25 ,url.length );
      const arrayRm = rm.split("/")
      console.log(arrayRm[0])
      navigation.navigate("Payment", { "key": arrayRm[0], "pay": arrayRm[1], })
    }
  };


  useEffect(() => {
    // console.log(route.params);

    // Clean up the listener on unmount
    return () => {
      //linkingListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colorCode1} size="large" />
        </View>
      )}
      <WebView

        onLoadEnd={() => setLoading(false)} // Hide loading indicator when done
        source={{ uri: url }} // Use state for the URL
        style={{ flex: 1 }}
        // onMessage={onMessageReceived}
        onNavigationStateChange={onNavigationStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Keeps loading indicator above WebView
  },
});

export default WebApps;