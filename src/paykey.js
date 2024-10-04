import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity, StatusBar, FlatList, Image, Pressable } from 'react-native';
import { Keypair, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as bip39 from 'bip39';
import * as CryptoJS from 'crypto-js';
import { AppBar } from "@react-native-material/core";
import 'react-native-get-random-values';
import { colorCode, colorCode1 } from './fixed';
import * as Web3 from '@solana/web3.js';


// Function to generate a random encryption key
const generateEncryptionKey = () => {
    return CryptoJS.lib.WordArray.random(16).toString(); // Generates a 128-bit key
};

const encryptData = (data, encryptionKey) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();

const decryptData = (cipherText, encryptionKey) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};



// Function to fetch the wallet from secure storage
const fetchWallet = async () => {
    try {
        const storedWallet = await AsyncStorage.getItem('solana_wallet');
        const encryptionKey = await AsyncStorage.getItem('encryption_key');
        if (storedWallet && encryptionKey) {
            const decryptedWallet = decryptData(storedWallet, encryptionKey);
            return decryptedWallet;
        }
        return null;
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return null;
    }
};


// Main Component
const PayKey = ({ navigation }) => {
    const [mnemonic, setMnemonic] = useState(null);
    const [inputMnemonic, setInputMnemonic] = useState('');
    const [publickey, setPublic] = useState('');
    const [option, setOption] = useState('');

    useEffect(() => {
        const loadWallet = async () => {
            const existingWallet = await fetchWallet();
            if (existingWallet) {
                setMnemonic(existingWallet.mnemonic);
            }
        };

        loadWallet();
    }, []);


    return (
        <>
            <AppBar
                style={{ backgroundColor: "white", elevation: 0 }}
                leading={() => (
                    <Pressable onPress={() => {
                        navigation.navigate("Home")
                    }}>


                        <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30, backgroundColor: "white" }} />
                    </Pressable>
                )} />

            <View style={styles.container}>
                <StatusBar backgroundColor={colorCode1} barStyle="light-content" />



                <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 25, marginBottom: 12, marginTop: 10 }}>Enter your Secret Key</Text>

                <Text style={{ fontFamily: "Aptos-Regular", color: "black", fontSize: 18, marginBottom: 20 }}>Pay any solana public key</Text>

                <TextInput
                    style={styles.input}
                    placeholderTextColor={"gray"}
                    placeholder="Enter public key"
                    onChangeText={async (text) => {
                        setInputMnemonic(text)
                        try {
                            new Web3.PublicKey(text);
                            setPublic(text);
                        } catch (err) {
                            setPublic("");
                         //   console.log(err)
                        }
                    }}
                    value={inputMnemonic}
                />


                {publickey != "" &&
                    <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
                        navigation.navigate("Payment", { "key": publickey })
                    }}>
                        <View style={{ backgroundColor: "#FFA500", padding: 10, borderRadius: 20, marginRight: 10, }}>
                            <Image source={require("../assets/icons/wallet.png")} style={{ width: 40, height: 40, tintColor: "white" }} />
                        </View>

                        <View style={{ width: "80%", }}>
                            <Text style={{ color: "black", fontFamily: "Aptos-Bold" }}>Public Key {publickey}</Text>
                            <Text style={{ color: colorCode1, fontFamily: "Aptos-Bold", alignSelf: "flex-start" }} >Pay Now</Text>
                        </View>

                    </Pressable>

                }

            </View>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white"

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        fontFamily: "Aptos-Bold",
        color: "white"
    },
    input: {
        borderColor: colorCode1,
        borderRadius: 5,
        borderWidth: 1.5,
        fontFamily: "Aptos-Bold",
        color: "black",
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
});

export default PayKey;
