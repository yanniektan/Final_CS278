import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from './components/Header';
import { useUserContext } from '../../contexts/UserContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const Friends = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]); // [{uid: "uid", name: "name", bio: "bio"}, {uid: "uid", name: "name", bio: "bio"}
  const {handleUserSearch, fetchProfilePictureUri, setCurrFriend} = useUserContext()
  const handleSearch = async() => {
    const results = await handleUserSearch(searchText)
    console.log(results)
    setSearchResults(results)
  };

  const handleFriendClick = (friend) => {
    setCurrFriend(friend)
    navigation.navigate("FriendProfile")
  }

  return (
    <>
      <Header name="Add Friends" />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends"
            onChangeText={text => setSearchText(text)}
            value={searchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.friendsContainer}>
        {searchResults.map((friend) => {
          return (
            <TouchableOpacity style={styles.friendContainer} onPress={() => handleFriendClick(friend)}>
              {/* <Image source={profPicURI}></Image> */}
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendBio}>{friend.bio}</Text>
            </TouchableOpacity>
          )
        })}
        </View>
        {/* Render the list of friends here */}
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#000',
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: 16,
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: 16,
    
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#FFF',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  friendContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 8,
    width:  screenWidth,
  },
  friendName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  friendBio: {
    color: '#FFF',
    fontSize: 14,
  },
  friendsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
});

export default Friends;
