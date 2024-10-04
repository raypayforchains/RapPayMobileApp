import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, FlatList, Image, Dimensions, TextInput, Pressable, TouchableOpacity, Linking } from 'react-native';
import { colorCode, colorCode1, fetchApps, mainurl } from './fixed';;
import Swiper from 'react-native-swiper';
import { ActivityIndicator, AppBar } from '@react-native-material/core';


const ListApp = ({ navigation,route }) => {
    const [webapp, setWebApp] = useState(null);
    const [loading, setloading] = useState(true);
    const [selection, setSelection] = useState(!route.params ? "All":route.params.type )
    const options = [
        "All",
        "Apps",
        "Games",
        "Services",
        "Buy Solana",
        "Sell Solana",
        "Invest Solana",
        "Loans",
        "NFTs",
        "Escrow",
        "Bills & Loans",
    ];


    const fetchApps = async (type) => {
      //  console.log(type)
        setloading(true)

        const response = await fetch(mainurl + 'raypayapp/getwebapps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "where": type === "All" ? "WHERE id IS NOT NULL ORDER BY order_id DESC" : `WHERE type = '${type}' ORDER BY order_id DESC`,

            })
        });
        const data = await response.json();

        setWebApp(data);
        setloading(false)
    };

    useEffect(() => {

        fetchApps(selection);

    }, []);



    return (
        loading ?

            <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                <ActivityIndicator color={colorCode1} size={"large"} />
            </View> :
            <View style={styles.container}>


                <ScrollView style={styles.container}>
                    <StatusBar backgroundColor={colorCode1} barStyle="light-content" />







                    {webapp != null &&
                        <View>
                            <AppBar
                                elevation={0}
                                color={"white"}
                                title={() => (
                                    <Text style={{ fontFamily: "Aptos-Bold", color: "black", fontSize: 20 }}>Apps</Text>
                                )}
                                leading={() => (
                                    <Pressable onPress={() => { navigation.navigate("Home") }}>
                                        <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30 }} />
                                    </Pressable>

                                )}

                            />

                            <ScrollView
                                style={{ flexDirection: "row", margin: 10 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >

                                <Pressable
                                   
                                    style={{
                                        borderWidth: 1.5,
                                        borderColor: colorCode1,
                                        padding: 10,
                                        backgroundColor: colorCode1,
                                        borderRadius: 30,
                                        alignItems: "center",
                                        marginRight: 10
                                    }}

                                    onPress={async () => {
                                        setSelection(selection);
                                      
                                        await fetchApps(selection);

                                    }}
                                >
                                    <Text style={{ fontFamily: "Aptos-Bold", color: "white", }}>
                                    {selection}
                                    </Text>
                                </Pressable>
                                {options.filter((e)=>e != selection).map((option, index) => (
                                    <Pressable
                                        key={index}
                                        style={{
                                            borderWidth: 1.5,
                                            borderColor: colorCode1,
                                            padding: 10,
                                            backgroundColor: selection == option ? colorCode1 : "white",
                                            borderRadius: 30,
                                            alignItems: "center",
                                            marginRight: 10
                                        }}

                                        onPress={async () => {
                                            setSelection(option);
                                           // console.log(option);
                                            await fetchApps(option);

                                        }}
                                    >
                                        <Text style={{ fontFamily: "Aptos-Bold", color: selection != option ? colorCode1 : "white", }}>
                                            {option}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>


                            <FlatList
                                data={webapp}
                                numColumns={4}
                                style={{ marginTop: 30 }}
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

export default ListApp;
