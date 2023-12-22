import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { useUserContext } from '../../contexts/UserContext'

const Requests = () => {
    const {user, userData, convertUIDToUserData, acceptRequest, rejectRequest} = useUserContext();
    const [requests, setRequests] = useState([]);
    const [updateTriggered, setUpdateTriggered] = useState(false);
    
    useEffect(() => {
        const convertIdsToUserData = async (requests) => {
            const reqs = []
            for (const request of requests) {
                const userObject = await convertUIDToUserData(request)
                if (userObject) {
                    reqs.push(userObject)
                }
            }
            setRequests(reqs)
        }
      if (userData && userData.requests) {
        convertIdsToUserData(userData.requests)
      }
    }, [userData])

    const handleAccept = async (uid, friendUid) => {
        await acceptRequest(uid, friendUid);
        const idx = requests.findIndex(request => request.uid === uid);
        setRequests(prevRequests => prevRequests.filter((request, index) => index !== idx));
        setUpdateTriggered(!updateTriggered);
    }
    
    const handleReject = async (uid, friendUid) => {
        await rejectRequest(uid, friendUid);
        const idx = requests.findIndex(request => request.uid === uid);
        setRequests(prevRequests => prevRequests.filter((request, index) => index !== idx));
        setUpdateTriggered(!updateTriggered);
    }
    
    
    return (
        <>
        <Header name="Requests" />
        <View style={styles.container}>
            <Text>Requests</Text>
            {requests.map((request, index) => (
                <View key={index} style={styles.requestContainer}>
                    <Text style={styles.requestText}>{request.name}</Text>
                    <View style={styles.flexRow}>
                    <TouchableOpacity 
                        onPress={() => handleAccept(user.uid, request.uid)} style={styles.acceptButton}
                    ><Text style={styles.acceptText}>Accept</Text></TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleReject(user.uid, request.uid)} style={styles.rejectButton}
                    ><Text style={styles.rejectText}>Reject</Text></TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
        </>
    )
}

export default Requests

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    acceptButton: {
        backgroundColor: 'darkgreen',
        padding: 8,
        borderRadius: 5,
        marginRight: 8,
    }, 
    rejectButton: {
        backgroundColor: '#ff0000',
        padding: 8,
        borderRadius: 5,
        marginLeft: 8,
    },
    acceptText: {
        fontWeight: 'bold',
        color: 'white',
    },
    rejectText: {
        fontWeight: 'bold',
        color: 'white',
    },
    requestContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        margin: 16,
        backgroundColor: '#444',
        borderRadius: 5,
    },
    requestText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
})
