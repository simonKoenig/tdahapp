import React, { useContext, useState, useEffect } from 'react';
import { View, SectionList, Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
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
import { globalStyles } from '../../Utils/globalStyles';
import { SPACING, COLORS } from '../../Utils/Constant';
// Import moment para formatear la fecha y mostrarla en español
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

// Obtén la fecha de hoy
const fechaHoy = moment().format('LL'); // Formato de fecha larga

const TaskListScreen = ({ route }) => {
    const { tasks = [], fetchTasks, loadingTasks } = useContext(TasksContext); // Valor predeterminado para tasks
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
                AccessibilityInfo.announceForAccessibility('Lista de tareas actualizada');
            }
        };
        loadTasks();
    }, [selectedPatientId]);

    const handleRefresh = async () => {
        if (selectedPatientId) {
            setRefreshing(true);
            await fetchTasks(selectedPatientId);
            setRefreshing(false);
            AccessibilityInfo.announceForAccessibility('Lista de tareas refrescada');
        }
    };


    // Filtrar las tareas que cumplen con los criterios de búsqueda
    const filteredTasks = tasks.filter(task =>
        task.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || task.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    // Crear las secciones dividiendo las tareas entre finalizadas y no finalizadas
    const sections = [
        {
            title: 'LISTA DE ACTIVIDADES',
            data: filteredTasks.filter(task => task.estado.toLowerCase() !== 'finalizada').length > 0
                ? filteredTasks.filter(task => task.estado.toLowerCase() !== 'finalizada')
                : [{ id: 'no-tasks', nombre: 'No se encontraron tareas' }]
        },
        {
            title: 'COMPLETAS',
            data: showCompletedTasks && filteredTasks.filter(task => task.estado.toLowerCase() === 'finalizada').length > 0
                ? filteredTasks.filter(task => task.estado.toLowerCase() === 'finalizada')
                : [{ id: 'no-tasks', nombre: 'No se encontraron tareas finalizadas' }]
        },
    ];

    return (
        <View style={globalStyles.container}>
            <Text style={styles.fechaText} accessible={true} accessibilityLabel={`Fecha de hoy: ${fechaHoy}`}>
                {fechaHoy}
            </Text>
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
            {loadingTasks ? (
                <LoadingScreen accessibilityLabel="Cargando tareas, por favor espere" />
            ) : (
                selectedPatientId || isPaciente() ? (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => item.id + index}
                        renderItem={({ item }) => (
                            item.id === 'no-tasks' ? (
                                <View style={globalStyles.centeredContainer}>
                                    <Text style={globalStyles.noDataText}>{item.nombre}</Text>
                                </View>
                            ) : (
                                <TaskItem
                                    item={item}
                                    onPress={() => navigation.navigate('TaskDetail', { taskId: item.id, uid: selectedPatientId })}
                                />
                            )
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            title === 'COMPLETAS' ? (
                                <TouchableOpacity
                                    onPress={() => setShowCompletedTasks(!showCompletedTasks)}
                                    accessible={true}
                                    accessibilityLabel={`Sección de tareas completas. ${showCompletedTasks ? 'Ocultar' : 'Mostrar'} tareas completadas`}
                                    accessibilityState={{ expanded: showCompletedTasks }}
                                >
                                    <View style={styles.sectionHeader}>
                                        <Text style={globalStyles.lessBoldText}>{title}</Text>
                                        <Text style={styles.triangle}>{showCompletedTasks ? '▲' : '▼'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.sectionHeader} accessible={true} accessibilityRole="header">
                                    <Text style={globalStyles.lessBoldText}>{title}</Text>
                                </View>
                            )
                        )}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                ) : (
                    <Text style={globalStyles.noPatientText} accessible={true} accessibilityLabel="Selecciona un estudiante para ver sus tareas">
                        Selecciona un estudiante para ver sus tareas.
                    </Text>)
            )}

            {!isPaciente() && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddTask')}
                    accessible={true}
                    accessibilityLabel="Botón para agregar nueva tarea"
                    accessibilityRole="button"
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.small,
    },
    triangle: {
        fontSize: 28,
        color: COLORS.text,
    },
    addButton: {
        position: 'absolute',
        bottom: SPACING.large,
        right: SPACING.large,
        backgroundColor: '#285583',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'bold',
    },
    fechaText: {
        fontSize: 22,
        fontFamily: 'bold',
        marginBottom: SPACING.small,
        color: COLORS.text,
    },
});

export default TaskListScreen;
