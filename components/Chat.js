import { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, AccessibilityInfo } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActionSheetProvider, connectActionSheet } from "@expo/react-native-action-sheet";
import { getStorage } from "firebase/storage";
import CustomActions from "./CustomActions";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
      .then(() => {
        AccessibilityInfo.announceForAccessibility("New message sent.");
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

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

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  let unsubMessages;
  useEffect(() => {
    if (isConnected === true) {
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
    <ActionSheetProvider>
      <View style={[styles.container, { backgroundColor: background }]}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderActions={renderCustomActions}
          onSend={(messages) => onSend(messages)}
          user={{ userID, name }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    </ActionSheetProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connectActionSheet(Chat);