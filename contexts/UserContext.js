
import { createContext, useContext, useState, useEffect} from "react";
import { auth, storage } from "../firebase";
import { firestore } from "../firebase";
import { createUserWithEmailAndPassword, getAuth, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail, deleteUser, fetchSignInMethodsForEmail} from "@firebase/auth";
import { doc, setDoc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseFirebaseSignInError } from "../screens/functions/parseFirebaseSignInError";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

// const revenueCat = new RevenueCat();
const UserContext = createContext({});

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
    const [postDraft, setPostDraft] = useState(null);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);

    const [currFriend, setCurrFriend] = useState(userData)

    const postObjectDraft = {
        backImageURI: "imgURL12349519233 which links to storage",
        frontImageURI: "img234919531294324 which links to storage",
        caption: "This is a caption",
        // diningHall: "Casper",
        // initialized to empty array
        comments: [
            {
                uid: "uid",
                comment: "comment",
                date: new Date
            },
            {
                uid: "uid",
                comment: "comment",
                date: new Date
            },
        ],
        // intitalized to no rating
        ratings: [
            {uid: "uid", rating: 5},
            {uid: "uid", rating: 5},
        ], 
        // current Date
        date: new Date 
    }

    const handleUserSearch = async (searchText) => {
        const usersRef = collection(firestore, "users");
      
        // Query for users where the name matches the searchText
        const nameQuery = query(usersRef, where("name", ">=", searchText), where("name", "<=", searchText + '\uf8ff'));
        const nameQuerySnapshot = await getDocs(nameQuery);
      
        // Query for users where the email matches the searchText
        const emailQuery = query(usersRef, where("email", ">=", searchText), where("email", "<=", searchText + '\uf8ff'));
        const emailQuerySnapshot = await getDocs(emailQuery);
      
        // Merge the results from both queries
        const result = [];
      
        nameQuerySnapshot.forEach((doc) => {
          const uid = doc.data().uid;
          const name = doc.data().name ? doc.data().name : "";
          const bio = doc.data().bio ? doc.data().bio : "No bio yet";
          const friends = doc.data().friends ? doc.data().friends : [];
          const requests = doc.data().requests ? doc.data().requests : [];
          const userObject = {
            uid: uid,
            name: name,
            bio: bio,
            email: doc.data().email,
            friends: friends,
            requests: requests
          };
          result.push(userObject);
        });
      
        emailQuerySnapshot.forEach((doc) => {
          const uid = doc.data().uid;
          const name = doc.data().name ? doc.data().name : "";
          const bio = doc.data().bio ? doc.data().bio : "No bio yet";
          const userObject = {
            uid: uid,
            name: name,
            bio: bio
          };
          // Check if the user is already included in the result to avoid duplicates
          const existingUser = result.find((user) => user.uid === uid);
          if (!existingUser) {
            result.push(userObject);
          }
        });
      
        return result;
      };

      const removeFriend = async (uid, friendUid) => {
        // Alert to confirm if the user wants to remove friend
        Alert.alert(
            "Remove Friend",
            "Are you sure you want to remove this friend?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                { 
                    text: "OK", 
                    onPress: async () => {
                        const userDocRef = doc(firestore, "users", uid);
                        const friendDocRef = doc(firestore, "users", friendUid);

                        const friendDocSnap = await getDoc(friendDocRef)
                        const friendData = friendDocSnap.data();
    
                        await updateDoc(userDocRef, {
                            friends: userData.friends.filter(friend => friend !== friendUid)
                        }, { merge: true });
                        
                        await updateDoc(friendDocRef, {
                            friends: friendData.friends.filter(friend => friend !== uid)
                        }, { merge: true });
                        
    
                        Alert.alert("Friend removed")
                    }
                },
            ],
            { cancelable: false }
        );
    }

    const cancelRequest = async (uid, friendUid) => {
        const friendDocRef = doc(firestore, "users", friendUid);
        const friendDoc = await getDoc(friendDocRef);
        if (friendDoc.exists()) {
            const friendData = friendDoc.data();
            if (friendData.requests) {
                const index = friendData.requests.indexOf(uid);
                if (index > -1) {
                    friendData.requests.splice(index, 1);
                }
            }
            await setDoc(friendDocRef, friendData, { merge: true });
        }
    };
    

    const sendRequest = async (uid, friendUid) => {
        const friendDocRef = doc(firestore, "users", friendUid);
        const docSnapshot = await getDoc(friendDocRef);
        if (docSnapshot.exists()) {
            let requests = docSnapshot.data().requests;
            if (!requests.includes(uid)) {
                requests.push(uid);
            }
            await setDoc(friendDocRef, { requests }, { merge: true });
        }
    }
    
    const generateUniqueId = () => {
        return Math.random().toString(18)
    }
    const handlePost = async (postDraft) => {
        try {
          // find current date as a string
          const uniqueId = generateUniqueId();
          await uploadImage(postDraft.backImage, user.uid, "back-" + uniqueId);
          await uploadImage(postDraft.frontImage, user.uid, "front-" + uniqueId);
          const date = new Date();
          const postObject = {
            backImageURI: postDraft.backImage,
            frontImageURI: postDraft.frontImage,
            caption: postDraft.caption ? postDraft.caption : "",
            comments: [],
            ratings: [],
            date: date.toString(),
            id: uniqueId,
          };
      
          // add postObject to firestore
          const userDocRef = doc(firestore, "users", user.uid);
          let postsArray = userData.posts ? [...userData.posts] : [];
          postsArray.push(postObject);
      
          await updateDoc(userDocRef, {
            posts: postsArray,
          }, { merge: true });
      
          // setPostDraft(null);
        } catch (error) {
          console.error("Failed to handle post:", error);
          // Handle the error gracefully (e.g., display an error message to the user)
        }
      };
      

    useEffect(() => {
        setLoading(true)
        const unsubscribe = onAuthStateChanged(auth, res => {
          // If a user is authenticated, set the user state with the user data
            if (res) {
              setUser(res)
            } else {
              setUser(null)
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const registerUser = async (name, email, password) => {
        setLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            const uid = res.user.uid;
            return uid;
        } catch (err) {
            Alert.alert('Sign Up Error', err)
            return null;
        } finally {
            setLoading(false);
        }
    }

    const writeData = async (uid, field, value) => {
        const userDocRef = doc(firestore, "users", uid);
        await updateDoc(userDocRef, {
            [field]: value
        }, {merge: true});
    }

    const uploadImage = async (uri, uid, imageName) => {
        try {
          const storageRef = ref(storage);
      
          // Create a reference to the desired folder using the folder name
          const folderRef = ref(storageRef, `${uid}/${imageName}`);
      
          // Convert the image file to a Blob
          const response = await fetch(uri);
          const blob = await response.blob();
          // Upload the image file to the folder reference
          await uploadBytesResumable(folderRef, blob).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
          console.log('Image uploaded successfully!');
        } catch (error) {
          console.log('Error uploading image:', error);
        }
      };

      const fetchProfilePictureUri = async (uid) => {
        try {
          const imageRef = ref(storage, `${uid}/profile`);
          // fetch the image uri
          const uri = await getDownloadURL(imageRef);
          return uri;
        } catch (error) {
        //   console.error('Error fetching profile picture uri:', error);
          return "https://firebasestorage.googleapis.com/v0/b/cs278-18738.appspot.com/o/default.png?alt=media&token=4f148893-8431-4922-8eef-697b3ee98591&_gl=1*qw7ecj*_ga*Njg2MDkyMzQuMTY3NzY0NzAyNQ..*_ga_CW55HF8NVT*MTY4NTk4OTk2MS4zNC4xLjE2ODU5OTAzOTEuMC4wLjA."
        }
      };
      
      const fetchPostUri = async (uid, id, type) => {
        try {
            const imageRef = ref(storage, `${uid}/${type}-${id}`);
            // fetch the image uri
            const uri = await getDownloadURL(imageRef);
            return uri;
        } catch (error) {
            // console.error('Error fetching post uri:', error);
            // try fetching image with '.jpg' added to the name
            try {
                const imageRefJpg = ref(storage, `${uid}/${type}-${id}.jpg`);
                const uriJpg = await getDownloadURL(imageRefJpg);
                return uriJpg;
            } catch (jpgError) {
                // console.error('Error fetching post uri with .jpg:', jpgError);
                // try fetching image with '.JPG' added to the name
                try {
                    const imageRefJPG = ref(storage, `${uid}/${type}-${id}.JPG`);
                    const uriJPG = await getDownloadURL(imageRefJPG);
                    return uriJPG;
                } catch (JPGError) {
                    console.error('Error fetching post uri:', JPGError);
                    return null;
                }
            }
        }
    };

    
      

    const initializeUserData = (name, uid, email) => {
        const userDocRef = doc(firestore, "users", uid);
        setDoc(userDocRef, {
            name: name,
            bio: "Hello, I am a foodie!",
            uid: uid,
            email: email,
            requests: [],
            friends: [],
            posts: [],
        }, {merge: true});
    }

    const setUserDataState = async(user) => {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDataObject = await getDoc(userDocRef)
        setUserData(userDataObject.data())
    }

    useEffect(() => {
        if (user) setUserDataState(user)
    }, [user])

    const signInUserEmail = async (email, password) => {
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            const uid = auth.currentUser.uid;
            await AsyncStorage.setItem('userToken', uid); //store the user's uid in AsyncStorage
            return uid;
        } catch (err) {
            Alert.alert("Sign In Error", parseFirebaseSignInError(err));
        } finally {
            setLoading(false);
        }
    }
    
    const logoutUser = async() => {
        await AsyncStorage.setItem('userToken', '');
        // const revenueCat = new RevenueCat();
        // revenueCat.logoutForRevenueCat()
        signOut(auth);
        setUser(null);
        setUserData(null);
    }

    const convertUIDToUserData = async(uid) => {
        const userDocRef = doc(firestore, "users", uid);
        const userDataObject = await getDoc(userDocRef)
        if (userDataObject.exists()) {
            return userDataObject.data()
        } else {
            return null
        }
    }

    const acceptRequest = async(uid, friendUid) => {
        const userDocRef = doc(firestore, "users", uid);
        let currFriends = []
        if (userData.friends && userData.friends.length > 0) {
            currFriends = userData.friends
        }
        currFriends.push(friendUid)
        const currRequests = userData.requests
        const index = currRequests.indexOf(friendUid)
        currRequests.splice(index, 1)
        await updateDoc(userDocRef, {
            friends: currFriends,
            requests: currRequests
        }, {merge: true});

        const friendDocRef = doc(firestore, "users", friendUid);
        let friendDocSnap = await getDoc(friendDocRef)
        let friendData = friendDocSnap.data()
        let friendFriends = []
        if (friendData.friends && friendData.friends.length > 0) {
            currFriends = friendData.friends
        } 
        friendFriends.push(uid)
        await updateDoc(friendDocRef, {
            friends: friendFriends
        })
    }

    const rejectRequest = async(uid, friendUid) => {
        const userDocRef = doc(firestore, "users", uid);
        const currRequests = userData.requests
        const index = currRequests.indexOf(friendUid)
        currRequests.splice(index, 1)
        await updateDoc(userDocRef, {
            requests: currRequests
        }, {merge: true});
    }
    const handleAddCommentToPost = async (commentObject, uid, postId) => {
        try {
          const userDocRef = doc(firestore, "users", uid);
          const userDocSnap = await getDoc(userDocRef);
      
          if (!userDocSnap.exists()) {
            throw new Error("User document does not exist");
          }
      
          const userData = userDocSnap.data();
          const userPosts = userData.posts || [];
          console.log(userPosts, postId)
          const postIndex = userPosts.findIndex((post) => post.id === postId);
      
          if (postIndex === -1) {
            throw new Error("Post does not exist in user's posts");
          }
      
          const post = userPosts[postIndex];
          const comments = post.comments || [];
          const updatedComments = [...comments, commentObject];
      
          const updatedPost = {
            ...post,
            comments: updatedComments,
          };
      
          const updatedUserPosts = [
            ...userPosts.slice(0, postIndex),
            updatedPost,
            ...userPosts.slice(postIndex + 1),
          ];
      
          await updateDoc(userDocRef, {
            posts: updatedUserPosts,
          });
        } catch (error) {
          console.error("Failed to add comment:", error);
        }
      };
      
      
      
      

    
    const contextValue = {
        user,
        userData,
        loading,
        registerUser,
        signInUserEmail,
        initializeUserData,
        logoutUser,
        uploadImage,
        fetchProfilePictureUri,
        postDraft,
        setPostDraft,
        writeData,
        setUserDataState,
        handlePost,
        fetchPostUri,
        postSuccess,
        handleUserSearch, 
        setCurrFriend,
        currFriend,
        removeFriend,
        cancelRequest,
        sendRequest,
        convertUIDToUserData,
        acceptRequest,
        rejectRequest,
        handleAddCommentToPost
    };
    
    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
};
