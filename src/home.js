import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, FlatList, Image, Dimensions, TextInput, Pressable, TouchableOpacity, Linking } from 'react-native';
import { colorCode1, fetchApps, mainurl } from './fixed';;
import Swiper from 'react-native-swiper';
import { ActivityIndicator } from '@react-native-material/core';


const Home = ({ navigation }) => {
    const [webapp, setWebApp] = useState(null);
    const [slides, setSlides] = useState([]);
    const [loading, setloading] = useState(true);
    const [wind, setWidth] = useState(window.innerWidth);
    const [isLaptop, setIsLaptop] = useState(wind > 768);



    const [data, setData] = useState([
        {
            "name": "Scan any QR code",
            "image": require("../assets/icons/qr.png"),
            "on": "QRApp"
        },
        {
            "name": "Pay Public Key",
            "image": require("../assets/icons/key.png"),
            "on": "PayKey"
        },
        {
            "name": "Manage NFTs",
            "image": require("../assets/icons/nft.png"),
            "on": "NFTs"
        },
        {
            "name": "Buy Solana Now",
            "image": require("../assets/icons/buy.png"),
            "on": "Buy Solana"

        },
        {
            "name": "Sell Solana Now",
            "image": require("../assets/icons/sell.png"),
            "on": "Sell Solana"

        }
        ,
        {
            "name": "Pay Loans and bills",
            "image": require("../assets/icons/bill.png"),
            "on": "Bills and Loans"
        }
        ,
        {
            "name": "Get interest on crypto",
            "image": require("../assets/icons/invest.png"),
            "on": "Invest Solana"
        }
        ,
        {
            "name": "Get Instant Loan",
            "image": require("../assets/icons/quick.png"),
            "on": "Loans"
        }
        ,


    ]);




    useEffect(() => {

     


        const fetchSlides = async () => {
            setloading(true)

            const response = await fetch(mainurl + 'raypayapp/banner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            //   console.log(data.banner);
            setSlides(data.banner);
            setWebApp(data.apps);

            setloading(false)
        };
        fetchSlides();
        
    }, []);



    return (
        loading ?

            <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                <ActivityIndicator color={colorCode1} size={"large"} />
            </View> :
            <View style={styles.container}>
                <View style={{ paddingHorizontal: (Dimensions.get("window").width / 22), paddingVertical: 10, backgroundColor: "white", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ borderWidth: 1, borderRadius: 50, borderColor: "gray", flexDirection: "row", paddingHorizontal: 8, alignItems: "center", backgroundColor: "white", width: (Dimensions.get("window").width / 11) * 8.5 }}>
                        <Image source={require("../assets/icons/search.png")} style={{ width: 30, height: 30 }} />
                        <TextInput style={{ padding: 10, alignItems: "center", fontFamily: "Aptos-Bold", width: "100%" }} placeholder='Search for apps' placeholderTextColor={"gray"} />
                    </View>
                    <Pressable onPress={() => navigation.navigate("Notification")}>
                        <Image source={require("../assets/icons/noti.png")} style={{ width: Dimensions.get("window").width / 11, height: Dimensions.get("window").width / 11 }} />
                    </Pressable>
                </View>

                <ScrollView style={styles.container}>
                    <StatusBar backgroundColor={colorCode1} barStyle="light-content" />
                    <View style={{ height: Dimensions.get("window").width / 2.5, marginBottom: 10 }}>

                        <Swiper
                            autoplay={true} // Enable auto-play
                            autoplayTimeout={3} // Auto-play interval in seconds
                            loop={true} // Loop through the banners
                            showsPagination={true} // Show pagination dots
                            activeDotColor={colorCode1} // Active dot color
                        >
                            {slides.map((item) => (
                                <View key={item.id} style={styles.slide}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.image_url }}
                                        resizeMode="conatin"
                                    />


                                </View>
                            ))}
                        </Swiper>

                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10, }}>
                        <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 20, marginStart: 20, }}>Services</Text>
                    </View>

                    <FlatList

                        data={data}
                        numColumns={4}
                        keyExtractor={(item, index) => index.toString()} // Add keyExtractor to uniquely identify items
                        renderItem={({ index, item }) => (

                            <>
                                <Pressable style={styles.itemContainer} onPress={() => {
                                    if (index == 0 || index == 1) {
                                        navigation.navigate(item.on)
                                    } else {
                                        navigation.navigate("ListApps", { "type": item.on })
                                    }
                                }}>



                                    <Image source={item.image} style={{ width: 35, height: 35, marginBottom: 5 }} />
                                    <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 12, textAlign: "center" }} >{item.name}</Text>



                                </Pressable>
                            </>// Destructure `item` from the object
                        )}
                    />



                    {webapp != null &&
                        <View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10, }}>
                                <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 20, marginStart: 20, }}>Apps & Games</Text>
                                <Pressable onPress={() => navigation.navigate("ListApps")}>
                                    <Text style={{ fontFamily: "Aptos-Bold", color: colorCode1, fontSize: 12, marginEnd: 20 }}>See All</Text>
                                </Pressable>

                            </View>


                            <FlatList
                                data={webapp}
                                numColumns={4}

                                keyExtractor={(item, index) => index.toString()} // Add keyExtractor to uniquely identify items
                                renderItem={({ item }) => (
                                    <Pressable style={styles.itemContainer} onPress={() => {
                                        navigation.navigate("Webapps", { "url": item.weburl })
                                    }}>
                                        <Image source={{ uri: item.image }} style={{ width: 35, height: 35, borderRadius: 5, marginBottom: 5 }} />
                                        <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 12, textAlign: "center" }}>{item.name}</Text>
                                    </Pressable>

                                )}
                            />
                        </View>
                    }



                    <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 20, marginVertical: 20, marginStart: 20 }}>Manage</Text>


                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "4%", justifyContent: "space-between", marginBottom: 30 }} onPress={() => {
                        navigation.navigate("Merchant")
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../assets/icons/merchant.png")} style={{ width: 30, height: 30, marginRight: 10 }} />
                            <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                                Convert to merchant account
                            </Text>
                        </View>

                        <Image source={require("../assets/icons/arrow.png")} style={{ width: 20, height: 20 }} />
                    </Pressable>

                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "4%", justifyContent: "space-between", marginBottom: 30 }} onPress={() => {
                        navigation.navigate("ListApps", { "type": "Escrow" })
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../assets/icons/agreement.png")} style={{ width: 30, height: 30, marginRight: 10 }} />
                            <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                                Escrow
                            </Text>
                        </View>

                        <Image source={require("../assets/icons/arrow.png")} style={{ width: 20, height: 20 }} />
                    </Pressable>


                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "4%", justifyContent: "space-between", marginBottom: 30 }} onPress={() => {
                        navigation.navigate("DID")
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../assets/icons/ids.png")} style={{ width: 30, height: 30, marginRight: 10 }} />
                            <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                                Account
                            </Text>
                        </View>

                        <Image source={require("../assets/icons/arrow.png")} style={{ width: 20, height: 20 }} />
                    </Pressable>


                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "4%", justifyContent: "space-between", marginBottom: 30 }} onPress={() => navigation.navigate("QRPage")}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../assets/icons/qr.png")} style={{ width: 30, height: 30, marginRight: 10 }} />
                            <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                                Display QR code
                            </Text>
                        </View>

                        <Image source={require("../assets/icons/arrow.png")} style={{ width: 20, height: 20 }} />
                    </Pressable>


                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "4%", justifyContent: "space-between", marginBottom: 30 }}
                        onPress={() => {
                            navigation.navigate("Balance")
                        }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../assets/icons/wallet.png")} style={{ width: 30, height: 30, marginRight: 10 }} />
                            <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                                Check your wallet
                            </Text>
                        </View>

                        <Image source={require("../assets/icons/arrow.png")} style={{ width: 20, height: 20 }} />
                    </Pressable>




                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: "4%", justifyContent: "space-between", marginBottom: 30 }}
                        onPress={() => {
                            navigation.navigate("Transaction")
                        }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../assets/icons/history.png")} style={{ width: 30, height: 30, marginRight: 10 }} />
                            <Text style={{ fontFamily: "Aptos-Bold", color: "black" }}>
                                See transactions history
                            </Text>
                        </View>

                        <Image source={require("../assets/icons/arrow.png")} style={{ width: 20, height: 20 }} />
                    </Pressable>



                </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: "white"
    },
    itemContainer: { // Add a style for item container
        alignItems: 'center',
        marginBottom: 10,
        width: "20%",
        marginLeft: "4%",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    window: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 16,
        fontFamily: "Aptos-Bold",
        color: "white"
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width / 2.5
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#007AFF', // Link color
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

export default Home;
