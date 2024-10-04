import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
import SolanaWallet from './src/SolanaWallet';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import QRCode from './src/qr';
import SolanaPaymentPage from './src/pay';
import PayKey from './src/paykey';
import Transaction from './src/transaction';
import Balance from './src/balance';
import QRPage from './src/qrpage';
import PinPage from './src/pin';
import WebApps from './src/web';
import Merchant from './src/merchant';
import Notification from './src/notification';
import ListApp from './src/apps';
import DID from './src/did';
import Splash from './src/splash';




const Stack = createNativeStackNavigator();

function App() {




  return (


    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Splash"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={SolanaWallet} />
        <Stack.Screen name="QRApp" component={QRCode} />
        <Stack.Screen name="Payment" component={SolanaPaymentPage} />
        <Stack.Screen name="PayKey" component={PayKey} />
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="Balance" component={Balance} />
        <Stack.Screen name="QRPage" component={QRPage} />
        <Stack.Screen name="Merchant" component={Merchant} />
        <Stack.Screen name="Pincode" component={PinPage} />
        <Stack.Screen name="Webapps" component={WebApps} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="ListApps" component={ListApp} />
        <Stack.Screen name="DID" component={DID} />
       
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
