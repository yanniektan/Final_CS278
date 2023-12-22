import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { useUserContext } from '../../contexts/UserContext'
import * as ImagePicker from 'expo-image-picker';
import Default from '../assets/default.png'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Profile = ({navigation}) => {
  const {user, userData, uploadImage, fetchProfilePictureUri, fetchPostUri} = useUserContext()
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([])


  const fetchProfile = async () => {
    try {
      const profile = await fetchProfilePictureUri(user.uid);
      if (profile) {
        setSelectedImage(profile);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPostsFunction = async() => {
      const postsarray = []
        for (const post of userData.posts) {
          let frontUri = await fetchPostUri(user.uid,post.id, "front")
          let backUri = await fetchPostUri(user.uid, post.id, "back")
          const postObject = {
            front: frontUri,
            back: backUri,
          }
          postsarray.push(postObject)
        }
        setPosts(postsarray)
    }
    if (userData) {
      if (userData.posts) {
        fetchPostsFunction()
      }
    }
  }, [userData])
  

  
  

  useEffect(() => {
    if (user) {
      fetchProfile();
    } 
  }, [user])
  

  useEffect(() => {
    if (!user) {
      navigation.replace("Login")
    }
  }, [user])

  const navigateSettings = () => {
    navigation.navigate("Settings")
  }

  const navigateRequests = () => {
    navigation.navigate("Requests")
  }

  const navigateFriends = () => {
    navigation.navigate("Friends")
  }

  const selectProfilePicture = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photo library in order to select a profile picture.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync();
  
      if (!result.cancelled) {
        // Handle the selected image here, e.g., save it to the user's profile
        console.log('Selected image:', result.uri);
        setSelectedImage(result.uri);
        uploadImage(result.uri, user.uid, 'profile'); // or any other desired folder name
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  // console.log(userData)
  const navigateUserFriends = () => {
    navigation.navigate("UserFriends")
  }

  return (
    <View style={styles.container}>
      <Header name="Profile" />
      <View style={styles.moreButton}>
        <View>
      <TouchableOpacity style={styles.addFriendContainer} onPress={navigateFriends}>
        <Text style={styles.addFriendText}>Find Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.requestContainer} onPress={navigateRequests}>
        <Text style={styles.requestText}>Requests</Text>
        </TouchableOpacity>
        </View>
      <TouchableOpacity onPress={navigateSettings}>
        <Text style={styles.moreButtonText}>...</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
      <TouchableOpacity onPress={selectProfilePicture}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.profilePic} />
          ) : (
            <Image source={Default} style={styles.profilePic} />
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{userData && (userData.name ? userData.name : "Foodie")}</Text>
        <Text style={styles.bio}>{userData && (userData.bio ? userData.bio : "Hello, I am a foodie!")}</Text>
      </View>
      <TouchableOpacity style={styles.friendsContainer} onPress={navigateUserFriends}>
        {userData && userData.friends ? <Text style={styles.friendsText}>{userData.friends.length} Friends</Text> : <Text style={styles.friendsText}>0 Friends</Text>}
      </TouchableOpacity>
      <View style={styles.postsContainer}>
      {/* {posts && 
        <>
          {posts.map(async(post, idx) => {
            return (
              <View key={idx} style={styles.postImageContainer}>
                <Image source={{uri:  post.back}} style={styles.postBackPrev} />
                <Image source={{uri: post.front}} style={styles.postFrontPrev} />
              </View>
            )
          })}
        </>
      } */}
      {posts.reverse().slice(0,3).map((post, idx) => {
        return (
          <View key={idx} style={styles.postImageContainer}>
            <Image source={{uri:  post.back}} style={styles.postBackPrev} />
            <Image source={{uri: post.front}} style={styles.postFrontPrev} />
          </View>
        )
      })}
      </View>
      <TouchableOpacity style={styles.plateHeaderContainer}>
        <Text style={styles.plateHeader}>View All Plates</Text>
      </TouchableOpacity>
      <View style={styles.footerContainer}>
        <Footer 
          navigateProfile={() => navigation.navigate('Profile')}
          navigateHome={() => navigation.navigate('Home')}
          navigateCamera={() => navigation.navigate('Camera')}
        />
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
  },
  postsContainer: {
    width: screenWidth * 0.95,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff'
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 32,
    color: '#fff'
  },
  ctaButton: {
    backgroundColor: '#ec0c0c',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  postImageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    marginVertical: 16,
    position: 'relative', // Ensures the child absolute positioning is relative to this container
  },
  postBackPrev: {
    width: '100%',
    height: '100%',
    borderRadius: screenWidth * 0.3 / 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  postFrontPrev: {
    width: '50%', // Adjust as per your requirement
    height: '50%', // Adjust as per your requirement
    borderRadius: screenWidth * 0.3 / 2,
    position: 'absolute',
    top: -10, // Position at the top
    right: -10, // Position to the right
    borderWidth: 2,
    borderColor: '#fff',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  moreButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 36,
    color: '#ddd',
    fontWeight: 'bold',
    paddingBottom: 8,
  },
  addFriendText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  requestText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  plateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addFriendContainer: {
    borderRadius: 10,
    paddingVertical: 8,
    backgroundColor: '#ff0000',
    paddingHorizontal: 16,
  },
  requestContainer: {
    backgroundColor: 'white',
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  plateHeaderContainer: {
    backgroundColor: '#ec0c0c',
    borderRadius: 10,
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  friendsContainer: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  }
})