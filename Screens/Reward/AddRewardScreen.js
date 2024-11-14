import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import DropdownComponent from '../../Components/Dropdown';
import { dificultades } from '../../Utils/Constant';
import LoadingScreen from '../../Components/LoadingScreen';
import Toast from 'react-native-toast-message';
import { globalStyles } from '../../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR } from '../../Utils/globalStyles';

import { RewardsContext } from '../../Context/RewardsProvider';
import { useNavigation } from '@react-navigation/native';
import { PatientsContext } from '../../Context/PatientsProvider';

function AddRewardScreen() {
    const [nombre, setNombre] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [errors, setErrors] = useState({});
    const { addReward } = useContext(RewardsContext);
    const { selectedPatientId } = useContext(PatientsContext);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const handleAddReward = async () => {
        // Reinicia los mensajes de error
        const newErrors = {};

        if (nombre.length === 0) {
            newErrors.nombre = 'El nombre de la recompensa es obligatorio';
        }

        if (dificultad.length === 0) {
            newErrors.dificultad = 'Debes seleccionar una dificultad';
        }

        // Verifica si hay errores
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Construye el mensaje para el lector de pantalla
            const accessibilityMessage = `Error al crear una recompensa. ${Object.values(newErrors).join('. ')}`;

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
            navigation.goBack();
            return;
        }

        try {
            setLoading(true);
            const result = await addReward({ nombre, dificultad }, selectedPatientId);
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
                    text2: 'Recompensa creada correctamente. Toca aquí para cerrar.',
                });
                navigation.goBack();
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Ocurrió un error al crear la recompensa. Toca aquí para cerrar.',
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
                placeholder='Nombre de la recompensa'
                value={nombre}
                onChangeText={(text) => {
                    setNombre(text);
                    setErrors((prevErrors) => ({ ...prevErrors, nombre: '' })); // Elimina el mensaje de error si el usuario escribe algo
                }}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            />
            {errors.nombre ? (
                <Text style={styles.errorText}>
                    {errors.nombre}
                </Text>
            ) : null}

            <Text style={globalStyles.label}>Dificultad</Text>
            <DropdownComponent
                data={dificultades}
                value={dificultad}
                setValue={(value) => {
                    setDificultad(value);
                    setErrors((prevErrors) => ({ ...prevErrors, dificultad: '' })); // Elimina el mensaje de error si el usuario selecciona algo
                }}
                placeholder="Selecciona una dificultad"
                searchActivo={false}
                width='80%'
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            />
            {errors.dificultad ? (
                <Text style={styles.errorText}>
                    {errors.dificultad}
                </Text>
            ) : null}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={handleAddReward}>
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

export default AddRewardScreen;
