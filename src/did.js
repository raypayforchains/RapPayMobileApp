import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    StatusBar,
    Pressable,
    Keyboard,
    Animated,
    LayoutChangeEvent,
    Image,
    View,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Alert,
    ToastAndroid
} from "react-native";
import { colorCode1 } from './fixed';
import { AppBar } from '@react-native-material/core';
import CryptoJS from 'crypto-js'
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialLayout = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
};



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



const DID = ({ navigation }) => {
    const [pin, setPinn] = useState(true);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [data, setData] = useState('');

    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);

    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);

    const animationValue1 = useRef(new Animated.Value(0)).current;
    const animationValue2 = useRef(new Animated.Value(0)).current;
    const animationValue3 = useRef(new Animated.Value(0)).current;


    useEffect(() => {

        main();
    });

    const main = async () => {
        const m = await AsyncStorage.getItem("personal_data")
     //   console.log(data)
        if (data === "") {
            setData(m);
        }


        if (!m) {
            setPinn(false);
        }
    }
    const PinPage = () => {

        const [pin, setPin] = useState('');
        const [error, setError] = useState(null); // To manage encryption_key


        const handlePinSubmit = async (p) => {
            if (data) {
                setData(false);
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
                    const key = JSON.parse(decryptedWallet).secretKey;
                    const pd = await AsyncStorage.getItem("personal_data");

                    const dat = CryptoJS.AES.decrypt(pd, key.join(",")).toString(CryptoJS.enc.Utf8);

                    if (!dat) {
                        Alert.alert('Error', 'Decryption failed.');
                    }
                  //  console.log(dat)
                    const dt = JSON.parse(dat);
                  //  console.log(dt)
                    setPinn(false)
                    setIsFocused1(true);
                    setIsFocused2(true);
                    setIsFocused3(true);

                    setInput1(dt.name);
                    setInput2(dt.mobile);
                    setInput3(dt.email);




                } catch (error) {
                    setPin("");
                    setError("Incorrect Pin Try again")
                //    console.log(error)
                }
            } else {
                try {
                    const savedPin = await AsyncStorage.getItem('encryption_key');


                    // Decrypt the encrypted wallet using the encryption key
                    const decryptedWallet = CryptoJS.AES.decrypt(savedPin, p).toString(CryptoJS.enc.Utf8);

                    // If decryption failed or no valid mnemonic is found
                    if (!decryptedWallet) {
                        Alert.alert('Error', 'Decryption failed.');
                        //setLoading(false);
                        //return;
                    }

                    // Convert the decrypted wallet's secret key into Uint8Array and create a Keypair
                    const key = JSON.parse(decryptedWallet).secretKey;

                    const dat = encryptData(JSON.stringify({ "name": input1, "mobile": input2, "email": input3 }), key.join(","))
                    await AsyncStorage.setItem("personal_data", dat)
                    setData(dat);
                    setPinn(false)

                } catch (error) {
                    setPin("");
                    setError("Incorrect Pin Try again")
                 //   console.log(error)
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

            <View style={styles.container2}>

                <Text style={styles.title3}>
                    {data ? 'Enter Pin to View your Data' : 'Enter Pin Save your Personal Data Encrypted with Private Key'}
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


    const animation = (value, animationValue) => {
        Animated.timing(animationValue, {
            toValue: value,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const handleFocus = (setFocus, animationValue) => {
        setFocus(true);
        animation(1, animationValue);
    };

    const handleBlur = (setFocus, animationValue, textValue) => {
        if (!textValue) {
            setFocus(false);
            animation(0, animationValue);
        }
    };


    const encryptData = (data, encryptionKey) =>
        CryptoJS.AES.encrypt(data, encryptionKey).toString();



    return (

        pin ?

            <PinPage /> :
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar barStyle="light-content" />

                <AppBar
                    color={colorCode1}
                    leading={() => (
                        <Pressable onPress={() => navigation.navigate("Home")}>
                            <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30, tintColor: "white" }} />
                        </Pressable>
                    )}
                    title={() => <Text style={{ fontFamily: "Aptos-Bold", color: "white", fontSize: 18 }}>Account</Text>}
                />
                <Pressable onPress={Keyboard.dismiss} style={styles.container}>
                    <Text style={{ fontFamily: "Aptos-Bold", color: "black", textAlign: "justify" }}>
                        While we are on devnet, we aren't verifying data.
                    </Text>


                    <TextInput

                        style={[
                            styles.input,

                        ]}
                        keyboardType='default'
                        value={input1}
                        onChangeText={setInput1}
                        defaultValue='Name'
                        autoCorrect={false}
                        autoCapitalize='none'
                    />

                    <TextInput

                        style={[
                            styles.input,

                        ]}
                        keyboardType='default'
                        value={input2}
                        onChangeText={setInput2}
                        defaultValue='Email'
                        autoCorrect={false}
                        autoCapitalize='none'
                    />

                    <TextInput

                        style={[
                            styles.input,

                        ]}
                        keyboardType='default'
                        value={input3}
                        onChangeText={setInput3}
                        defaultValue='Mobile'
                        autoCorrect={false}
                        autoCapitalize='none'
                    />


                    <Pressable style={{ backgroundColor: colorCode1, padding: 8, borderRadius: 50, alignItems: "center" }} onPress={() => {
                        if (input1 != "" && input2 != "" && input3 != "") {

                            setPinn(true);

                        } else {
                            ToastAndroid.show("Data is incomplete", ToastAndroid.BOTTOM)
                        }

                    }}>
                        <Text style={{ fontFamily: "Aptos-Bold", color: "white", fontSize: 18 }}>{"Save Data"}</Text>


                    </Pressable>
                </Pressable>
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        gap: 20
    },
    container2: {
        flexDirection: "column",
        flex: 1,
        padding: 20,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input_block: {
        position: 'relative',
    },
    input: {
        borderColor: 'gray',
        fontFamily: "Aptos-Bold",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        fontSize: 15,
        color: 'black',
        backgroundColor: 'white'
    },
    label: {
        position: 'absolute',
        top: 0,
        left: 10,
        fontFamily: "Aptos-Bold",
        zIndex: 9
    },
    title3: {
        fontSize: 20,
        fontFamily: 'Aptos-Bold',
        textAlign: "center",
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

export default DID;
