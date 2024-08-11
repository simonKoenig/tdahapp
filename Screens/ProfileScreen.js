// import React, { useContext } from 'react';
// import { View, Text, Button } from 'react-native';
// import { AuthContext } from '../Context/AuthProvider';
// import { useNavigation } from '@react-navigation/native';

// function ProfileScreen() {
//     const { logout } = useContext(AuthContext);
//     const navigation = useNavigation();

//     const handleLogout = async () => {
//         await logout();
//         // navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión
//         navigation.navigate('Login');
//     };

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>ProfileScreen</Text>
//             <Button
//                 title="Cerrar Sesión"
//                 onPress={handleLogout}
//             />
//         </View>
//     );
// }

// export default ProfileScreen;

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';


const ProfileScreen = () => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        await logout();
        // navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión
        navigation.navigate('Login');
    };

    return (
        <View>
            <View style={styles.container}>
                {/* ... existing profile details */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddPatient')}
                >
                    <Text style={styles.addButtonText}>Agregar Paciente</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>ProfileScreen</Text>
                <Button
                    title="Cerrar Sesión"
                    onPress={handleLogout}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#4c669f',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ProfileScreen;