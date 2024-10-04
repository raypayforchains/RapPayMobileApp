import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar,  Image, Dimensions } from 'react-native';
import { colorCode1 } from './fixed';


const Splash = ({ navigation }) => {


    useEffect(() => {
      
            const checkEncryptionKey = async () => {
                try {
                    const m = await AsyncStorage.getItem("encryption_key");
                    if (m != undefined) {
                        navigation.replace("Pincode");
                    } else {
                        navigation.replace("Login");
                    }
                 //   console.log("Hello");
                } catch (error) {
                    console.error("Error retrieving encryption key:", error);
                }
            };
            checkEncryptionKey();
      
    }, []);
    



    return (

        <View style={styles.container}>
            <StatusBar backgroundColor={colorCode1}  barStyle="light-content" />
            <Image source={require("../assets/titleicon.png")} style={styles.logo} resizeMode={"contain"} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    logo: {
        width: Dimensions.get("window").width / 2,
        height: Dimensions.get("window").width / 4,

        marginBottom: 20,
        marginTop: 50,
    },

});

export default Splash;
