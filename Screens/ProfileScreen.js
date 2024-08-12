import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';
import { PatientsContext } from '../Context/PatientsProvider';
import { RewardsContext } from '../Context/RewardsProvider'; // <-- Importa el contexto de recompensas
import DropdownComponent from '../Components/Dropdown';



const ProfileScreen = () => {
    const { logout, user } = useContext(AuthContext);
    const { fetchPatients, setSelectedPatientId } = useContext(PatientsContext);

    const { fetchRewards } = useContext(RewardsContext); // <-- Utiliza fetchRewards
    const navigation = useNavigation();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const { role } = useContext(AuthContext);

    const fetchPatientsForUser = async () => {
        if (user && user.uid) {
            const patientsList = await fetchPatients(user.uid);
            const formattedPatients = patientsList.map(patient => ({
                label: patient.nombreApellido,
                value: patient.patientId,
            }));
            setPatients(formattedPatients);
        }
    };

    useEffect(() => {
        fetchPatientsForUser();
    }, [user]);

    //En ProfileScreen, cuando un usuario selecciona un paciente de la lista desplegable, 
    //el estado selectedPatient se actualiza con el valor seleccionado, y luego este valor se usa para actualizar selectedPatientId en PatientsContext.
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
