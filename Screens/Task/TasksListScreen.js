
import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';

import { TasksContext } from '../../Context/TaskProvider';
import SubjectItem from '../../Components/SubjectItem';


import { RewardsContext } from '../../Context/RewardsProvider';
import { useNavigation } from '@react-navigation/native';
import RewardItem from '../../Components/RewardItem';
import SearchBar from '../../Components/SearchBar';  // Importamos SearchBar
import DropdownComponent from '../../Components/Dropdown';  // Importamos DropdownCompone

import { filtradoDificultades } from '../../Utils/Constant';  // Importamos las dificultades

import { AuthContext } from '../../Context/AuthProvider';
import { PatientsContext } from '../../Context/PatientsProvider';

const TaskListScreen = ({ route }) => {

    const { tasks, fetchTasks } = useContext(TasksContext);

    const { rewards, fetchRewards } = useContext(RewardsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar la actualización
    const navigation = useNavigation();

    const { selectedPatientId } = useContext(PatientsContext);

    // useEffect(() => {
    //     const loadRewards = async () => {
    //         if (selectedPatientId) {
    //             setRefreshing(true);
    //             await fetchRewards(selectedPatientId);
    //             setRefreshing(false);
    //         }
    //     };

    //     loadRewards();
    // }, [selectedPatientId]); // Ejecuta este efecto cuando selectedPatientId cambie

    // Filtramos las recompensas en función del término de búsqueda y la dificultad seleccionada
    const filteredTasks = tasks.filter(tasks =>
        tasks.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || tasks.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTasks(selectedPatientId);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <Button
                title="Ver tareas de Otro Usuario"
                onPress={() => navigation.navigate('UserTasks')}
            />

            <SearchBar
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />
            <DropdownComponent
                data={filtradoDificultades}
                value={selectedDifficulty}
                setValue={setSelectedDifficulty}
                placeholder="Selecciona una dificultad"
            />
            <FlatList
                data={filteredTasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <SubjectItem
                        item={item}
                        onPress={() => navigation.navigate('RewardDetail', { rewardId: item.id, uid: selectedPatientId })}
                    />
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTask')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#d32f2f',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default TaskListScreen;