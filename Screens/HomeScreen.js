import React, { useContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../Context/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function HomeScreen() {
    const { user } = useContext(AuthContext);
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const docRef = doc(db, 'usuarios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRole(docSnap.data().rol);
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUserRole();
    }, [user]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            {user && <Text>Email: {user.email}</Text>}
            {user && <Text>UID: {user.uid}</Text>}
            {user && <Text> {user.displayName}</Text>}
            {user && <Text>Nombre y Apellido: {user.nombreApellido}</Text>}
            {user && <Text>Creation Time: {user.metadata?.creationTime || 'No creation time available'}</Text>}
            {user && <Text>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</Text>}
            {user && <Text>Rol: {role}</Text>}
        </View>
    );
}

export default HomeScreen;