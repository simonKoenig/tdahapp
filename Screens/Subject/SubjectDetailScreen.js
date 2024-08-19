import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';



import { SubjectsContext } from '../../Context/SubjectsProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingScreen from '../../Components/LoadingScreen'; // Importar LoadingScreen
import { PatientsContext } from '../../Context/PatientsProvider';

function SubjectDetailScreen() {
    const route = useRoute();
    const { subjectId, uid } = route.params;
    const [nombre, setNombre] = useState('');
    const [profesor, setProfesor] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carga
    const { getSubject, updateSubject, deleteSubject } = useContext(SubjectsContext);
    const navigation = useNavigation();
    const { selectedPatientId } = useContext(PatientsContext);

    console.log('Subject ID:', subjectId);
    console.log('UID:', uid);
    console.log('Selected Patient ID:', selectedPatientId);

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
        try {
            await updateSubject(subjectId, { nombre, profesor }, selectedPatientId);
            navigation.goBack();

        } catch (error) {
            console.error('Error updating reward:', error);
        }
    };

    const handleDeleteSubject = async () => {
        try {
            await deleteSubject(subjectId, selectedPatientId);
            navigation.goBack();


        } catch (error) {
            console.error('Error deleting reward:', error);
        }
    };

    if (loading) {
        return <LoadingScreen />; // Mostrar pantalla de carga
    }

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombre de la tarea'
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
                <TouchableOpacity style={styles.button} onPress={handleUpdateSubject}>
                    <Text style={styles.buttonText}>Actualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDeleteSubject}>
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