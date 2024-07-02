import { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, AccessibilityInfo } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    // Append new messages to the previous messages
  addDoc(collection(db, "messages"), newMessages[0])
    .then(() => {
      // Announce the new message for screen reader users only if sending was successful
      AccessibilityInfo.announceForAccessibility("New message sent.");
    })
    .catch((error) => {
      console.error("Error sending message: ", error);
    });
};

  // Customize speech bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#757083",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Prevent rendering of InputToolbar when offline
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Set the navigation title to the user's name upon component mount
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // Fetch messages from Firestore
  // Messages database
  let unsubMessages;
  useEffect(() => {
    if (isConnected === true) {
        // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
        if (unsubMessages) unsubMessages();
        unsubMessages = null;
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubMessages = onSnapshot(q, (documentSnapshot) => {
            let newMessages = [];
            documentSnapshot.forEach(doc => {
              newMessages.push({ 
                id: doc.id, 
                ...doc.data(),
                createdAt: new Date(doc.data().createdAt.toMillis())
              })
            });
            cacheMessagesHistory(newMessages);
            setMessages(newMessages);
        });
    } else loadCachedMessages();
    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("chat_messages") || [];
    setMessages(JSON.parse(cachedMessages));
  }

  const cacheMessagesHistory = async (listsToCache) => {
    try {
      await AsyncStorage.setItem('chat_messages', JSON.stringify(listsToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{ userID, name }}
      />
      {Platform.OS === "android" ? (
        // Use KeyboardAvoidingView to adjust the view when the keyboard is open
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
