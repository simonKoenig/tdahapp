// React y React Native
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// Contexts
import { PatientsContext } from '../Context/PatientsProvider';
import { RewardsContext } from '../Context/RewardsProvider';
import { SubjectsContext } from '../Context/SubjectsProvider';
import { TasksContext } from '../Context/TaskProvider';
// Componentes
import PatientSelector from '../Components/PatientSelector';
import LoadingScreen from '../Components/LoadingScreen';
import GraphPie from '../Components/GraphPie';

function StatisticsScreen() {
    const { selectedPatientId } = useContext(PatientsContext);
    const { fetchRewards, rewards } = useContext(RewardsContext);
    const { fetchSubjects, subjects } = useContext(SubjectsContext);
    const { fetchTasks, tasks } = useContext(TasksContext);
    const [loading, setLoading] = useState(false);
    // Variables de estadísticas
    const [tareasTotales, setTareasTotales] = useState(0);
    const [tareasFinalizadas, setTareasFinalizadas] = useState(0);
    const [tareasVencidas, setTareasVencidas] = useState(0);
    const [tareasPendientes, setTareasPendientes] = useState(0);
    const [tareasEnProgreso, setTareasEnProgreso] = useState(0);
    const [cantidadMateriasConTareas, setcantidadMateriasConTareas] = useState('');
    const [cantidadMateriasConTareasEnProgreso, setcantidadMateriasConTareasEnProgreso] = useState('');
    const [cantidadMateriasConTareasPendiente, setcantidadMateriasConTareasPendiente] = useState('');
    const [cantidadMateriasConTareasFinalizadas, setcantidadMateriasConTareasFinalizadas] = useState('');
    const [cantidadMateriasConTareasVencidas, setcantidadMateriasConTareasVencidas] = useState('');

    // Función para manejar la selección de un paciente
    const handlePatientSelection = async (patientId) => {
        if (patientId) {
            setLoading(true);
            Promise.all([
                fetchRewards(patientId),
                fetchSubjects(patientId),
                fetchTasks(patientId)]);
            setLoading(false);  
        }
    };

    // useEffect para filtrar las tareas cuando se selecciona un paciente
    useEffect(() =>{
        if (selectedPatientId && tasks.length > 0 && subjects.length > 0) {
            filtrarTareas();
        }
    }, [selectedPatientId, tasks]);
    
    // función para filtrar las tareas
    const filtrarTareas = () => {
        const cantidadTareasTotales = tasks.length;
        const tareasEnProgreso = tasks.filter(task => task.estado === 'En progreso');
        const tareasPendientes = tasks.filter(task => task.estado === 'Pendiente');
        const tareasFinalizadas = tasks.filter(task => task.estado === 'Finalizada');
        const tareasVencidas = tasks.filter(task => task.estado === 'Vencida');

        setTareasTotales(cantidadTareasTotales);
        setTareasEnProgreso(tareasEnProgreso);
        setTareasPendientes(tareasPendientes);
        setTareasFinalizadas(tareasFinalizadas);
        setTareasVencidas(tareasVencidas);

        filtrarMaterias();
    }

    // Función para filtrar las materias que tienen tareas
    const filtrarMaterias = () => {
        const cantidadMateriasConTareas = contarTareasPorMateria(tasks);  
        const cantidadMateriasConTareasEnProgreso = contarTareasPorMateria(tareasEnProgreso);
        const cantidadMateriasConTareasPendiente = contarTareasPorMateria(tareasPendientes);
        const cantidadMateriasConTareasFinalizadas = contarTareasPorMateria(tareasFinalizadas);
        const cantidadMateriasConTareasVencidas = contarTareasPorMateria(tareasVencidas);

        setcantidadMateriasConTareas(cantidadMateriasConTareas);
        setcantidadMateriasConTareasEnProgreso(cantidadMateriasConTareasEnProgreso);
        setcantidadMateriasConTareasPendiente(cantidadMateriasConTareasPendiente);
        setcantidadMateriasConTareasFinalizadas(cantidadMateriasConTareasFinalizadas);
        setcantidadMateriasConTareasVencidas(cantidadMateriasConTareasVencidas);
    };

    // Función para contar las tareas por materia y devolver un array con la cantidad de tareas por materia ordenadas de mayor a menor
    const contarTareasPorMateria = (tareasFiltradas) => {
        // Si no hay tareas filtradas, retornar un guión
        if (!Array.isArray(tareasFiltradas) || tareasFiltradas.length === 0) {
            return '';
        }

        // Obtener los IDs de las materias de las tareas filtradas y buscar los nombres de las materias en el array de materias
        const materiasId = tareasFiltradas.map(task => task.selectedSubjectId);
        const nombresMaterias = materiasId.map(selectedSubjectId => {
            const subject = subjects.find(subject => subject.id === selectedSubjectId);
            return subject ? subject.nombre : '';
        });

        // Contar la cantidad de tareas por materia
        const conteo = nombresMaterias.reduce((acc, materia) => {
            acc[materia] = (acc[materia] || 0) + 1;
            return acc;
        }, {});

        // Convertir el objeto `conteo` a un array de objetos con materia y cantidad
        const materiasOrdenadas = Object.entries(conteo)
        .map(([materia, cantidad]) => ({ materia, cantidad })) // Convertir a objetos
        .sort((a, b) => b.cantidad - a.cantidad); // Ordenar de mayor a menor por cantidad

        return materiasOrdenadas;
    };

    return (
        <View style={styles.container}>
            <PatientSelector onPatientSelected={handlePatientSelection} />
            {loading ? (
                <LoadingScreen />
            ) : (
                selectedPatientId ? (
                    <ScrollView>
                        <Text style={styles.statText}>Cantidad de tareas: {tareasTotales}</Text>
                        <Text style={styles.statText}>Tareas en progreso: {tareasEnProgreso.length}</Text>
                        <Text style={styles.statText}>Tareas pendientes: {tareasPendientes.length}</Text>
                        <Text style={styles.statText}>Tareas completadas: {tareasFinalizadas.length}</Text>
                        <Text style={styles.statText}>Tareas vencidas: {tareasVencidas.length}</Text>
                        <Text style={styles.statText}>Materia con más tareas: 
                            {cantidadMateriasConTareas.length > 0 ? cantidadMateriasConTareas[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas en progreso: 
                            {cantidadMateriasConTareasEnProgreso.length > 0 ? cantidadMateriasConTareasEnProgreso[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas pendientes: 
                            {cantidadMateriasConTareasPendiente.length > 0 ? cantidadMateriasConTareasPendiente[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas finalizadas: 
                            {cantidadMateriasConTareasFinalizadas.length > 0 ? cantidadMateriasConTareasFinalizadas[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas vencidas: 
                            {cantidadMateriasConTareasVencidas.length > 0 ? cantidadMateriasConTareasVencidas[0].materia : 'No hay materias'}
                        </Text>
                        <GraphPie data={cantidadMateriasConTareas} />
                    </ScrollView>
                ) : (
                    <Text style={styles.noPatientText}>Selecciona un paciente para ver sus estadísticas.</Text>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    statText: {
        fontSize: 18,
        marginVertical: 10,
    },
    noPatientText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666666',
        marginTop: 20,
    }
});

export default StatisticsScreen;