import { useState } from 'react';
import { StyleSheet, View, ImageBackground, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

// Define the Start component that takes navigation prop for navigating between screens
const Start = ({ navigation }) => {
    // State for storing user's name and selected background color
    const [name, setName] = useState('');
    const [background, setBackground] = useState('');
    // Array of background color options
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

    return (
        <ImageBackground 
            source={require('../assets/background-image.png')}
            style={styles.container}
        >
            <View style={styles.appTitleContainer}>
                <Text style={styles.appTitle}>Chatterbox</Text>
            </View>
            <View style={styles.contentBox}>
                <TextInput
                    style={[styles.textInput]}
                    value={name}
                    onChangeText={setName}
                    placeholder='Your Name'
                />
                <View style={styles.chooseBackgroundContainer}>
                    <Text style={styles.chooseBackgroundText}>Choose Background Color:</Text>
                    <View style={styles.colorOptions}>
                    {colors.map((color, index) => (
                        <TouchableOpacity // TouchableOpacity for each color option
                        key={index}
                        style={[
                            styles.colorButton, 
                            { backgroundColor: color }, 
                            background === color && styles.selected
                        ]}
                        onPress={() => setBackground(color)}
                    />
                    ))}
                    </View> 
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Chat', { name: name, background: background})}
                >
                    <Text style={styles.buttonText}>Start Chatting</Text>
                </TouchableOpacity>
            </View>
            {Platform.OS === "ios"
                ? <KeyboardAvoidingView behavior="padding" />
                : null
            }
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  appTitleContainer: {
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 140,
  },

  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  contentBox: {
    backgroundColor: '#ffffff',
    width: '88%',
    height: '44%',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 5,
  },

  textInput: {
    height: 50,
    paddingLeft: 10,
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 2,
    borderStyle: 'solid',
  },

  chooseBackgroundContainer: {
    width: '88%',
  },

  chooseBackgroundText: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 15,
  },

  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    margin: 5,
  },

  selected: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
 
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#757083',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 50,
  },
});

export default Start;
