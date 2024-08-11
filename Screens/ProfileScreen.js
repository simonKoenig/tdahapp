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

// import React, { useContext } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Button, SafeAreaView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../Context/AuthProvider';

// const ProfileScreen = () => {
//     const { logout } = useContext(AuthContext);
//     const navigation = useNavigation();

//     const handleLogout = async () => {
//         await logout();
//         navigation.navigate('Login');
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={styles.container}>
//                 {/* ... existing profile details */}
//                 <TouchableOpacity
//                     style={styles.addButton}
//                     onPress={() => navigation.navigate('AddPatient')}
//                 >
//                     <Text style={styles.addButtonText}>Agregar Paciente</Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.logoutContainer}>
//                 <Text style={styles.title}>ProfileScreen</Text>
//                 <Button
//                     title="Cerrar Sesión"
//                     onPress={handleLogout}
//                 />
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#ffffff',
//     },
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 16,
//     },
//     addButton: {
//         backgroundColor: '#4c669f',
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 20,
//     },
//     addButtonText: {
//         color: '#fff',
//         fontSize: 18,
//     },
//     logoutContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 16,
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 20,
//     },
// });

// export default ProfileScreen;

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';
import { PatientsContext } from '../Context/PatientsProvider';

const ProfileScreen = () => {
    const { logout, user } = useContext(AuthContext);
    const { getPatientsByUser } = useContext(PatientsContext);
    const navigation = useNavigation();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            if (user && user.uid) {
                console.log('Fetching patients for user:', user.uid);
                const patientsList = await getPatientsByUser(user.uid);
                console.log('Fetched patients:', patientsList);
                setPatients(patientsList);
            } else {
                console.log('User UID is not available');
            }
        };

        fetchPatients();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Lista de Pacientes</Text>
                <FlatList
                    data={patients}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.patientItem}>
                            <Text style={styles.patientInfo}>Nombre: {item.nombreApellido}</Text>
                            <Text style={styles.patientInfo}>Email: {item.email}</Text>
                            <Text style={styles.patientInfo}>Rol: {item.rol}</Text>
                            <Text style={styles.patientId}>ID: {item.id}</Text>
                            <Text style={styles.patientId}>Patient ID: {item.patientId}</Text>
                        </View>
                    )}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddPatient')}
                >
                    <Text style={styles.addButtonText}>Agregar Paciente</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.logoutContainer}>
                <Text style={styles.title}>ProfileScreen</Text>
                <Button
                    title="Cerrar Sesión"
                    onPress={handleLogout}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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
    logoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    patientItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    patientInfo: {
        fontSize: 18,
    },
    patientId: {
        fontSize: 16,
        color: '#666',
    },
});

export default ProfileScreen;