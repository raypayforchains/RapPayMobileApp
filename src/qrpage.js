import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable, Image, ImageBackground, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { colorCode1 } from './fixed';
import { publickey } from './pin';

const QRPage = ({navigation}) => {
    const [publicKey, setPublicKey] = useState(null);
    const viewShotRef = useRef();

    useEffect(() => {
        const fetchPublicKey = async () => {
            try {
                const key = publickey;
                if (key) {
                    setPublicKey(key);
                } else {
                    Alert.alert('Error', 'Public key not found');
                }
            } catch (error) {
                console.error('Error fetching public key:', error);
            }
        };

        fetchPublicKey();
    }, []);

    const copyToClipboard = () => {
        Clipboard.setString(publicKey);
        ToastAndroid.show('Copied Public', ToastAndroid.SHORT);
    };

    const shareQR = () => {
        viewShotRef.current.capture().then((uri) => {
            const shareOptions = {
                title: 'Pay me Solana Here',
                message: `Pay me Solana here:\n\n${publicKey}`,
                url: uri,
            };

            Share.open(shareOptions)
                .then((res) => console.log('Share success:', res))
                .catch((err) => console.error('Error sharing QR code:', err));
        });
    };

    return (
        <View style={styles.container}>
            {publicKey ? (
                <>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Pressable onPress={() => {
                            navigation.navigate("Home")
                        }}>


                            <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30, backgroundColor: "white" }} />
                        </Pressable>

                       
                    </View>
                    <View style={{ alignItems: "center", backgroundColor: "#ecf2fe", margin: 20, borderRadius: 20, padding: 10 }}>
                        <Text style={styles.title}>Pay me Solana Here</Text>
                        <ViewShot ref={viewShotRef} style={styles.qrContainer}>
                            <QRCode
                                value={publicKey}
                                size={200}
                                color="black"
                                backgroundColor="white"
                            />
                        </ViewShot>

                        <Text style={{ fontFamily: "Aptos-Regular", color: "black" }}>Scan to pay with any Solana Wallet App</Text>
                        <TouchableOpacity onPress={copyToClipboard} style={{flexDirection:"row",justifyContent:"space-between",width:"70%",alignItems:"center"}}>
                            <Text style={styles.text2}>{publicKey}</Text>
                            <Image source={require("../assets/icons/copy.png")} style={{width:30,height:30}}/>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity onPress={shareQR} style={styles.button}>
                        <Image source={require("../assets/icons/share.png")}/>
                        <Text style={styles.buttonText}>Share QR Code</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <></>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "black",
        margin: 20,
        textAlign: 'center',
    },
    publicKey: {
        fontSize: 14,
        marginVertical: 20,
        textAlign: 'center',
    },
    button: {
        flexDirection:"row",
        position: "absolute",
        alignItems: "center",
        bottom: 5,
        alignSelf: "center",
        backgroundColor: colorCode1,
        padding: 10,
        borderRadius: 40,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        margin: 5,
        fontFamily: "Aptos-Bold",
        fontSize: 13,
        textAlign: 'center',
    },
    text2: {
        color: 'black',
        margin: 5,
        fontFamily: "Aptos-Bold",
        fontSize: 13,
        width:"70%",
        textAlign: 'center',
    },
    qrContainer: {
        padding:15,
        backgroundColor:"white",
        borderRadius:20,
        marginBottom: 20,
    },
});

export default QRPage;
