import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import Header from './components/Header';
import Default from '../assets/default.png';
import { useUserContext } from '../../contexts/UserContext';

const Settings = ({navigation}) => {
  const [name, setName] = useState("Your Name");
  const [bio, setBio] = useState("Your Bio");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState("name");

  useEffect(() => {
    if (userData) {
      if (userData.name) setName(userData.name);
      if (userData.bio) setBio(userData.bio);
    }
  }, [userData])
  
  const {setUserDataState, writeData, user, userData, logoutUser} = useUserContext();
  const handleNameChange = () => {
    setActiveModal("name")
    setModalVisible(true);
  }

  const handleBioChange = () => {
    setActiveModal("bio")
    setModalVisible(true);
  }

  const handleSaveChanges = () => {
    console.log(activeModal, name, bio)
    if (activeModal === "name") {
      writeData(user.uid, "name", name)
    } else if (activeModal === "bio") {
      writeData(user.uid, "bio", bio)
    }
    setModalVisible(false);
  }

  const handleClose = () => {
    setUserDataState(user)
    navigation.goBack();
  }

  const handleLogout = () => {
    logoutUser();
  }

  useEffect(() => {
    console.log(user)
    if (!user) {
      navigation.navigate("Login")
    }
  }, [user])
  

  return (
    <View style={styles.container}>
      <Header name="Settings" />
      <TouchableOpacity style={styles.profilePicContainer}>
        <Image source={Default} style={styles.profilePic} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.editName} onPress={handleNameChange}>
        <Text style={styles.editText}>Name</Text>
        <Text style={styles.editValue}>{name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editBio} onPress={handleBioChange}>
        <Text style={styles.editText}>Bio</Text>
        <Text style={styles.editValue}>{bio}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleClose}>
        <Text style={styles.saveButtonText}>Close</Text>
      </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
      <Modal visible={modalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Change {activeModal === "name" ? "Name" : "Bio"}</Text>
          <TextInput style={styles.modalInput} value={activeModal === "name" ? name : bio} onChangeText={activeModal === "name" ? setName : setBio} />
          <TouchableOpacity style={styles.modalButton} onPress={handleSaveChanges}>
            <Text style={styles.modalButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
</Modal>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#FAFAFA',
    height: 80,
    justifyContent: 'center',
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#262626',
  },
  profilePicContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePic: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    height: 20,
    width: 20,
    tintColor: '#fff',
  },
  editName: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between'
  },
  editBio: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between'
  },
  editText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#262626',
  },
  editValue: {
    fontSize: 16,
    fontWeight: '300',
    color: '#8E8E8E',
  },
  saveButton: {
    backgroundColor: 'red',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  logoutButton: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#ff0000',
    fontSize: 24,
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 16,
    color: '#fff',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#222',
    fontSize: 16,
    width: '100%',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    color: '#fff',
  },
  modalButton: {
    backgroundColor: 'red',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
  },
  
});

export default Settings;