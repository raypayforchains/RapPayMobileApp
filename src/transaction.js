import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { Connection, PublicKey } from '@solana/web3.js';
import { ActivityIndicator } from '@react-native-material/core';
import { colorCode1 } from './fixed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { publickey } from './pin';

const connection = new Connection('https://api.devnet.solana.com');


export const fetchTransactions = async (publicKey) => {
  try {
    // Convert public key to PublicKey object
    const key = new PublicKey(publicKey);

    // Fetch the transaction signatures
    const signatures = await connection.getSignaturesForAddress(key);

    // Fetch transaction details
    const transactions = await Promise.all(
      signatures.map(async (signatureInfo) => {
        const { signature } = signatureInfo;
        const transaction = await connection.getTransaction(signature);

        // Check if transaction and meta data are available
        if (!transaction || !transaction.meta) {
          return null;
        }

        const preBalances = transaction.meta.preBalances;
        const postBalances = transaction.meta.postBalances;
        const accountKeys = transaction.transaction.message.accountKeys;

        // Find the index of the public key in accountKeys
        const receiverIndex = accountKeys.findIndex(account => account.equals(key));

        if (receiverIndex === -1) {
          return null;
        }

        const receiverPublicKey = receiverIndex !== -1 ? accountKeys[receiverIndex + 1].toBase58() : 'Unknown Receiver';
        // Calculate the amount of SOL received
        const amount = (postBalances[receiverIndex] - preBalances[receiverIndex]) / 1000000000; // Convert lamports to SOL

        // Identify the sender: The sender's balance should have decreased
        const senderIndex = preBalances.findIndex((balance, idx) => postBalances[idx] < balance);

        // Get the sender's public key (if found)
        const senderPublicKey = senderIndex !== -1 ? accountKeys[senderIndex].toString() : 'Unknown Sender';

        // Return the transaction details
        return {
          amount,
          date: transaction.blockTime ? new Date(transaction.blockTime * 1000).toISOString() : 'Unknown date',
          signature,
          receiverPublicKey,
          senderPublicKey,  // Sender public key
        };
      })
    );

    // Filter out any null results
    return transactions.filter(tx => tx !== null);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};


const Transactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadTransactions = async () => {

      try {
        const txs = await fetchTransactions(publickey);
        setTransactions(txs);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return (
    <View style={styles.container}>
      {loading ?
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <ActivityIndicator color={colorCode1} size={"large"} />
        </View>

        : <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => {
              navigation.navigate("Home")
            }}>


              <Image source={require("../assets/icons/arrow3.png")} style={{ width: 30, height: 30, backgroundColor: "white" }} />
            </Pressable>

            <Text style={[styles.text, { fontSize: 25, margin: 10 }]}>Transactions History</Text>
          </View>

          {

            transactions.length == 0 ?

              <View style={{width:"100%",height:"90%",alignSelf:"center",alignContent:"center",alignItems:"center",justifyContent:"center"}}>  
              
              <Image source={require("../assets/icons/no.png")} style={{ width:  Dimensions.get("window").width / 2, height: Dimensions.get("window").width / 2 }} resizeMode='contain' />

                <Text style={[styles.text, { fontSize: 20, margin: 10 }]}>No Transactions Yet</Text>
              </View> :

              <FlatList
                data={transactions}
                keyExtractor={(item) => item.signature}
                
                renderItem={({ item ,index}) => (
                  <View style={[styles.item,{marginBottom:index+1 == transactions.length && 40}]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ backgroundColor: "#FFA500", padding: 9, borderRadius: 50, marginRight: 10, }}>
                        <Image source={require("../assets/icons/wallet.png")} style={{ width: 30, height: 30, tintColor: "white" }} />
                      </View>

                      <View style={{ width: "55%" }}>


                        <Text style={[styles.text, { fontSize: 15 }]} numberOfLines={1}>{item.amount > 0 ? item.senderPublicKey : item.receiverPublicKey}</Text>

                        <Text style={[styles.text, { color: "gray" }]}>
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',   // Year in numeric format
                            month: 'long',     // Full month name (e.g., September)
                            day: 'numeric'     // Day of the month
                          })}
                          {" at "}
                          {new Date(item.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',   // Hour in 2-digit format
                            minute: '2-digit', // Minute in 2-digit format
                          })}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={[styles.text, { fontSize: 18 }]}>{item.amount > 0 ? "+" : "-"} </Text>
                      <Image source={require("../assets/icons/solana.webp")} style={{ width: 25, height: 25, marginRight: 3 }} />
                      <Text style={[styles.text, { fontSize: 18 }]}>{item.amount > 0 ? (item.amount).toFixed(4) : (item.amount * -1).toFixed(4)} </Text>
                    </View>


                  </View>
                )}
              />

          }
        </View>

      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default Transactions;
