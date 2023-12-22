import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useUserContext } from '../../contexts/UserContext';


const CameraModal = ({ closeModal }) => {
  const { postDraft, setPostDraft} = useUserContext()
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
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
    setPostDraft({ ...postDraft, image: image })
  }

  const handleRetake = () => {
    setImage(null);
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  return (
    <View style={styles.container}>
      {image ? 
        <>
        <TouchableOpacity style={styles.closeButton} onPress={handleRetake}>
          <Text style={styles.closeButtonText}>Retkae</Text>
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
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
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
    width: '90%',
    height: '65%',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  image: {
    width: '90%',
    height: '65%',
    borderRadius: 15,
    overflow: 'hidden',
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

  sendButton: {
    position: 'absolute',
    bottom: 75,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  captureButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default CameraModal;
