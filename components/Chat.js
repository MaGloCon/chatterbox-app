import { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, AccessibilityInfo } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";

const Chat = ({ route, navigation, db}) => {
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
      // Handle any errors here, such as by announcing the failure to send the message
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

  // Set the navigation title to the user's name upon component mount
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubMessages = onSnapshot(q, (documentSnapshot) => {
          let newMessages = [];
          documentSnapshot.forEach(doc => {
            newMessages.push({ 
              _id: doc.id, 
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis())
            })
          });
          setMessages(newMessages);
      });

      // Unsubscribe from the collection when the component unmounts
      return () => {
        if (unsubMessages) unsubMessages();
      }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userID, name }}
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
