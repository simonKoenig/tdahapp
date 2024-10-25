import React, { useContext, useState, useEffect } from 'react';
import { View, SectionList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TasksContext } from '../../Context/TaskProvider';
import TaskItem from '../../Components/TaskItem';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../Components/SearchBar';
import DropdownComponent from '../../Components/Dropdown';
import PatientSelector from '../../Components/PatientSelector';
import { filtradoDificultades } from '../../Utils/Constant';
import { AuthContext } from '../../Context/AuthProvider';
import { PatientsContext } from '../../Context/PatientsProvider';
import LoadingScreen from '../../Components/LoadingScreen'; // Importar tu componente de loading

// Import moment para formatear la fecha y mostrarla en español
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

// Obtén la fecha de hoy
const fechaHoy = moment().format('LL'); // Formato de fecha larga

const TaskListScreen = ({ route }) => {
    const { tasks = [], fetchTasks } = useContext(TasksContext); // Valor predeterminado para tasks
    const { user, isPaciente, isLoading } = useContext(AuthContext);
    const { selectedPatientId } = useContext(PatientsContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(true);
    const [loading, setLoading] = useState(false); // Estado para mostrar el loading
    const navigation = useNavigation();

    useEffect(() => {
        const loadTasks = async () => {
            if (selectedPatientId) {
                setLoading(true); // Mostrar loading cuando se selecciona un paciente
                await fetchTasks(selectedPatientId); // Cargar tareas del paciente
                setLoading(false); // Desactivar loading cuando terminen de cargarse
            }
        };
        loadTasks();
    }, [selectedPatientId]);

    const handleRefresh = async () => {
        if (selectedPatientId) {
            setRefreshing(true);
            await fetchTasks(selectedPatientId);
            setRefreshing(false);
        }
    };


    // Filtrar las tareas que cumplen con los criterios de búsqueda
    const filteredTasks = tasks.filter(task =>
        task.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || task.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    // Crear las secciones dividiendo las tareas entre finalizadas y no finalizadas
    const sections = [
        // {
        //     title: 'LISTA DE ACTIVIDADES',
        //     data: filteredTasks.filter(task => task.estado.toLowerCase() !== 'finalizada').length > 0
        //         ? filteredTasks
        //             .filter(task => task.estado.toLowerCase() !== 'finalizada')
        //             .sort((a, b) => {
        //                 // Ordenar por 'date' de menor a mayor para que las tareas que vencen primero estén arriba
        //                 return a.date?.seconds - b.date?.seconds; // Comparación directa de los segundos
        //             })
        //         : [{ id: 'no-tasks', nombre: 'No se encontraron tareas' }]
        // },
        {
            title: 'LISTA DE ACTIVIDADES',
            data: filteredTasks.filter(task => task.estado.toLowerCase() !== 'finalizada').length > 0
                ? filteredTasks.filter(task => task.estado.toLowerCase() !== 'finalizada')
                : [{ id: 'no-tasks', nombre: 'No se encontraron tareas' }]
        },
        {
            title: 'COMPLETAS',
            data: filteredTasks.filter(task => task.estado.toLowerCase() === 'finalizada').length > 0
                ? filteredTasks.filter(task => task.estado.toLowerCase() === 'finalizada')
                : [{ id: 'no-tasks', nombre: 'No se encontraron tareas finalizadas' }]
        }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.fechaText}>{fechaHoy}</Text>
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
                searchActivo={false}
            />

            {/* Usar tu componente LoadingScreen si está cargando las tareas y hay un paciente */}
            {loading ? (
                <LoadingScreen />
            ) : (
                selectedPatientId || isPaciente() ? (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => item.id + index}
                        renderItem={({ item }) => (
                            item.id === 'no-tasks' ? (
                                <Text style={styles.noTasksText}>{item.nombre}</Text>
                            ) : (
                                <TaskItem
                                    item={item}
                                    onPress={() => navigation.navigate('TaskDetail', { taskId: item.id, uid: selectedPatientId })}
                                />
                            )
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <TouchableOpacity onPress={() => title === 'COMPLETAS' && setShowCompletedTasks(!showCompletedTasks)}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.headerTitle}>{title}</Text>
                                    {title === 'COMPLETAS' && (
                                        <Text style={styles.triangle}>{showCompletedTasks ? '▲' : '▼'}</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                ) : (
                    <Text style={styles.noPatientText}>Selecciona un paciente para ver sus tareas.</Text>
                )
            )}

            {!isPaciente() && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddTask')}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 20,
    },
    headerTitle: {
        paddingVertical: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    triangle: {
        fontSize: 28,
        paddingRight: 10,
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
    noTasksText: {
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    fechaText: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 10,
        color: '#666666',
    },
    noPatientText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666666',
        marginTop: 20,
    },
});

export default TaskListScreen;
