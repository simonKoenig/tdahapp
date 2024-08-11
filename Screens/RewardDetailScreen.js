import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropdownComponent from '../Components/Dropdown';
import { dificultades } from '../Utils/Constant';
import { RewardsContext } from '../Context/RewardsProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingScreen from '../Components/LoadingScreen'; // Importar LoadingScreen

function RewardDetailScreen() {
    const route = useRoute();
    const { rewardId } = route.params;
    const [nombre, setNombre] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carga
    const { getReward, updateReward, deleteReward } = useContext(RewardsContext);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchReward = async () => {
            try {
                const reward = await getReward(rewardId);
                setNombre(reward.nombre);
                setDificultad(reward.dificultad);
            } catch (error) {
                console.error('Error fetching reward:', error);
            } finally {
                setLoading(false); // Finalizar carga
            }
        };
        fetchReward();
    }, [rewardId]);

    const handleUpdateReward = async () => {
        await updateReward(rewardId, { nombre, dificultad });
        navigation.goBack();
    };

    const handleDeleteReward = async () => {
        await deleteReward(rewardId);
        navigation.goBack();
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