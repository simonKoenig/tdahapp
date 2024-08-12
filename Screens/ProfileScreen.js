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

// import React, { useContext, useEffect, useState, useCallback } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Button, SafeAreaView } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { AuthContext } from '../Context/AuthProvider';
// import { PatientsContext } from '../Context/PatientsProvider';
// import DropdownComponent from '../Components/Dropdown';

// const ProfileScreen = () => {
//     const { logout, user } = useContext(AuthContext);
//     const { getPatientsByUser } = useContext(PatientsContext);
//     const navigation = useNavigation();
//     const [patients, setPatients] = useState([]);
//     const [selectedPatient, setSelectedPatient] = useState(null);

//     const fetchPatients = async () => {
//         if (user && user.uid) {
//             const patientsList = await getPatientsByUser(user.uid);
//             const formattedPatients = patientsList.map(patient => ({
//                 label: patient.nombreApellido,
//                 value: patient.patientId,
//             }));
//             setPatients(formattedPatients);
//         }
//     };

//     useEffect(() => {
//         fetchPatients();
//     }, [user]);

//     // useFocusEffect se utiliza para actualizar los pacientes cuando la pantalla se enfoca
//     useFocusEffect(
//         useCallback(() => {
//             fetchPatients();
//         }, [])
//     );

//     const handleLogout = async () => {
//         await logout();
//         navigation.navigate('Login');
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={styles.container}>
//                 <Text style={styles.title}>Lista de Pacientes</Text>

//                 {/* Dropdown para seleccionar paciente */}
//                 <DropdownComponent
//                     data={patients}
//                     value={selectedPatient}
//                     setValue={setSelectedPatient}
//                     placeholder="Seleccione un paciente"
//                 />

//                 {/* Botón para agregar paciente */}
//                 <TouchableOpacity
//                     style={styles.addButton}
//                     onPress={() => navigation.navigate('AddPatient')}
//                 >
//                     <Text style={styles.addButtonText}>Agregar Paciente</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.logoutContainer}>
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
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 16,
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 20,
//     },
// });

// export default ProfileScreen;


import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';
import { PatientsContext } from '../Context/PatientsProvider';
import { RewardsContext } from '../Context/RewardsProvider'; // <-- Importa el contexto de recompensas
import DropdownComponent from '../Components/Dropdown';

const ProfileScreen = () => {
    const { logout, user } = useContext(AuthContext);
    const { getPatientsByUser, setSelectedPatientId } = useContext(PatientsContext);
    const { fetchRewards } = useContext(RewardsContext); // <-- Utiliza fetchRewards
    const navigation = useNavigation();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const { role } = useContext(AuthContext);

    const fetchPatients = async () => {
        if (user && user.uid) {
            const patientsList = await getPatientsByUser(user.uid);
            const formattedPatients = patientsList.map(patient => ({
                label: patient.nombreApellido,
                value: patient.patientId,
            }));
            setPatients(formattedPatients);
        }
    };

    useEffect(() => {
        if (selectedPatient) {
            setSelectedPatientId(selectedPatient);
            fetchRewards(selectedPatient); // <-- Llama a fetchRewards cada vez que cambia el paciente seleccionado
        }
    }, [selectedPatient, setSelectedPatientId, fetchRewards]);

    // useFocusEffect se utiliza para actualizar los pacientes cuando la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            fetchPatients();
        }, [])
    );

    const handleLogout = async () => {
        await logout();
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {role === 'administrador' && (
                <React.Fragment>

                    <View style={styles.container}>
                        <Text style={styles.title}>Lista de Pacientes</Text>

                        {/* Dropdown para seleccionar paciente */}
                        <DropdownComponent
                            data={patients}
                            value={selectedPatient}
                            setValue={setSelectedPatient}
                            placeholder="Seleccione un paciente"
                        />

                        {/* Botón para agregar paciente */}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate('AddPatient')}
                        >
                            <Text style={styles.addButtonText}>Agregar Paciente</Text>
                        </TouchableOpacity>
                    </View>
                </React.Fragment>
            )}

            <View style={styles.logoutContainer}>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default ProfileScreen;
