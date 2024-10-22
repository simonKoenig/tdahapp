// React y React Native
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Contexts
import { PatientsContext } from '../Context/PatientsProvider';
import { RewardsContext } from '../Context/RewardsProvider';
import { SubjectsContext } from '../Context/SubjectsProvider';
import { TasksContext } from '../Context/TaskProvider';
// Componentes
import PatientSelector from '../Components/PatientSelector';
import LoadingScreen from '../Components/LoadingScreen';

function StatisticsScreen() {
    const { selectedPatientId } = useContext(PatientsContext);
    const { fetchRewards, rewards } = useContext(RewardsContext);
    const { fetchSubjects, subjects } = useContext(SubjectsContext);
    const { fetchTasks, tasks } = useContext(TasksContext);
    const [loading, setLoading] = useState(false);
    const [tareasTotales, setTareasTotales] = useState(0);
    const [tareasFinalizadas, setTareasFinalizadas] = useState(0);
    const [tareasVencidas, setTareasVencidas] = useState(0);
    const [tareasEnProgreso, setTareasEnProgreso] = useState(0);

    const handlePatientSelection = async (patientId) => {
        if (patientId) {
            setLoading(true);
            await fetchRewards(patientId);
            await fetchSubjects(patientId);
            await fetchTasks(patientId);
            setLoading(false);  
        }
    };

    useEffect(() =>{
        if (selectedPatientId && tasks.length > 0) {
            const tareasTotales = tasks.length;
            const tareasEnProgreso = tasks.filter(task => task.estado === 'En progreso');
            const tareasFinalizadas = tasks.filter(task => task.estado === 'Finalizada');
            const tareasVencidas = tasks.filter(task => task.estado === 'Vencida');
            setTareasFinalizadas(tareasFinalizadas.length);
            setTareasVencidas(tareasVencidas.length);
            setTareasEnProgreso(tareasEnProgreso.length);
            setTareasTotales(tareasTotales);
        }
    }, [selectedPatientId]);
    

    return (
        <View style={styles.container}>
            <PatientSelector onPatientSelected={handlePatientSelection} />
            {loading ? (
                <LoadingScreen />
            ) : (
                selectedPatientId ? (
                    <View>
                        <Text style={styles.statText}>Cantidad de tareas: {tareasTotales}</Text>
                        <Text style={styles.statText}>Tareas en progreso: {tareasEnProgreso}</Text>
                        <Text style={styles.statText}>Tareas completadas: {tareasFinalizadas}</Text>
                        <Text style={styles.statText}>Tareas vencidas: {tareasVencidas}</Text>
                    </View>
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