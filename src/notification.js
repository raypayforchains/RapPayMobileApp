import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';


const Notification = ({ navigation }) => {

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center" ,backgroundColor:"white",padding:10}}>
        <Pressable onPress={() => {
          navigation.navigate("Home")
        }}>


          <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30, backgroundColor: "white" }} />
        </Pressable>

        <Text style={[styles.text, { fontSize: 25, margin: 10 }]}>Notifications</Text>
      </View>

      <View style={styles.container}>


          <Image source={require("../assets/icons/no.png")} style={{ width: "50%", height: Dimensions.get("window").width/2}}  resizeMode='contain'/>

          <Text style={[styles.text, { fontSize: 20, margin: 10 }]}>No Notifications Yet</Text>
        


      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white"
  },
  item: {
    flexDirection: "row",
    marginBottom: 5,
    padding: 10,
    justifyContent: "space-between"
  },
  text: {
    fontFamily: "Aptos-Bold",
    color: "black"
  }
});

export default Notification;
