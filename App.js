import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Login, Profile, Signup, Settings, Preview, CameraScreen, Requests, UserFriends, FriendProfile, FrontCameraScreen, Friends } from './screens';
import { UserContextProvider } from './contexts/UserContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserContextProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
        <Stack.Screen name="Preview" component={Preview} options={{ headerShown: false }}/>
        <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="FrontCamera" component={FrontCameraScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Friends" component={Friends} options={{ headerShown: false }}/>
        <Stack.Screen name="FriendProfile" component={FriendProfile} options={{ headerShown: false }}/>
        <Stack.Screen name="Requests" component={Requests} options={{ headerShown: false }}/>
        <Stack.Screen name="UserFriends" component={UserFriends} options={{ headerShown: false }}/>
      </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
