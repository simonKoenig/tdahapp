import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropdownComponent from '../../Components/Dropdown';
import { dificultades } from '../../Utils/Constant';
import { RewardsContext } from '../../Context/RewardsProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingScreen from '../../Components/LoadingScreen'; // Importar LoadingScreen
import { PatientsContext } from '../../Context/PatientsProvider';

function RewardDetailScreen() {
    const route = useRoute();
    const { rewardId, uid } = route.params;
    const [nombre, setNombre] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carga
    const { getReward, updateReward, deleteReward } = useContext(RewardsContext);
    const navigation = useNavigation();
    const { selectedPatientId } = useContext(PatientsContext);


    useEffect(() => {
        const fetchReward = async () => {
            try {
                console.log('Fetching reward details for ID:', rewardId);
                const reward = await getReward(rewardId, uid); // Asegúrate de pasar el UID correcto
                if (reward) {
                    setNombre(reward.nombre);
                    setDificultad(reward.dificultad);
                } else {
                    console.error('Reward not found');
                }
            } catch (error) {
                console.error('Error fetching reward:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReward();
    }, [rewardId, uid]);

    const handleUpdateReward = async () => {
        try {
            await updateReward(rewardId, { nombre, dificultad }, selectedPatientId);
            navigation.goBack();

        } catch (error) {
            console.error('Error updating reward:', error);
        }
    };

    const handleDeleteReward = async () => {
        try {
            await deleteReward(rewardId, selectedPatientId);
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
            <Text style={styles.label}>Dificultad</Text>
            <DropdownComponent
                data={dificultades}
                value={dificultad}
                setValue={setDificultad}
                placeholder="Selecciona una dificultad"
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleUpdateReward}>
                    <Text style={styles.buttonText}>Actualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDeleteReward}>
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

export default RewardDetailScreen;