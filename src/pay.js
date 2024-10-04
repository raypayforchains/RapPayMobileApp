import { View, Text, TextInput, StyleSheet, Alert, Image, StatusBar, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Web3 from '@solana/web3.js';
import * as solanaWeb3 from '@solana/web3.js'; // Solana web3 for transactions
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { colorCode1 } from './fixed';
import CryptoJS from 'crypto-js'
import { publickey } from './pin';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';


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



const SolanaPaymentPage = ({ navigation, route }) => {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState(route.params.pay ? route.params.pay : "");
    const [pay, setPay] = useState(false);
    const [transactionFee, setTransactionFee] = useState(null);

    useEffect(() => {
        if (route.params.pay) {
            estimateTransactionFee(route.params.pay);
        }
    }, [])

    const PinPage = () => {

        const [pin, setPin] = useState('');
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [signature, setSignature] = useState("");
        const [error, setError] = useState(null); // To manage encryption_key
        const viewShotRef = useRef();

        const sharePayment = () => {
            viewShotRef.current.capture().then((uri) => {
                const shareOptions = {
                    url: uri,
                };

                Share.open(shareOptions)
                    .then((res) => console.log('Share success:', res))
                    .catch((err) => console.error('Error sharing QR code:', err));
            });
        };

        const handlePinSubmit = async (p) => {


            setLoading(true)
            try {
                const savedPin = await AsyncStorage.getItem('encryption_key');


                // Decrypt the encrypted wallet using the encryption key
                const decryptedWallet = CryptoJS.AES.decrypt(savedPin, p).toString(CryptoJS.enc.Utf8);

                // If decryption failed or no valid mnemonic is found
                if (!decryptedWallet) {
                    Alert.alert('Error', 'Decryption failed.');
                    setLoading(false);
                    return;
                }

                // Convert the decrypted wallet's secret key into Uint8Array and create a Keypair
                const key = Uint8Array.from(JSON.parse(decryptedWallet).secretKey);
                const wallet = solanaWeb3.Keypair.fromSecretKey(key);

                //console.log("Derived Key: ", wallet.publicKey.toBase58());

                // Connect to the Solana Devnet
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

                // Replace with the recipient's public key (passed from params)
                const recipientPublicKey = new solanaWeb3.PublicKey(route.params.key);

                // Specify the amount of SOL to send (in lamports, 1 SOL = 1,000,000,000 lamports)
                const amountInLamports = amount * 1000000000; // 0.001 SOL

                // Create a transaction instruction to transfer SOL
                const transaction = new solanaWeb3.Transaction().add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey: wallet.publicKey,  // Use PublicKey object directly
                        toPubkey: recipientPublicKey,  // Use PublicKey object directly
                        lamports: amountInLamports,
                    })
                );

                // Sign and send the transaction using the wallet's private key
                const sign = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [wallet]);

                setSignature(sign)

                if (route.params.pay) {
                    navigation.pop()
                } else {
                    setSuccess(true);
                }
                setSuccess(true);

            } catch (error) {
                setPin("");
                setError("Incorrect Pin or Invalid Balance")
                //   console.log(error)
            }

            setLoading(false)


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


            loading ?
                <View style={{ flex: 1, justifyContent: "center", backgroundColor: "white", alignItems: "center" }}>
                    <ActivityIndicator color={colorCode1} size={"large"} />
                </View> :
                success ?

                    <View style={{ alignItems: "center", flexDirection: "column", justifyContent: "center", flex: 1, backgroundColor: "white" }}>
                        <ViewShot ref={viewShotRef} style={{ alignItems: "center", flexDirection: "column", justifyContent: "center", flex: 8, backgroundColor: "white", width: "100%" }}>

                            <View style={{ flex: 4, justifyContent: "flex-end" }}>
                                <Image source={require("../assets/icons/tick.png")} style={{ width: 130, height: 130 }} />
                            </View>
                            <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image source={require("../assets/icons/solana.webp")} style={{ width: 50, height: 50, marginRight: 5 }} />
                                    <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 50 }}>{amount}</Text>
                                </View>
                                <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 18, marginBottom: 5 }}>Paid to ...{String(route.params.key).substring(route.params.key.length - 5, route.params.key.length - 1)}</Text>
                                <Text style={{ fontFamily: "Aptos-Regular", color: "black", fontSize: 15 }}>Wallet Address ...{String(route.params.key).substring(route.params.key.length - 5, route.params.key.length - 1)}</Text>
                            </View>
                            <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>

                                <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                                    {new Date().toLocaleDateString('en-US', {
                                        year: 'numeric',   // Year in numeric format
                                        month: 'long',     // Full month name (e.g., September)
                                        day: 'numeric'     // Day of the month
                                    })}
                                    {" at "}
                                    {new Date().toLocaleTimeString('en-US', {
                                        hour: '2-digit',   // Hour in 2-digit format
                                        minute: '2-digit', // Minute in 2-digit format
                                    })}
                                </Text>
                                <View style={{ width: "50%", }}>
                                    <Text style={{ fontFamily: "Aptos-Bold", color: "gray", textAlign: "center" }}>
                                        Signature {signature}
                                    </Text>
                                </View>


                            </View>

                        </ViewShot>

                        <View style={{ flex: 2, justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                            <Pressable style={{ backgroundColor: "white", padding: 10, borderRadius: 50, alignItems: "center", marginRight: 10, borderWidth: 1, borderColor: "black", flexDirection: "row" }} onPress={async () => {
                                sharePayment();
                            }}>
                                <Image source={require("../assets/icons/share.png")} style={{ width: 20, height: 20, tintColor: colorCode1, marginRight: 5 }} />
                                <Text style={{ fontFamily: "Aptos-Bold", color: colorCode1 }}>Share Screenshot</Text>

                            </Pressable>

                            <Pressable style={{ backgroundColor: colorCode1, padding: 10, borderRadius: 50, alignItems: "center" }} onPress={() => {

                                navigation.navigate("Home")

                            }}>
                                <Text style={{ fontFamily: "Aptos-Bold", color: "white" }}>Done</Text>
                            </Pressable>

                        </View>

                    </View> :



                    <View style={styles.container2}>

                        <Text style={styles.title3}>
                            {'Enter Pin to confirm Tranaction'}
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


                    </View>
        );
    };






    // Function to estimate transaction fee
    const estimateTransactionFee = async (val) => {
        try {
            const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'), 'confirmed');

            // Create a dummy transaction to estimate fee

            const toWallet = new Web3.PublicKey(route.params.key);

            const fromWalet = new Web3.PublicKey(publickey);


            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

            const transaction = new Web3.Transaction().add(
                Web3.SystemProgram.transfer({
                    fromPubkey: fromWalet,
                    toPubkey: toWallet,
                    lamports: Web3.LAMPORTS_PER_SOL * parseFloat(val),
                })
            );

            // Get the fee for the transaction

            transaction.recentBlockhash = blockhash;
            transaction.feePayer = toWallet;


            // Step 3: Get the estimated fee for the transaction message
            const fee = await connection.getFeeForMessage(transaction.compileMessage());
            //    console.log(fee)

            setTransactionFee(fee.value / Web3.LAMPORTS_PER_SOL); // Convert lamports to SOL
        } catch (error) {
            //  console.log(error);
            setTransactionFee(null); // Convert lamports to SOL
            //  Alert.alert('Error', 'Failed to estimate transaction fee');
        }
    };

    // Function to send the SOL (similar to the code in previous message)
    const sendSolTransaction = async () => {
        // Implement the actual sending of SOL transaction here
        Alert.alert('Sending SOL...', `Amount: ${amount} SOL to ${recipientAddress}`);
    };

    return (
        pay ?
            <PinPage /> :

            <View style={styles.container}>
                <StatusBar backgroundColor={"white"} barStyle="dark-content" />

                <Pressable style={{ alignSelf: "flex-start", position: "absolute", top: 20, left: 20 }} onPress={() => {
                    navigation.navigate("Home")
                }}>
                    <Image source={require("../assets/icons/cross.png")} style={{ width: 30, height: 30, tintColor: "black" }} />
                </Pressable>
                <Text style={styles.title}>Pay with Solana</Text>
                <Text style={styles.title2} numberOfLines={1}>To {route.params.key}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center" }}>
                    <Image source={require("../assets/icons/solana.webp")} style={{ width: 40, height: 40 }} />
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        cursorColor={"black"}
                        readOnly={amount == "" ? false : true}
                        keyboardType="numeric"
                        value={amount}
                        placeholderTextColor={"black"}
                        onChangeText={(val) => {
                            estimateTransactionFee(val)
                            setAmount(val)
                        }}
                    />
                </View>
                {transactionFee != null &&

                    <Text style={{ color: "black", fontFamily: "Aptos-Bold", fontSize: 13 }} numberOfLines={2}>+ {transactionFee} Tranaction Fees</Text>
                }
                {transactionFee != null &&
                    <Pressable style={{ backgroundColor: colorCode1, alignSelf: "flex-end", padding: 10, borderRadius: 10, position: "absolute", bottom: 20, right: 20 }} onPress={() => {
                        if (amount > 0) {
                            setPay(true);
                        }
                    }}>
                        <Image source={require("../assets/icons/arrow2.png")} style={{ width: 30, height: 30 }} />
                    </Pressable>

                }
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    container2: {
        flexDirection: "column",
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
        fontFamily: 'Aptos-Bold',
        marginBottom: 7,
        color: "black",
        textAlign: 'center',
    },
    title2: {
        fontSize: 15,
        width: "50%",
        fontFamily: 'Aptos-Bold',
        alignSelf: "center",
        marginBottom: 2,
        color: "black",
        textAlign: 'center',
    },
    input: {
        alignSelf: "center",
        fontFamily: "Aptos-Bold",
        color: "black",
        fontSize: 60,
    },
    feeText: {
        marginTop: 20,
        fontSize: 16,
        color: 'green',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
    },
    title3: {
        fontSize: 20,
        fontFamily: 'Aptos-Bold',
        color: "black",
        margin: 20,
    },
    forgot: {
        fontSize: 15,
        fontFamily: 'Aptos-Bold',
        color: colorCode1,
        marginBottom: 10,
    },
    pinDisplay: {
        marginBottom: 40,
        borderBottomWidth: 2,
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
    keyText: {
        fontSize: 20,
        color: "black",
        fontFamily: 'Aptos-Bold',
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

export default SolanaPaymentPage;
