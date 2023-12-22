import { Image, StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState} from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { useUserContext } from '../../contexts/UserContext'

// dimsenison
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Preview = ({navigation}) => {
    const {postDraft, setPostDraft, handlePost, postSuccess} = useUserContext()

    const navigateSettings = () => {
      navigation.navigate("Settings")
    }

    const handleSubmit = () => {
      handlePost(postDraft).then(() => {
        navigation.navigate('Home')
      })
    };

    // useEffect(() => {
    //   if (postSuccess) {
    //     navigation.navigate('Home')
    //   }
    // }, [postSuccess])
    

    
    
return (
  <>
  <Header name="New Plate" />
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled>
      <View style={styles.container}>
        <Image source={{uri: postDraft.backImage}} style={styles.backImage}/>
        <Image source={{uri: postDraft.frontImage}} style={styles.frontImage}/>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.inputText}
            placeholder="Write a location / caption ..."
            onChangeText={text => setPostDraft(prevDraft => ({ ...prevDraft, caption: text }))} 
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.button}><Text style={styles.submitButtonText}>Post</Text></TouchableOpacity>
        </View>
      </View>
  </KeyboardAvoidingView>
  </>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      backgroundColor: '#000',
      flexDirection: 'column',
      alignItems: 'center',
    },
    inputContainer: {
      width: '100%',
      marginTop: 20,
      alignItems: 'center',
    },
    backImage: {
      width: windowWidth * 0.95,
      height: windowWidth * 0.95,
      borderRadius: windowWidth * 0.95 / 2,
      marginTop: 20,
      borderWidth: 4,
      borderColor: '#fff',
    },
    frontImage: {
      position: 'absolute',
      top: 20, // This should be the same as the marginTop of backImage
      left: windowWidth * 0.025, // Half of the remaining width when the image is 95% of the width
      width: windowWidth * 0.95 / 4,
      height: windowWidth * 0.95 / 4,
      borderRadius: windowWidth * 0.95 / 2,
      zIndex: 1, // This ensures the frontImage appears on top
      borderWidth: 4,
      borderColor: '#fff',
    },    
    inputText: {
      color: '#000',
      fontSize: 20,
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      borderWidth: 0,
      textAlign: 'center',
        width: '90%',
    },
    button: {
      backgroundColor: '#ff0000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
        padding: 12,
        marginTop: 20,
        width: 100,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
  export default Preview