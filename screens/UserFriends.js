import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { useUserContext } from '../../contexts/UserContext'
import Default from '../assets/default.png'
import { TouchableOpacity } from 'react-native-gesture-handler'

const UserFriends = ({navigation}) => {
    const [friendsList, setFriendsList] = useState([])
    const { userData, fetchProfilePictureUri, convertUIDToUserData, setCurrFriend} = useUserContext();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const fetchFriends = async (friends) => {
            const friendsArray = []
            for (const friendURI of friends) {
                let profilePic = await fetchProfilePictureUri(friendURI);
                let friendObject = await convertUIDToUserData(friendURI)

                friendObject = {
                    ...friendObject,
                    profilePic: profilePic
                }
                friendsArray.push(friendObject)
            }
            setFriendsList(friendsArray)
            setInitialized(true)
        }

        if (userData && userData.friends && !initialized) {
            if (userData.friends.length > 0) {
                fetchFriends(userData.friends)
            }
        }
    }, [userData])

    const handleGoBack = () => {
        navigation.goBack()
    }

    const handleFriendClick = (friend) => {
        setCurrFriend(friend)
        navigation.navigate('FriendProfile')
    }
    return (
        <>
            <Header name="Friends" />
            <View style={styles.container}>
                <TouchableOpacity style={styles.goBackContainer} onPress={handleGoBack}>
                    <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
                {friendsList.map((friend) => (
                    <TouchableOpacity key={friend.id} style={styles.friendContainer} onPress={() => handleFriendClick(friend)}>
                        <Image source={{uri: friend.profilePic}} style={styles.profilePic} />
                        <Text style={styles.friendName}>{friend.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    )
}

export default UserFriends

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    friendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    friendName: {
        color: '#fff',
        fontSize: 16,
    },
    goBackText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }, 
    goBackContainer: {
        padding: 10,
        backgroundColor: '#ff0000',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        margin: 16,
    }
});
