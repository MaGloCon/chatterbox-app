import { useEffect } from 'react';
import { LogBox, Alert } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

import Start from './components/Start';
import Chat from './components/Chat';

// Create a Stack Navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


//Main App component
const App = () => {
  // Check network connection status
  const connectionStatus = useNetInfo();
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA0shx6YZVPnP_Iy2boC9CEWOieXzUFkkg",
    authDomain: "chatterbox-app-68166.firebaseapp.com",
    projectId: "chatterbox-app-68166",
    storageBucket: "chatterbox-app-68166.appspot.com",
    messagingSenderId: "592659635009",
    appId: "1:592659635009:web:a1cd8dba4251f1e8bc5fc0"
  };
  
  const app = initializeApp(firebaseConfig); //Initialize Firebase
  const db = getFirestore(app); //Initialize Cloud Firestore and get a reference to the service
  // const auth = initializeAuth(app, {
  //   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  // });

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Chatterbox"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => (
            <Chat 
              isConnected={connectionStatus.isConnected} 
              db={db} 
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;