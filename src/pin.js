import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, FlatList, Dimensions, StatusBar, Pressable } from 'react-native';
import { colorCode, colorCode1 } from './fixed';
import CryptoJS from 'crypto-js'
import * as solanaWeb3 from '@solana/web3.js'; // Solana web3 for transactions
// Custom numeric keypad component

export var publickey = "";


const Keypad = ({ onPress }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'clear'];

    return (
        <View style={{ height: Dimensions.get("window").width * 5 / 5 }}>
            <FlatList data={keys} numColumns={3} renderItem={({ index, item }) => (
                item != "" && item != "clear" ?
                    <TouchableOpacity key={index} style={styles.keyButton} onPress={() => onPress(item)}>
                        <Text style={styles.keyText}>{item}</Text>
                    </TouchableOpacity> :


                    item == "clear" ?

                        <TouchableOpacity key={index} style={styles.keyButton2} onPress={() => onPress(item)}>
                            <Image source={require("../assets/icons/clear.png")} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity key={index} style={styles.keyButton3} onPress={() => onPress(item)}>

                        </TouchableOpacity>





            )} />
        </View>
    );
};


const encryptData = (data, encryptionKey) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();

const PinPage = ({ navigation, route }) => {

    const [pin, setPin] = useState('');
    const [error, setError] = useState(null); // To manage encryption_key
    const [isSettingPin, setIsSettingPin] = useState(false);

    useEffect(() => {
        checkEncryptionKey();
    }, []);

    const showLogoutAlert = () => {
        Alert.alert(
            "Logout Warning", // Title of the alert box
            "Once you logout, you will need to use your seed phrase to log back in. Are you sure you want to logout?", // Warning message
            [
                {
                    text: "Cancel", // Cancel button
                    onPress: () => console.log("Cancel Pressed"), // Function to call when cancel is pressed
                    style: "cancel" // Makes the button look like a cancel option
                },
                {
                    text: "Logout", // Logout button
                    onPress: async () => {
                        await AsyncStorage.removeItem("encryption_key");
                        navigation.reset({
                            index: 0,
                            routes: [
                                { name: 'Splash' },

                            ]
                        });
                    } // Function to call when logout is pressed
                }
            ],
            { cancelable: true } // If true, tapping outside the alert will dismiss it
        );
    };
    // Function to check if encryption_key exists in AsyncStorage
    const checkEncryptionKey = async () => {
        try {
            const encryptionKey = await AsyncStorage.getItem('encryption_key');
            if (encryptionKey) {
                // setStoredPin(encryptionKey);
                setIsSettingPin(false); // Enter PIN screen if key exists
            } else {
                setIsSettingPin(true); // Set PIN screen if no key
            }
        } catch (error) {
            console.error('Error retrieving encryption_key from AsyncStorage', error);
        }
    };

    // Handle PIN submission
    const handlePinSubmit = async (p) => {
        if (isSettingPin) {
            // If we are setting the PIN for the first time
            if (p.length === 6) {
                const key = encryptData(({ "secretKey": route.params.secret, "mnemonic": route.params.memonic }), p)
                await AsyncStorage.setItem('encryption_key', key);
                Alert.alert('PIN Set', 'Your PIN has been set successfully!');
                setPin('');
                setIsSettingPin(false); // Switch to enter PIN mode
            } else {
                setPin("");
               
            }
        } else {
            // If entering the PIN to authenticate
            const savedPin = await AsyncStorage.getItem('encryption_key');
            try {
                const crypto = CryptoJS.AES.decrypt(savedPin, p).toString(CryptoJS.enc.Utf8);
               // console.log(JSON.parse(crypto).secretKey);
                const Key = JSON.parse(crypto).secretKey;
                publickey = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(Key)).publicKey.toBase58();
                navigation.replace("Home");
                //Alert.alert('Success', 'PIN Entered Correctly!');
            }
            catch (e) {
                setPin("");
                setError("Incorrect Pin Try again")
            }

        }
    };

    // Handle Keypad press
    const handleKeyPress = (key) => {
        if (key === 'clear') {
            setPin(''); // Clear the PIN
        }
        else if (key === '') {

        } else {
            if (pin.length < 5) setPin((prev) => prev + key);

            if (pin.length == 5) {
                handlePinSubmit(pin + key); // Submit the PIN
                setPin((prev) => prev + key)

            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colorCode1} barStyle="light-content" />


            <Text style={styles.title}>
                {isSettingPin ? 'Set Your 6-digit PIN' : 'Enter Your PIN to Login'}
            </Text>
            <View>



                <View style={styles.pinContainer}>


                    {Array(6).fill('').map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.pinBox,
                                pin.length > index ? styles.filledBox : styles.emptyBox,
                            ]}
                        >

                        </View>
                    ))}
                </View>
                {error != null &&
                    <Text style={{ fontFamily: "Aptos-Bold", color: "red", margin: 10 }}>{error}</Text>
                }
            </View>


            <Keypad onPress={handleKeyPress} />
            {!isSettingPin &&
            <Pressable onPress={()=>{
                showLogoutAlert()
            }}>
            <Text style={styles.forgot}>
                Forgot Pin ? Reset Pin
            </Text>
            </Pressable>
}
        </View>
    );
};

// Styles for the components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: 'center',
        flexDirection: "column",
        backgroundColor: "white",
    },
    title: {
        fontSize: 20,
        fontFamily: 'Aptos-Bold',
        color: "black",
        margin: 20,
    },
    forgot: {
        fontSize: 15,
        fontFamily: 'Aptos-Bold',
        color: colorCode1,
        marginBottom: 20,
    },
    pinDisplay: {
        marginBottom: 40,
        borderColor: '#000',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    pinText: {
        fontSize: 36,
        letterSpacing: 10,
        color: '#000',
        fontFamily: 'Aptos-Bold',
    },

    keyButton: {
        backgroundColor: "#DCDCDC",
        width: Dimensions.get("window").width / 5,
        height: Dimensions.get("window").width / 5,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1000,
    },

    keyButton2: {

        width: Dimensions.get("window").width / 5,
        height: Dimensions.get("window").width / 5,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1000,
    },

    keyButton3: {

        width: Dimensions.get("window").width / 5,
        height: Dimensions.get("window").width / 5,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1000,
    },
    keyText: {
        fontSize: 20,
        color: "black",
        fontFamily: 'Aptos-Bold',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    pinBox: {
        width: 20,
        height: 20,
        marginRight: 5,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filledBox: {
        backgroundColor: '#000', // filled box color
    },
    emptyBox: {
        backgroundColor: '#fff', // empty box color
    },
    pinText: {
        color: '#fff', // text color
        fontSize: 24,
    },
});

export default PinPage;
