import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../Context/AuthProvider';
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        await logout();
        // navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión
        navigation.navigate('Login');
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>ProfileScreen</Text>
            <Button
                title="Cerrar Sesión"
                onPress={handleLogout}
            />
        </View>
    );
}

export default ProfileScreen;