import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image, Alert, Pressable } from 'react-native';
import { Keypair, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as bip39 from 'bip39';
import * as CryptoJS from 'crypto-js';
import 'react-native-get-random-values';
import { colorCode, colorCode1 } from './fixed';
import Clipboard from '@react-native-clipboard/clipboard';
import { ActivityIndicator } from '@react-native-material/core';


// Function to verify and use the entered mnemonic



// Main Component
const SolanaWallet = ({ navigation }) => {
    const [mnemonic, setMnemonic] = useState(null);
    const [secret, setSecretKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputMnemonic, setInputMnemonic] = useState('');


    const verifyMnemonic = async (inputMnemonic) => {
        setLoading(true);
        if (bip39.validateMnemonic(inputMnemonic)) {
            const seed = bip39.mnemonicToSeedSync(inputMnemonic);
            const keypair = Keypair.fromSeed(seed.slice(0, 32));
    
            setSecretKey(Array.from(keypair.secretKey));
            setMnemonic(seed)
    
            navigation.navigate("Pincode",{"secret":Array.from(keypair.secretKey),"mnemonic":seed});
        } else {
            Alert.alert('Invalid Mnemonic', 'The mnemonic phrase you entered is not valid.');
        }
        setLoading(false);
    };

    const handleCreateWallet = async () => {
        setLoading(true);
        const keypair = Keypair.generate();
        const secretKey = Array.from(keypair.secretKey);
        setSecretKey(secretKey);
        const mnemonic = bip39.entropyToMnemonic(Buffer.from(keypair.publicKey.toBytes()).toString('hex'));
        setMnemonic(mnemonic);
        setLoading(false);
    };

    const handleVerifyMnemonic = async () => {
        await verifyMnemonic(inputMnemonic);
        //navigation.replace("Home");
    };

    
    return (
        loading ?
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <ActivityIndicator color={colorCode1} size={"large"} />
        </View>:
        <View style={styles.container}>
            <StatusBar backgroundColor={colorCode1} />
            <Image source={require("../assets/titleicon.png")} style={styles.logo} resizeMode={"contain"} />
            {mnemonic == null ?
                <View>


                    <Text style={styles.title}>Welcome to RayPay</Text>
                    <Text style={styles.subtitle}>Enter your Secret Key</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={"gray"}
                        placeholder="Enter your mnemonic phrase (12 or 24)"
                        onChangeText={(text) => setInputMnemonic(text)}
                        value={inputMnemonic}
                    />
                    {inputMnemonic.length === 0 && (
                        <View>
                            <Text style={styles.orText}>OR</Text>
                            <TouchableOpacity onPress={handleCreateWallet} style={styles.button}>
                                <Text style={styles.buttonText}>Generate a new Wallet</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {(inputMnemonic.split(" ").length === 24 || inputMnemonic.split(" ").length === 12) && (
                        <TouchableOpacity onPress={handleVerifyMnemonic} style={styles.button}>
                            <Text style={styles.buttonText}>Set 6 digit Pincode</Text>
                        </TouchableOpacity>
                    )}
                    {inputMnemonic.length > 0 && (inputMnemonic.split(" ").length !== 24 && inputMnemonic.split(" ").length !== 12) && (
                        <TouchableOpacity style={[styles.button, { backgroundColor: "gray" }]}>
                            <Text style={styles.buttonText}>Set 6 digit Pincode</Text>
                        </TouchableOpacity>
                    )}

                </View> :
                <View>
                    <Text style={styles.subtitle}>{mnemonic}</Text>
                    <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={()=>{
                         Clipboard.setString(mnemonic);
                    }}>
                        <Image source={require("../assets/icons/copy.png")} style={{ width: 30, height: 30 }} />
                        <Text style={{
                            fontFamily: "Aptos-Bold",
                            color: "black",
                            marginLeft: 10,
                            fontSize: 18,
                        }}>Copy</Text>
                    </Pressable>
                    <TouchableOpacity onPress={()=>navigation.navigate("Pincode",{secret,mnemonic})} style={[styles.button,{marginTop:30}]}>
                        <Text style={styles.buttonText}>Set 6 digit Pincode</Text>
                    </TouchableOpacity>
                </View>





            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
    },
    logo: {
        width: 100,
        height: 50,
        marginBottom: 20,
        marginTop: 50,
    },
    title: {
        fontFamily: "Aptos-Bold",
        color: "black",
        fontSize: 25,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: "Aptos-Regular",
        color: "black",
        fontSize: 18,
        marginBottom: 20,
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
    orText: {
        fontFamily: "Aptos-Regular",
        color: "black",
        fontSize: 18,
        marginBottom: 20,
        alignSelf: "center",
    },
    button: {
        backgroundColor: colorCode1,
        borderRadius: 20,
        alignItems: "center",
        padding: 10,
        justifyContent: "center",
        width: "100%",
        alignSelf: "center",
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "Aptos-Bold",
        color: "white",
    },
});

export default SolanaWallet;
