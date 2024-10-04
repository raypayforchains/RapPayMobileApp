import React, { useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Alert, Pressable, Text, StatusBar } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNQRGenerator from 'rn-qr-generator';
import * as Web3 from '@solana/web3.js';

const QRCode = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedCode, setScannedCode] = useState(null);
  const [flash, setFlash] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      setSelectedImage(image.uri);

      if (image.base64) {
        detectQRCode(image.base64);
      }
    }
  };

  const checkPublicKeyExistsOnMainnet = async (publicKey) => {
  //  console.log(publicKey)
    try {
      // Connect to the Solana mainnet
      const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'), 'confirmed');

      // Convert the public key string to a PublicKey object
      const pubKey = new Web3.PublicKey(publicKey);

      // Check if the account exists by fetching account info
      const accountInfo = await connection.getAccountInfo(pubKey);

      if (accountInfo === null) {
       // console.log('Account does not exist');
        navigation.navigate("Payment", { "key": publicKey })
        return false;
      } else {
      //  console.log('Account exists');
        navigation.navigate("Payment", { "key": publicKey })
        return true;
      }
    } catch (error) {
      console.error('Error checking account existence on mainnet:', error);
      return false;
    }
  };

  const detectQRCode = (base64) => {
    RNQRGenerator.detect({
      base64: base64,
    })
      .then(response => {
        const { values } = response;
        if (values.length > 0) {
          checkPublicKeyExistsOnMainnet(values[0])

        } else {
          setScannedCode('No QR Code Found');
          Alert.alert('No QR Code Found');
        }
      })
      .catch(error => {
      //  console.log('Cannot detect QR code in image', error);
        Alert.alert('Error', 'Cannot detect QR code in image');
      });
  };

  const styles = StyleSheet.create({
    cameraContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'transparent',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    scanBox: {
      marginTop: 50,

      width: windowWidth - 80,
      height: windowWidth - 80,
      borderColor: '#ffffff',
      borderWidth: 2,

      alignSelf: "center",
      borderRadius: 30,
      backgroundColor: 'transparent',
    },
    resultText: {
      fontSize: 16,
      color: '#ffffff',
      marginTop: 10,
    },
    uploadButton: {
      backgroundColor: 'white',
      padding: 10,
      alignSelf: "center",
      paddingHorizontal: 15,
      flexDirection: "row", justifyContent: "space-between",
      alignItems: 'center',
      borderRadius: 30,
      marginTop: 20,
    },
    uploadButtonText: {
      fontFamily: 'Aptos-Bold',
      color: 'black',
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor:"black" }}>
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <QRCodeScanner
        onRead={(e) => {
          checkPublicKeyExistsOnMainnet(e.data)
        }}
        flashMode={flash ? "torch" : "off"}
        vibrate={false}
        cameraStyle={{ height: "100%" }}
        reactivate={true}
        
        containerStyle={styles.cameraContainer}
      />

      {/* Translucent overlay */}
      <View style={styles.overlay}>

        <View style={{ flexDirection: "row", marginHorizontal: 20, marginVertical: 20, justifyContent: "space-between" }}>
          <Pressable onPress={() => {
            navigation.navigate("Home")

          }} style={{ alignSelf: "flex-start" }}><Image source={require("../assets/icons/cross.png")} style={{ width: 30, height: 30 }} /></Pressable>
          <Pressable onPress={() => {
            if (flash) {
              setFlash(false)
            } else {
              setFlash(true)
            }

          }} style={{
            alignSelf: "flex-start", backgroundColor: flash ?
              "white" : "transparent", padding: 4, borderRadius: 30,
          }}><Image source={require("../assets/icons/torch.png")} style={{ width: 30, height: 30, tintColor: flash ? "black" : "white" }} /></Pressable>
        </View>



        <View style={styles.scanBox} />
        <Pressable style={styles.uploadButton} onPress={pickImage}>
          <Image source={require("../assets/icons/image.png")} style={{ width: 20, height: 20, marginRight: 10 }} />
          <Text style={styles.uploadButtonText}>Upload from gallery</Text>
        </Pressable>
      </View>

      {/* Display selected image and scan result */}

    </View>
  );
};

export default QRCode;
