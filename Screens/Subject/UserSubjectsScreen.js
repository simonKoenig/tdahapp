import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SubjectsContext } from '../../Context/SubjectsProvider';
import { PatientsContext } from '../../Context/PatientsProvider';
import LoadingScreen from '../../Components/LoadingScreen';
import DropdownComponent from '../../Components/Dropdown';

import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';


const UserSubjectsScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const { patients, setSelectedPatientId, addPatientByEmail, selectedPatientId, fetchPatients } = useContext(PatientsContext);
    const { fetchSubjects, userSubject, setSubjects } = useContext(SubjectsContext);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar la actualización



    const handleSelectPatient = async (patientId) => {
        const subjects = await fetchSubjects(patientId);
        setSubjects(subjects);
        console.log('User subjects:', subjects); // Imprimir recompensas por consola
        navigation.navigate('SubjectsList');
    };

    console.log('Patients:', patients);
    const transformedPatients = patients.map(patient => ({
        label: patient.nombreApellido,
        value: patient.id,
    }));

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchSubjects(selectedPatientId);
        setRefreshing(false);
    };



    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {patients.length > 0 ? (
                    <DropdownComponent
                        data={transformedPatients}
                        value={selectedPatientId}
                        setValue={setSelectedPatientId}
                        placeholder="Seleccione un estudiante"
                        onSelect={handleSelectPatient} // Pasar handleSelectPatient como prop
                    />
                ) : (
                    <Text style={styles.noPatientsText}>No se encontraron estudiantes.</Text>
                )}
                {loading && <LoadingScreen />}
                {typeof errorMessage === 'string' && errorMessage.length > 0 && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4c669f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    noRewardsText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    patientItem: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    errorContainer: {
        marginVertical: 8,
        padding: 10,
        backgroundColor: '#fee',
        borderRadius: 5,
    },

    errorMessage: {
        color: 'red',
        fontSize: 16,
        marginTop: 16,
    },

});

export default UserSubjectsScreen;