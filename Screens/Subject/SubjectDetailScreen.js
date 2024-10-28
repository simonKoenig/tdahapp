import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR } from '../../Utils/globalStyles';



import { SubjectsContext } from '../../Context/SubjectsProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingScreen from '../../Components/LoadingScreen'; // Importar LoadingScreen
import { PatientsContext } from '../../Context/PatientsProvider';

import { showConfirmAlert } from '../../Utils/showConfirmAlert';
import Toast from 'react-native-toast-message';

function SubjectDetailScreen() {
    const route = useRoute();
    const { subjectId, uid } = route.params;
    const [nombre, setNombre] = useState('');
    const [profesor, setProfesor] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carga
    const { getSubject, updateSubject, deleteSubject } = useContext(SubjectsContext);
    const navigation = useNavigation();
    const { selectedPatientId } = useContext(PatientsContext);


    useEffect(() => {
        const fetchSubjects = async () => {
            try {

                const subject = await getSubject(subjectId, uid); // Asegúrate de pasar el UID correcto

                if (subject) {
                    setNombre(subject.nombre);
                    setProfesor(subject.profesor);
                } else {
                    console.error('Reward not found');
                }
            } catch (error) {
                console.error('Error fetching reward:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [subjectId, uid]);



    const handleUpdateSubject = async () => {
        showConfirmAlert({
            title: "Confirmar actualización",
            message: `¿Estás seguro que deseas actualizar la tarea "${nombre}"?`,
            confirmText: "Confirmar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    setLoading(true);
                    const result = await updateSubject(subjectId, { nombre, profesor }, selectedPatientId);
                    if (result?.error) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: `${result.error} Toca aquí para cerrar.`,
                        });
                        console.log('Error en handleDeletePatient:', result.error);
                    } else {
                        Toast.show({
                            type: 'success',
                            text1: 'Éxito',
                            text2: 'Materia actualizada correctamente. Toca aquí para cerrar.',
                        });
                        navigation.goBack();
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Ocurrió un error al actualizar la materia. Toca aquí para cerrar.',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    }

    const handleDeleteSubject = () => {

        showConfirmAlert({
            title: "Confirmar eliminación",
            message: `¿Estás seguro que deseas eliminar la materia "${nombre}"?`,
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    setLoading(true);
                    const result = await deleteSubject(subjectId, selectedPatientId);
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
                            text2: 'Materia eliminada correctamente. Toca aquí para cerrar.',
                        });
                        navigation.goBack();
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Ocurrió un error al eliminar la tarea. Toca aquí para cerrar.',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (loading) {
        return <LoadingScreen />; // Mostrar pantalla de carga
    }

    return (
        <View style={globalStyles.form}>
            <Text style={globalStyles.label}>Nombre</Text>
            <TextInput
                style={globalStyles.input}
                placeholder='Nombre de la tarea'
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                value={nombre}
                onChangeText={setNombre}
            />
            <Text style={globalStyles.label}>Profesor</Text>
            <TextInput
                style={globalStyles.input}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                placeholder='Nombre del profesor de la materia'
                value={profesor}
                onChangeText={setProfesor}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[globalStyles.button, { flex: 1, marginRight: 10 }]} onPress={handleUpdateSubject}>
                    <Text style={globalStyles.buttonText}>Actualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={handleDeleteSubject}>
                    <Text style={styles.buttonText}>Eliminar</Text>
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
        textAlign: 'left',
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

export default SubjectDetailScreen;