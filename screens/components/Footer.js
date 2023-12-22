import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { Dimensions } from 'react-native';
import HomeLogo from '../../assets/home.png'
import ProfileLogo from '../../assets/profile.png'
import CreateLogo from '../../assets/create.png'
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

const Footer = (props) => {
    const handleProfileClick = () => {
        props.navigateProfile();
        console.log("clicked")
    }
    const handlePostClick = () => {
        props.navigateCamera();
    }

    const handleHomeClick = () => {
        props.navigateHome();

    }
    return (
        <LinearGradient 
        colors={['#00000000', '#00000000']} 
        style={styles.container}>
        <TouchableOpacity onPress={handleHomeClick} style={styles.iconContainer}>
            <Image source={HomeLogo} style={{width: 30, height: 30}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePostClick} style={styles.iconContainer}>
            <Image source={CreateLogo} style={{width: 55, height: 55}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfileClick} style={styles.iconContainer}>
            <Image source={ProfileLogo} style={{width: 30, height: 30}} />
        </TouchableOpacity>
    </LinearGradient>
      )
    }
    
    export default Footer

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'black',
        marginBottom: '10%',
    },
    iconText: {
        color: '#fff',
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
})