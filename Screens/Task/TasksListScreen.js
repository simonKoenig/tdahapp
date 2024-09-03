import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';

import { TasksContext } from '../../Context/TaskProvider';
import SubjectItem from '../../Components/SubjectItem';
import TaskItem from '../../Components/TaskItem';


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
    const { user, isPaciente, isLoading } = useContext(AuthContext);
    const { selectedPatientId } = useContext(PatientsContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    // Unified effect for loading tasks and rewards


    // Filter tasks based on search term and selected difficulty
    const filteredTasks = tasks.filter(task =>
        task.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || task.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        if (isPaciente() && selectedPatientId) {
            await fetchTasks(selectedPatientId);
        }
        setRefreshing(false);
    };

    if (isPaciente()) {
        return (
            <View style={styles.container}>
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TaskItem
                            item={item}
                            onPress={() => {
                                const params = { taskId: item.id };
                                if (selectedPatientId) {
                                    params.uid = selectedPatientId;
                                }
                                navigation.navigate('TaskDetail', params);
                            }}
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
    }

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
                    <TaskItem
                        item={item}
                        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id, uid: selectedPatientId })}
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
