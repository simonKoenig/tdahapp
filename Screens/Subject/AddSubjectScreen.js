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
    const [errors, setErrors] = useState({});
    const { addSubject } = useContext(SubjectsContext);
    const { selectedPatientId } = useContext(PatientsContext);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const handleAddSubject = async () => {

        const newErrors = {};

        if (nombre.length === 0) {
            newErrors.nombre = 'El nombre de la materia es obligatorio';
        }

        if (profesor.length === 0) {
            newErrors.profesor = 'El nombre del profesor es obligatorio';
        }

        // Verifica si hay errores
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Construye el mensaje para el lector de pantalla
            const accessibilityMessage = `Error al crear una materia. ${Object.values(newErrors).join('. ')}`;

            // Anuncia el mensaje para TalkBack o VoiceOver
            AccessibilityInfo.announceForAccessibility(accessibilityMessage);

            // Muestra un Toast general
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Por favor, completa los campos vacíos del formulario.',
            });
            return;
        } else {
            setErrors({});
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
                style={[globalStyles.input, errors.nombre && styles.errorInput]}
                placeholder='Nombre de la materia'
                value={nombre}
                onChangeText={(text) => {
                    setNombre(text);
                    setErrors((prevErrors) => ({ ...prevErrors, nombre: '' }));
                }}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                accessibilityLabel="Campo de nombre de la materia"
            />
            {errors.nombre ? (
                <Text style={styles.errorText}>
                    {errors.nombre}
                </Text>
            ) : null}

            <Text style={globalStyles.label}>Profesor</Text>
            <TextInput
                style={[globalStyles.input, errors.profesor && styles.errorInput]}
                placeholder='Nombre del profesor'
                value={profesor}
                onChangeText={(text) => {
                    setProfesor(text);
                    setErrors((prevErrors) => ({ ...prevErrors, profesor: '' }));
                }}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                accessibilityLabel="Campo de nombre del profesor"
            />
            {errors.profesor ? (
                <Text style={styles.errorText}>
                    {errors.profesor}
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
