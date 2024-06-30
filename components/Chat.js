import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// Define the Chat component that takes route and navigation props for navigation and parameter passing
const Chat = ({ route, navigation }) => {
    // Extracting name and background color from navigation parameters
    const { name, background } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }

    // Customize speech bubble
    const renderBubble = (props) => {
      return <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#757083"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
    }

    // Set the navigation title to the user's name upon component mount
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    useEffect(() => {
        setMessages([
          {
            _id: 1,
            text: "Hello developer",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "React Native",
              avatar: "https://placeimg.com/140/140/any",
            },
          },
          {
            _id: 2,
            text: 'This is a system message',
            createdAt: new Date(),
            system: true,
          },
        ]);
    }, []);

    return (
        // View component as a container with dynamic background color based on user selection
        <View style={[styles.container, { backgroundColor: background}]}>
            <GiftedChat
              messages={messages}
              renderBubble={renderBubble}
              onSend={messages => onSend(messages)}
              user={{
                _id: 1
              }}
            />
            { 
                Platform.OS === 'android' 
                    ? <KeyboardAvoidingView behavior="height" /> 
                    : null 
            }
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Make the container use the full height of the screen
        
    }
});

export default Chat;