import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropdownComponent from '../../Components/Dropdown';
import { dificultades } from '../../Utils/Constant';
import LoadingScreen from '../../Components/LoadingScreen';
import Toast from 'react-native-toast-message';


import { RewardsContext } from '../../Context/RewardsProvider';
import { useNavigation } from '@react-navigation/native';
import { PatientsContext } from '../../Context/PatientsProvider';

function AddRewardScreen() {
    const [nombre, setNombre] = useState('');
    const [dificultad, setDificultad] = useState('');
    const { addReward } = useContext(RewardsContext);
    const { selectedPatientId } = useContext(PatientsContext);
    const [loading, setLoading] = useState(true); 

    const navigation = useNavigation();

    
    const handleAddReward = async () => {
        if (!selectedPatientId) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se ha seleccionado un paciente. Toca aquí para cerrar.',
            });
            navigation.goBack(); 
            return;
        }
        try {
            setLoading(true);
            const result =  await addReward({ nombre, dificultad }, selectedPatientId);
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

    }

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombre de nueva tarea'
                value={nombre}
                onChangeText={setNombre}
            />
            <Text style={styles.label}>Dificultad</Text>
            <DropdownComponent
                data={dificultades}
                value={dificultad}
                setValue={setDificultad}
                placeholder="Selecciona una dificultad"
                searchActivo={false}
                width='80%'
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddReward}>
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

export default AddRewardScreen;