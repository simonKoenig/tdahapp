import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import Toast from 'react-native-toast-message';
import { globalStyles } from '../../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR } from '../../Utils/globalStyles';

import { SubjectsContext } from '../../Context/SubjectsProvider';
import { useNavigation } from '@react-navigation/native';
import { PatientsContext } from '../../Context/PatientsProvider';

function AddSubjectScreen() {
    const [nombre, setNombre] = useState('');
    const [profesor, setProfesor] = useState('');
    const [nombreError, setNombreError] = useState('');
    const [profesorError, setProfesorError] = useState('');
    const { addSubject } = useContext(SubjectsContext);
    const { selectedPatientId } = useContext(PatientsContext);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const handleAddSubject = async () => {
        // Reinicia los mensajes de error
        setNombreError('');
        setProfesorError('');

        let hasError = false;
        const errors = []; // Array para almacenar mensajes de error

        if (nombre.length === 0) {
            const errorMsg = 'El nombre de la materia es obligatorio';
            setNombreError(errorMsg);
            errors.push(errorMsg); // Añade el mensaje al array
            hasError = true;
        }

        if (profesor.length === 0) {
            const errorMsg = 'El nombre del profesor es obligatorio';
            setProfesorError(errorMsg);
            errors.push(errorMsg); // Añade el mensaje al array
            hasError = true;
        }

        // Imprime todos los errores en la consola si existen
        if (hasError) {
            // Construye el mensaje para el lector de pantalla
            const accessibilityMessage = `Error al crear una materia. ${errors.join('. ')}`;

            // Anuncia el mensaje para TalkBack o VoiceOver
            AccessibilityInfo.announceForAccessibility(accessibilityMessage);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Por favor, corrige los errores en el formulario.',
            });
            return;
        }

        if (!selectedPatientId) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se ha seleccionado un estudiante. Toca aquí para cerrar.',
            });
            return;
        }

        try {
            setLoading(true);
            const result = await addSubject({ nombre, profesor }, selectedPatientId);
            if (result?.error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `${result.error} Toca aquí para cerrar.`,
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Materia creada correctamente. Toca aquí para cerrar.',
                });
                navigation.goBack();
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Ocurrió un error al crear la materia. Toca aquí para cerrar.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.form}>
            <Text style={globalStyles.label}>Nombre</Text>
            <TextInput
                style={[globalStyles.input, nombreError && styles.errorInput]}
                placeholder='Nombre de nueva materia'
                value={nombre}
                onChangeText={(text) => {
                    setNombre(text);
                    if (text) setNombreError(''); // Elimina el mensaje de error si el usuario escribe algo
                }}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                accessibilityLabel="Campo de nombre de la materia"
            />
            {nombreError ? (
                <Text
                    style={styles.errorText}
                >
                    {nombreError}
                </Text>
            ) : null}

            <Text style={globalStyles.label}>Profesor</Text>
            <TextInput
                style={[globalStyles.input, profesorError && styles.errorInput]}
                placeholder='Nombre del profesor'
                value={profesor}
                onChangeText={(text) => {
                    setProfesor(text);
                    if (text) setProfesorError(''); // Elimina el mensaje de error si el usuario escribe algo
                }}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                accessibilityLabel="Campo de nombre del profesor"
            />
            {profesorError ? (
                <Text
                    style={styles.errorText}
                >
                    {profesorError}
                </Text>
            ) : null}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={handleAddSubject}>
                    <Text style={globalStyles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    errorInput: {
        borderColor: 'red',
        borderWidth: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 10,
        marginTop: -5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },

});

export default AddSubjectScreen;
