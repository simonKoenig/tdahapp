import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de que la ruta sea correcta

function ProfileScreen() {
    const { logout, isAuthenticated } = useContext(AuthContext);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigation.replace('Login'); // Utiliza replace en lugar de reset
        }
    }, [isAuthenticated, loading, navigation]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    <Text>ProfileScreen</Text>
                    <Button
                        title="Cerrar Sesión"
                        onPress={handleLogout} s
                    />
                </>
            )}
        </View>
    );
}

export default ProfileScreen;