import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert} from 'react-native'
import { useEffect, useState } from 'react'
import Header from './components/Header';
import { useUserContext } from '../../contexts/UserContext';
import { validateEmail } from './functions/validateEmail';

export default function Login({navigation}) {
    const [message, setMessage] = useState("");

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {user, signInUserEmail} = useUserContext()

    useEffect(() => {
        if (user) {
            navigation.navigate("Home")
        }
    }, [user])

    const handleSignupNavigation = () => {
        navigation.replace("Signup")
    }
    
    const handleSignInClick = () => {
        if (email != "" && password != "") {
            signInUserEmail(email, password)
        } else {
            Alert.alert("Please enter your email and password")
        }
    }
    
    return (
        <View style={styles.container}>
        <Header name="Login" />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputText}
                    placeholder="enter your email"
                    value={email}
                    onChangeText={setEmail}
                    onSubmitEditing={handleSignInClick}
                />
                <TextInput
                    style={styles.inputText}
                    placeholder="enter your password"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    onSubmitEditing={handleSignInClick}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSignInClick} ><Text style={styles.submitButtonText}>Login</Text></TouchableOpacity>
                <Text style={styles.createAccNavText}>Don't have an account? <Text style={styles.createAccNavTextEmph} onPress={handleSignupNavigation}>Create an account here!</Text></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#000'
    },
    inputContainer: {
        position: 'absolute',
        top: '40%',
        width: '100%',
    },
    inputText: {
        color: '#000',
        fontSize: 20,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        borderWidth: 0,
        marginBottom: 20,
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#ec0c0c',
        marginTop: 32,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 10,
        padding: 16,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    logoContainer: {
        paddingLeft: 12,
    },
    headerContainer: {
      backgroundColor: 'black',
      height: 100,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      paddingTop: 16,
    },
    headerText: {
      fontSize: 30,
      fontWeight: '400',
      color: '#fff',
      paddingLeft: 16,
    },
    createAccNavText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#fff',
      },
      createAccNavTextEmph: {
        fontWeight: 'bold',
      },
  });