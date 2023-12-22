import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../contexts/UserContext';
import Header from './components/Header';
import Default from '../assets/default.png'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatDateString } from './functions/parseDate';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const FriendProfile = ({navigation}) => {
  const { user, currFriend, fetchProfilePictureUri,fetchPostUri, removeFriend, cancelRequest, sendRequest} = useUserContext();
  const [relationship, setRelationship] = useState('');

  const [mostRecentPost, setMostRecentPost] = useState(null);

  useEffect(() => {
    const fetchMostRecentPost = async (friend) => {
      let posts = friend.posts
      if (posts.length > 0) {
        let lastPost = posts[posts.length - 1]
        try {
          const frontUri = await fetchPostUri(friend.uid, lastPost.id, "front")
          const backUri = await fetchPostUri(friend.uid, lastPost.id, "back")
          const postObject = {
            front: frontUri,
            back: backUri,
            date: formatDateString(lastPost.date),
          }
          setMostRecentPost(postObject);
        } catch (error) {
        }

      }
    };
    if (identifyRelationship(user.uid, currFriend) === "friend") {
      fetchMostRecentPost(currFriend);
    }
  }, [currFriend])

  const parseDate = (date) => {

  } 
  
  
  const [profilePic, setProfilePic] = useState('');
  useEffect(() => {
    if (currFriend) {
        fetchProfile(currFriend.uid);
        setRelationship(identifyRelationship(user.uid, currFriend));
    }
  }, [currFriend])
  
  const fetchProfile = async (uid) => {
    try {
      const profile = await fetchProfilePictureUri(uid);
      if (profile) {
        setProfilePic(profile);
      } 
    } catch (error) {
      console.log(error);
    }
  };



  const identifyRelationship = (uid, friend) => {
    if (friend.friends && friend.friends.includes(uid)) {
        return "friend";
    } else if (friend.requests && friend.requests.includes(uid)) {
        return "requested";
    } else {
        return "none";
    }

  }
  const handleActionButton = async (uid, friend) => {
    const relationship = identifyRelationship(uid, friend);
    if (relationship === "friend") {
        // remove friend
        await removeFriend(uid, friend.uid);
        setRelationship("none")
    } else if (relationship === "requested") {
        // cancel request
        await cancelRequest(uid, friend.uid);
        setRelationship("none")
    } else {
        // send request
        await sendRequest(uid, friend.uid);
        setRelationship("requested")
    }
    // trigger a rerender to update the button text
  }

  const handleGoBack = () => {
    // go back to the previous screen
    navigation.goBack();
  }


  return (
    currFriend && (
      <>
        <Header name="" />
        <View style={styles.container}>
          <TouchableOpacity  style={styles.goBackButton} onPress={handleGoBack}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
          <View style={styles.profileContainer}>
            {/* Display the friend's profile picture */}
            {profilePic ? 
            <Image source={{ uri: profilePic }} style={styles.profilePicture} />
            : <Image source={Default} style={styles.profilePicture} />}

            {/* Display the friend's name */}
            <Text style={styles.name}>{currFriend.name}</Text>

            {/* Display the friend's bio */}
            <Text style={styles.bio}>{currFriend.bio}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleActionButton(user.uid, currFriend)}>
              <Text style={styles.buttonText}>
                  {
                      relationship === "friend" ? 
                      "Unfriend" :
                      relationship === "requested" ? 
                      "Requested" : 
                      "Add Friend"
                  }
              </Text>
          </TouchableOpacity>
          {mostRecentPost && 
          <>
          <View style={styles.postImageContainer}>
            <Image source={{uri:  mostRecentPost.back}} style={styles.postBackPrev} />
            <Image source={{uri: mostRecentPost.front}} style={styles.postFrontPrev} />
          </View>
          <Text style={styles.dateText}>From {mostRecentPost.date}</Text>
          </>}
          </View>
          {/* Add other components for displaying friend's posts, followers, etc. */}
        </View>
      </>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'light',
    fontStyle: 'italic',
    marginTop: 16,
  },
  postBackPrev: {
    width: '100%',
    height: '100%',
    borderRadius: screenWidth * 0.6 / 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  postImageContainer: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    marginTop: 32,
    position: 'relative', // Ensures the child absolute positioning is relative to this container
  },
  postFrontPrev: {
    width: '50%', // Adjust as per your requirement
    height: '50%', // Adjust as per your requirement
    borderRadius: screenWidth * 0.6 / 2,
    position: 'absolute',
    top: -10, // Position at the top
    right: -10, // Position to the right
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 3,
    borderColor: 'white',
    margin: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.05,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
},
buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
},
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  goBackButton: {
    margin: 15,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default FriendProfile;
