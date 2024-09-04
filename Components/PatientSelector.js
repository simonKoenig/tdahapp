// Components/PatientSelector.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropdownComponent from './Dropdown';
import LoadingScreen from './LoadingScreen';
import { PatientsContext } from '../Context/PatientsProvider';
import { AuthContext } from '../Context/AuthProvider';

const PatientSelector = () => {
    const { isPaciente } = useContext(AuthContext);
    const { patients, selectedPatientId, setSelectedPatientId, fetchPatients } = useContext(PatientsContext);
    const [loading, setLoading] = useState(true);

    
    // Si no hay pacientes cargados, se cargan
    useEffect(() => {
        const loadPatients = async () => {
            if (!patients.length && !isPaciente()) {
                console.log("CARGANDO PACIENTESSSSSSS")
                await fetchPatients();
            }
            setLoading(false);
        };
        loadPatients();
    }, [patients, fetchPatients]);
    
    // Si el usuario es un paciente, no renderizar el componente
    if (isPaciente()) {
        return null;
    }
    
    const handleSelectPatient = async (patientId) => {
        setSelectedPatientId(patientId);
        await Promise.all([
            //fetchSubjects(patientId),
            // fetchRewards(patientId),
            // fetchTasks(patientId),
        ]);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    const transformedPatients = patients.map(patient => ({
        label: patient.nombreApellido,
        value: patient.id,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Paciente</Text>
            <DropdownComponent
                data={transformedPatients}
                value={selectedPatientId}
                setValue={handleSelectPatient}
                placeholder="Selecciona un paciente"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
        paddingRight: 10,
    },
});

export default PatientSelector;