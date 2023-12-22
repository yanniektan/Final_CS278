import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useUserContext } from '../../contexts/UserContext';

// get dimensions of screen
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CameraScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const {postDraft, setPostDraft} = useUserContext()
  const [isCameraReady, setCameraReady] = useState(false);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const handleCameraReady = () => {
    setCameraReady(true);
  };

  const handleClose = () => {
    navigation.goBack();
  }

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log('data: ', data);
        setImage(data.uri);
      } catch (error) {
        console.log('error: ', error);
      }
    }
  };

  const handleContinue = () => {
    // handle 
    setPostDraft({ ...postDraft, backImage: image })
    navigation.navigate('FrontCamera')
  }

  const handleRetake = () => {
    setImage(null);
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Take a pic of your plate!</Text>
      {image ? 
        <>
        <TouchableOpacity style={styles.closeButton} onPress={handleRetake}>
          <Text style={styles.closeButtonText}>Retake</Text>
        </TouchableOpacity>
        <Image source={{ uri: image }} style={styles.image} /> 
        <TouchableOpacity style={styles.sendButton} onPress={handleContinue}>
          <Text style={styles.sendButtonText}>Continue</Text>
        </TouchableOpacity>
        </>
      : 
      <>
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
          onCameraReady={handleCameraReady}
        />
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>

        </TouchableOpacity>
        </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#000',
  },
  camera: {
    width: windowWidth * 0.95,
    height: windowWidth * 0.95,
    borderRadius: windowWidth * 0.95 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  image: {
    width: windowWidth * 0.95,
      height: windowWidth * 0.95,
      borderRadius: windowWidth * 0.95 / 2,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 75,
    right: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    position: 'absolute',
    bottom: 55,
    width: 75,
    height: 75,
    borderRadius: 50,
    borderColor: 'white', // Circle outline color
    borderWidth: 5, // Circle outline width
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'light',
    position: 'absolute',
    top: windowHeight * 0.2,
  },
  sendButton: {
    position: 'absolute',
    bottom: 75,
    backgroundColor: 'red',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  captureButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default CameraScreen;
