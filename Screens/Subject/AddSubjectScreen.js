import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { addSubject } from '../../Context/SubjectsProvider';




import { SubjectsContext } from '../../Context/SubjectsProvider';
import { useNavigation } from '@react-navigation/native';
import { PatientsContext } from '../../Context/PatientsProvider';

function AddSubjectScreen() {
    const [nombre, setNombre] = useState('');
    const [profesor, setProfesor] = useState('');
    const { addSubject } = useContext(SubjectsContext);
    const { selectedPatientId } = useContext(PatientsContext);

    const navigation = useNavigation();

    const handleAddSubject = async () => {
        if (selectedPatientId) {
            await addSubject({ nombre, profesor }, selectedPatientId); // Pasa el UID del paciente seleccionado
            navigation.goBack();
        } else {
            console.error('No patient selected');
        }
    };
    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombre de nueva materia'
                value={nombre}
                onChangeText={setNombre}
            />
            <Text style={styles.label}>Profesor</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombre del profesor de la materia'
                value={profesor}
                onChangeText={setProfesor}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddSubject}>
                    <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    label: {
        width: '80%',
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
        textAlign: 'left', // Alinea el texto a la izquierda
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#D9D9D9',
    },
    dropdown: {
        width: '80%',
        height: 40,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: '#D9D9D9',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        flex: 1,
        height: 50,
        backgroundColor: '#4c669f',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default AddSubjectScreen;