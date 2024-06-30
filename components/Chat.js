import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Define the Chat component that takes route and navigation props for navigation and parameter passing
const Chat = ({ route, navigation }) => {
    // Extracting name and background color from navigation parameters
    const { name, background } = route.params; 

    // Set the navigation title to the user's name upon component mount
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    return (
        // View component as a container with dynamic background color based on user selection
        <View style={[styles.container, { backgroundColor: background}]}>
        <Text>Hello World!</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Make the container use the full height of the screen
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Chat;