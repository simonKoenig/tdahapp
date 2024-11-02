import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropdownComponent from './Dropdown';
import LoadingScreen from './LoadingScreen';
import { PatientsContext } from '../Context/PatientsProvider';
import { AuthContext } from '../Context/AuthProvider';
import { globalStyles } from '../Utils/globalStyles';

const PatientSelector = () => {
    const { isPaciente } = useContext(AuthContext);
    const { patients, selectedPatientId, setSelectedPatientId, fetchPatients, addPatientByEmail, deletePatient } = useContext(PatientsContext);
    const [loading, setLoading] = useState(true);
    const [needsUpdate, setNeedsUpdate] = useState(true); // Estado para controlar la necesidad de actualización

    useEffect(() => {
        const loadPatients = async () => {
            if (needsUpdate && !isPaciente()) {
                console.log('CARGANDO PACIENTESSSSSSS');
                await fetchPatients();
                setNeedsUpdate(false); // Restablecer el estado después de cargar los pacientes
                setLoading(false);
            }
        };
        loadPatients();
    }, [needsUpdate]);

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

    const handleAddPatient = async (email) => {
        await addPatientByEmail(email);
        setNeedsUpdate(true); // Establecer la necesidad de actualización después de agregar un paciente
    };

    const handleDeletePatient = async (patientId) => {
        await deletePatient(patientId);
        setNeedsUpdate(true); // Establecer la necesidad de actualización después de eliminar un paciente
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
            <Text style={styles.label}>Estudiante</Text>
            <View style={styles.dropdownWrapper}>
                <DropdownComponent
                    data={transformedPatients}
                    value={selectedPatientId}
                    setValue={handleSelectPatient}
                    placeholder="Selecciona un estudiante"
                    onAdd={handleAddPatient} // Pasar la función de agregar paciente al componente Dropdown
                    onDelete={handleDeletePatient} // Pasar la función de eliminar paciente al componente Dropdown
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 5,
        paddingRight: 10,
        fontFamily: 'AtkinsonHyperlegible_400Regular',

    },
    dropdownWrapper: {
        flex: 1, // Toma todo el espacio disponible después del label
    },
});

export default PatientSelector;
