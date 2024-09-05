import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';

import { TasksContext } from '../../Context/TaskProvider';
import TaskItem from '../../Components/TaskItem';

import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../Components/SearchBar';  // Importamos SearchBar
import DropdownComponent from '../../Components/Dropdown';  // Importamos DropdownComponent
import PatientSelector from '../../Components/PatientSelector';

import { filtradoDificultades } from '../../Utils/Constant';  // Importamos las dificultades

import { AuthContext } from '../../Context/AuthProvider';
import { PatientsContext } from '../../Context/PatientsProvider';

const TaskListScreen = ({ route }) => {
    const { tasks, fetchTasks } = useContext(TasksContext);
    const { user, isPaciente, isLoading } = useContext(AuthContext);
    const { selectedPatientId } = useContext(PatientsContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    // Filtramos las recompensas en función del término de búsqueda y la dificultad seleccionada
    const auxTasks = tasks;
    const filteredTasks = auxTasks.filter(tasks =>
        tasks.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || tasks.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        if (isPaciente()) {
            console.log('INSIDDDEEE');
            await fetchTasks(user.uid);
        } else {
            if (selectedPatientId) {
                await fetchTasks(selectedPatientId);
            }
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
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PatientSelector />

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
