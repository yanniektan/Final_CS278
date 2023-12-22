import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useUserContext } from '../../contexts/UserContext';
import { formatDateString } from './functions/parseDate';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import {BlurView} from 'expo-blur';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
  const { user, userData, convertUIDToUserData, setCurrFriend, fetchPostUri, fetchProfilePictureUri, handleAddCommentToPost } = useUserContext();
  const [posts, setPosts] = useState([]);
  const [mostRecentPost, setMostRecentPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [profPicMap, setProfPicMap] = useState({});
  const [namesMap, setNamesMap] = useState({});

  const [hasPostedToday, setHasPostedToday] = useState(false);

  useEffect(() => {
    const fetchPosts = async (friends) => {
      let postsArray = [];
      for (const friend of friends) {
        const friendData = await convertUIDToUserData(friend);
        let friendPosts = friendData.posts;
        if (friendPosts && friendPosts.length > 0) {
          for (const post of friendPosts) {
            let frontURI = await fetchPostUri(friendData.uid, post.id, "front");
            let backURI = await fetchPostUri(friendData.uid, post.id, "back");
            let postObject = {
              front: frontURI,
              back: backURI,
              date: formatDateString(post.date),
              caption: post.caption,
              ratings: post.ratings,
              comments: post.comments,
              name: friendData.name,
              uid: friendData.uid,
              id: post.id
            };
            postsArray.push(postObject);
          }
        }
      }
      setPosts(postsArray.reverse());
    };
    if (userData) {
      checkIfPostedToday();
      if (userData.friends) {
        fetchPosts(userData.friends);
      }
      if (userData.posts && userData.posts.length > 0) {
        fetchMostRecentPost(userData);

      }
    }
  }, [userData]);

  const checkIfPostedToday = () => {
    const date = new Date();
    const dateString = date.toString();
    const formattedDate = formatDateString(dateString);

    if (userData.posts) {
      for (let i = userData.posts.length - 1; i >= 0; i--) {
        if (formatDateString(formatDateString(userData.posts[i].date)) === formattedDate) {
          setHasPostedToday(false);
          return;
        }
      }
    }
    setHasPostedToday(false);
  }

  

  const fetchMostRecentPost = async (userData) => {
    let lastPost = userData.posts[userData.posts.length - 1];
    try {
      const frontUri = await fetchPostUri(userData.uid, lastPost.id, "front");
      const backUri = await fetchPostUri(userData.uid, lastPost.id, "back");
      const postObject = {
        front: frontUri,
        back: backUri,
        date: formatDateString(lastPost.date),
      };
      setMostRecentPost(postObject);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }
  }, [user]);

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const handleFriendClick = async (friend) => {
    const friendData = await convertUIDToUserData(friend);
    setCurrFriend(friendData);
    navigation.navigate("FriendProfile");
  };

  const handlePostFocusModal = async(post) => {
    setSelectedPost(post);

    if (post.comments.length > 0) {
      let profilePicURIs = {}
      let names = {}
      for (const comment of post.comments) {
        if (!profilePicURIs[comment.uid]) {
          profilePicURIs[comment.uid] = await fetchProfilePictureUri(comment.uid);
        }
        if (!names[comment.uid]) {
          const data = await convertUIDToUserData(comment.uid);
          names[comment.uid] = data.name
        }
      }
      setProfPicMap(profilePicURIs)
      console.log(names)
      setNamesMap(names)
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAddComment = async (post) => {
    if (comment !== '') {
      try {
        let commentObject = {
          uid: userData.uid,
          comment: comment,
        };
        await handleAddCommentToPost(commentObject, post.uid, post.id);
        setComment('');
  
        // Update the posts array to reflect the new comment
        setPosts((prevPosts) => {
          return prevPosts.map((prevPost) => {
            if (prevPost.id === post.id) {
              return {
                ...prevPost,
                comments: [...prevPost.comments, commentObject],
              };
            }
            return prevPost;
          });
        });
  
        // Update the selected post if it matches the commented post
        if (selectedPost && selectedPost.id === post.id) {
          setSelectedPost((prevSelectedPost) => ({
            ...prevSelectedPost,
            comments: [...prevSelectedPost.comments, commentObject],
          }));
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Header name="Home" />
        <View>
          {mostRecentPost && (
            <>
              <Text style={styles.mostRecentDate}>From {mostRecentPost.date}</Text>
              <TouchableOpacity onPress={navigateProfile} style={styles.mostRecentPostContainer}>
              <Image source={{ uri: mostRecentPost.front }} style={styles.mostRecentPostFront} />
              <Image source={{ uri: mostRecentPost.back }} style={styles.mostRecentPostBack} />
            </TouchableOpacity>
          </>
        )}
      </View>
      {posts.map((post, index) => {
        return (
          <View style={styles.postContainer} key={index}>
  <TouchableOpacity onPress={() => handleFriendClick(post.uid)}>
    {/* <Image source={{uri: post.profile}} style={styles.postProfile}></Image> */}
    <Text style={styles.postName}>{post.name}</Text>
  </TouchableOpacity>
  <Text style={styles.postDate}>{post.date}</Text>
  <View style={styles.postImageContainer}>
  <BlurView intensity={100} style={styles.blurOverlay} />
  <Image style={styles.postFront} source={{ uri: post.front }} />
  <Image style={styles.postBack} source={{ uri: post.back }} />
</View>
  <TouchableOpacity style={styles.postCaptionContainer}>
    <Text style={styles.postCaption}>"{post.caption}"</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handlePostFocusModal(post)} style={styles.postCommentContainer}>
    <Text style={styles.postComment}>View Comments ({post.comments.length})</Text>
  </TouchableOpacity>
</View>

        );
      })}
    </ScrollView>
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalDate}>Date: {selectedPost && selectedPost.date}</Text>
          <View style={styles.mostRecentPostContainer}>
            <Image source={{ uri: selectedPost && selectedPost.front }} style={styles.mostRecentPostFront} />
            <Image source={{ uri: selectedPost && selectedPost.back }} style={styles.mostRecentPostBack} />
          </View>

          <View style={styles.commentScrollContainer}>
            {selectedPost && selectedPost.comments.map((comment, index) => {
              return (
                <View key={index} style={styles.pastCommentsContainer}>
                  <View style={styles.flexCol}>
                  <Image source={{uri: profPicMap[comment.uid]}} style={styles.commentProfile} />
                  <Text style={styles.commentNameText}>{namesMap[comment.uid]}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.comment}</Text>
                </View>
              )
            })}
          </View>

          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={comment}
              onChangeText={(text) => setComment(text)}
              onSubmitEditing={() => handleAddComment(selectedPost)}

            />
            <TouchableOpacity style={styles.commentButton} onPress={() => handleAddComment(selectedPost)}>
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
    <Footer
      navigateProfile={() => navigation.navigate('Profile')}
      navigateHome={() => navigation.navigate('Home')}
      navigateCamera={() => navigation.navigate('Camera')}
    />
  </View>
  );
};

export default Home;

const styles = StyleSheet.create({
container: {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#000',
},
flexCol: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
},
pastCommentsContainer: {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 8,
  justifyContent: 'flex-start',
  width: screenWidth * 0.85,
},
postContainer: {
  padding: 24,
  borderWidth: 1,
  borderColor: '#fff',
  marginVertical: 16,
  borderRadius: 10,
},
blurContainer: {
  flex: 1,
  borderRadius: 10,
  overflow: 'hidden',
  marginVertical: 16,
},
postName: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 8,
},
postProfile: {
  width: 75,
  height: 75,
  borderRadius: 75 / 2,
},
postDate: {
  color: '#fff',
  fontSize: 12,
  fontStyle: 'italic',
},
postCaption: {
  color: '#fff',
  fontSize: 20,
  textAlign: 'center',
  fontStyle: 'italic',
},
postCaptionContainer: {
  marginVertical: 16,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#fff',
  padding: 16,
},
postImage: {
  width: 300,
  height: 300,
},
scrollContainer: {
  flex: 1,
},
footerContainer: {
  height: 60, // You can adjust this height as per your requirements
  backgroundColor: '#000', // Adjust this too if needed
  zIndex: 2,
},
postImageContainer: {
  alignSelf: 'center',
  width: screenWidth * 0.75,
  height: screenWidth * 0.75,
  marginVertical: 16,
  position: 'relative', // Ensures the child absolute positioning is relative to this container
},
postFront: {
  width: '50%', // Adjust as per your requirement
  height: '50%', // Adjust as per your requirement
  borderRadius: screenWidth * 0.75 / 2,
  position: 'absolute',
  top: -10, // Position at the top
  right: -10, // Position to the right
  borderWidth: 2,
  borderColor: '#fff',
  zIndex: 1,
},
commentProfile: {
  width: 40,
  height: 40,
  borderRadius: 40 / 2,
},
postBack: {
  width: '100%',
  height: '100%',
  borderRadius: screenWidth * 0.75 / 2,
  borderWidth: 2,
  borderColor: '#fff',
},
sliderContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
sliderLabel: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
  maxWidth: 55,
  textAlign: 'center',
},
gradient: {
  flex: 1,
  borderRadius: 20,
  padding: 8,
  marginHorizontal: 8,
},
mostRecentPostFront: {
  width: '50%', // Adjust as per your requirement
  height: '50%', // Adjust as per your requirement
  borderRadius: screenWidth * 0.45 / 2,
  position: 'absolute',
  top: -10, // Position at the top
  right: -10, // Position to the right
  borderWidth: 2,
  borderColor: '#fff',
  zIndex: 1,
},
mostRecentPostBack: {
  width: '100%',
  height: '100%',
  borderRadius: screenWidth * 0.45 / 2,
  borderWidth: 2,
  borderColor: '#fff',
},
mostRecentPostContainer: {
  width: screenWidth * 0.45,
  height: screenWidth * 0.45,
  position: 'relative', // Ensures the child absolute positioning is relative to this container
  alignSelf: 'center',
  marginBottom: 16,
},
mostRecentDate: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  marginVertical: 16,
},
postComment: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'medium',
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 10,
  alignItems: 'center',
  width: screenWidth * 0.9,
  height: screenHeight * 0.75,
},
modalDate: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 16,
},
modalImage: {
  width: 200,
  height: 200,
  marginBottom: 16,
},
closeButton: {
  backgroundColor: '#000',
  padding: 10,
  borderRadius: 5,
  marginTop: 16,
},
closeButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
commentContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 16,
},
commentInput: {
  flex: 1,
  height: 40,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 8,
  marginRight: 8,
},
commentButton: {
  backgroundColor: '#000',
  padding: 10,
  borderRadius: 5,
},
commentButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
commentText: {
  color: '#000',
  fontSize: 16,
  fontWeight: 'medium',
  marginLeft: 8,
},
commentNameText: {
  color: '#222',
  fontSize: 12,
  fontWeight: 'bold',
},
imageOverlay: {
  ...StyleSheet.absoluteFillObject,
  zIndex: 2, // Ensure the overlay is positioned above the images
},
blurOverlay: {
  flex: 1,
  borderRadius: screenWidth * 0.75 / 2, // Make the overlay circular
},
});
