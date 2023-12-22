import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import { useUserContext } from '../../contexts/UserContext';
import { validateEmail } from './functions/validateEmail';

export default function Signup({navigation}) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {user, registerUser, initializeUserData} = useUserContext();
    useEffect(() => {
        if (user) {
            navigation.replace("Home");
        }
    }, [user]);

    const handleLoginNavigation = () => {
        navigation.navigate("Login");
    };
    
    const handleSignupClick = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
        } else if (name === "") {
            Alert.alert("Please enter your name");
        } else if (validateEmail(email)) {
            const uid = await registerUser(name, email, password);
            if (uid) {
                initializeUserData(name, uid, email);
            }
        } else {
            Alert.alert("Please enter a valid email address");
        }
    };
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Header name="Signup" />
            <ScrollView contentContainerStyle={styles.inputContainer}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.inputText}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSignupClick}>
                    <Text style={styles.submitButtonText}>Sign up</Text>
                </TouchableOpacity>
                <Text style={styles.createAccNavText}>Already have an account? 
                    <Text style={styles.createAccNavTextEmph} onPress={handleLoginNavigation}> Login here!</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    inputContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    inputText: {
        color: '#000',
        fontSize: 20,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
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
    createAccNavText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#fff',
    },
    createAccNavTextEmph: {
        fontWeight: 'bold',
        color: '#ec0c0c',
    },
});