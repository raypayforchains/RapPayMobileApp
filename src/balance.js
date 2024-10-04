import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { Connection, PublicKey } from '@solana/web3.js';
import { colorCode1, SOLANA_DEVNET_URL } from './fixed';
import { ActivityIndicator } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { publickey } from './pin';


const Balance = ({ navigation }) => {
    const [balance, setBalance] = useState(null);
    const [key, setKey] = useState(null);


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


    useEffect(() => {
        const getSolanaBalance = async () => {
            try {
                const connection = new Connection(SOLANA_DEVNET_URL);
               // console.log(k)
                const k = publickey;
                setKey(k)
                const publicKey = new PublicKey(k); // Replace with the actual wallet address

                const lamports = await connection.getBalance(publicKey);
                const sol = lamports / 1e9; // Convert lamports to SOL (1 SOL = 10^9 lamports)

                setBalance(sol);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        getSolanaBalance();
    }, []);

    return (
        balance == null ?

            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <ActivityIndicator color={colorCode1} size={"large"} />
            </View> :

            <View style={{ backgroundColor: "white", flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
                    <Pressable onPress={() => {
                        navigation.navigate("Home")
                    }}>


                        <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30, backgroundColor: "white" }} />
                    </Pressable>


                </View>

                <View style={{ backgroundColor: "white", flex: 1, margin: 20 }}>

                    <Text style={{ fontFamily: "Aptos-Regular", color: "black", fontSize: 25 }}>Solana Balance</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={require("../assets/icons/solana.webp")} style={{ width: 40, height: 40, marginRight: 5 }} />
                        <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 40 }} >{balance}</Text>
                    </View>

                    <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 18, marginTop: 15 }}>Solana Wallet</Text>

                    <Text style={{ fontFamily: "Aptos-Regular", color: "black", fontSize: 15, marginTop: 2 }}>{key}</Text>

                </View>

                <Pressable style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 20 }}
                    onPress={() => {
                        showLogoutAlert();
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={require("../assets/last/logout.png")} style={{ width: 30, height: 30, marginRight: 10, tintColor: "black" }} />
                        <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                            Logout
                        </Text>
                    </View>
                    <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [
                                { name: 'Splash' },

                            ]
                        });
                    }}>
                        <Image source={require("../assets/last/lock.png")} style={{ width: 30, height: 30, marginRight: 10, tintColor: "black" }} />
                        <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                            Lock App Now
                        </Text>
                    </Pressable>




                </Pressable>

            </View>
    );
};

export default Balance;
