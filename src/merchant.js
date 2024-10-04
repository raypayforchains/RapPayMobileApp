import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { AppBar } from '@react-native-material/core';
import { colorCode, colorCode1 } from './fixed'; // Import your color constants

const Merchant = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* AppBar at the top */}
      <AppBar 
        color={colorCode1} 
        leading={()=>(
            <Pressable onPress={() => {
                navigation.navigate("Home")
              }}>
  
  
                <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30, tintColor: "white" }} />
              </Pressable>
        )}
        title={() => <Text style={styles.appBarTitle}>Become a merchant</Text>} 
      />
      
      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>Get RayPay SoundBox</Text>

        {/* Image of the SoundBox */}
        <Image 
          source={require('../assets/icons/sound_box.png')} 
          style={styles.soundBoxImage} 
          resizeMode="contain" 
        />
        
        {/* Descriptive text */}
        <Text style={styles.description}>Get instant alert on receiving transactions.</Text>
        <Text style={styles.description}>Setup in your regional language</Text>
        <Text style={styles.description}>Get on rent at just 5 USD / month</Text>
        
        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Coming Soon!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  appBarTitle: {
    fontFamily: 'Aptos-Bold',
    color: 'white',
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontFamily: 'Aptos-Bold',
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
  },
  soundBoxImage: {
    width: '50%',
    height: 300,
  },
  description: {
    fontFamily: 'Aptos-Bold',
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: colorCode1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Aptos-Bold',
  },
});


export default Merchant;
