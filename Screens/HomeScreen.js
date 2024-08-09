import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../Context/AuthProvider';

function HomeScreen() {
    const { user } = useContext(AuthContext);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            {user && <Text>Email: {user.email}</Text>}
            {user && <Text>UID: {user.uid}</Text>}
            {user && <Text> {user.displayName}</Text>}
            {user && user.role}
            {user && user.metadata.creationTime}
            {user && user.emailVerified}


        </View>
    );
}

export default HomeScreen;