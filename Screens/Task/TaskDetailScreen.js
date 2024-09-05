import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropdownComponent from '../../Components/Dropdown';
import DateTimePickerComponent from '../../Components/DateTimePicker';
import LoadingScreen from '../../Components/LoadingScreen';
import { dificultades } from '../../Utils/Constant';
import { TasksContext } from '../../Context/TaskProvider';
import { RewardsContext } from '../../Context/RewardsProvider';
import { SubjectsContext } from '../../Context/SubjectsProvider';
import { PatientsContext } from '../../Context/PatientsProvider';
import { AuthContext } from '../../Context/AuthProvider';


function TaskDetailScreen() {
    const route = useRoute();
    const { taskId, uid } = route.params;

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [date, setDate] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [selectedRewardId, setSelectedRewardId] = useState('');
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [estado, setEstado] = useState('');

    const { user, isPaciente } = useContext(AuthContext);
    const { getTask, updateTask, deleteTask } = useContext(TasksContext);
    const navigation = useNavigation();
    const { setSelectedPatientId, selectedPatientId } = useContext(PatientsContext);
    const { subjects, setSelectedSubjectId, selectedSubjectId } = useContext(SubjectsContext);
    const { rewards } = useContext(RewardsContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentPatientId = selectedPatientId || user.uid;

                const task = await getTask(taskId, uid);
                if (task) {
                    setNombre(task.nombre);
                    setDescripcion(task.descripcion);
                    setDate(task.date.toDate());
                    setDificultad(task.dificultad);
                    setSelectedRewardId(task.selectedRewardId);
                    setSelectedSubjectId(task.selectedSubjectId);
                    setSelectedPatientId(uid);
                    setEstado(task.estado);
                } else {
                    console.error('Task not found');
                }
            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [taskId, uid]);

    const transformedSubjects = subjects.map(subject => ({
        label: subject.nombre,
        value: subject.id,
    }));

    const transformedRewards = rewards.map(reward => ({
        label: reward.nombre,
        value: reward.id,
    }));

    const handleUpdateTask = async () => {
        try {
            await updateTask(taskId, { nombre, descripcion, date, dificultad, selectedRewardId, selectedSubjectId, estado }, selectedPatientId);
            navigation.goBack();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleMarkTask = async (nuevoEstado) => {
        try {
            await updateTask(taskId, { nombre, descripcion, date, dificultad, selectedRewardId, selectedSubjectId, estado: nuevoEstado }, selectedPatientId);
            navigation.goBack();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(taskId, selectedPatientId);
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    const recompensaNombre = rewards.find(reward => reward.id === selectedRewardId)?.nombre;

    if (isPaciente()) {
        return (
            <View style={styles.form}>
                <Text style={styles.label}>Descripción</Text>
                <Text style={styles.input}>{descripcion}</Text>
                <Text style={styles.label}>Fecha y hora de vencimiento</Text>
                <DateTimePickerComponent
                    date={date}
                    setDate={setDate}
                    mode={mode}
                    setMode={setMode}
                    show={show}
                    setShow={setShow}
                    editable={false}
                />
                <Text style={styles.label}>Dificultad</Text>
                <Text style={styles.input}>{dificultad}</Text>
                <Text style={styles.label}>Materia</Text>
                <Text style={styles.input}>{subjects.find(subject => subject.id === selectedSubjectId)?.nombre}</Text>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.input}>{nombre}</Text>
                {estado === 'En progreso' && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => handleMarkTask('Pendiente')}>
                            <Text style={styles.buttonText}>Tarea terminada</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {estado === 'Finalizada' && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ObtainTask', { recompensaNombre })}>
                            <Text style={styles.buttonText}>Obtener recompensa</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={styles.input}
                placeholder='Descripción de la nueva tarea'
                value={descripcion}
                onChangeText={setDescripcion}
            />
            
            <Text style={styles.label}>Fecha y hora de vencimiento</Text>
            <DateTimePickerComponent
                date={date}
                setDate={setDate}
                mode={mode}
                setMode={setMode}
                show={show}
                setShow={setShow}
                editable={true}
            />

            <Text style={styles.label}>Dificultad</Text>
            <DropdownComponent
                data={dificultades}
                value={dificultad}
                setValue={setDificultad}
                placeholder="Selecciona una dificultad"
            />
            <Text style={styles.label}>Recompensa</Text>
            <DropdownComponent
                data={transformedRewards}
                value={selectedRewardId}
                setValue={setSelectedRewardId}
                placeholder="Selecciona una recompensa"
            />
            <Text style={styles.label}>Materia</Text>
            <DropdownComponent
                data={transformedSubjects}
                value={selectedSubjectId}
                setValue={setSelectedSubjectId}
                placeholder="Selecciona una materia"
            />
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombre de la tarea'
                value={nombre}
                onChangeText={setNombre}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleUpdateTask}>
                    <Text style={styles.buttonText}>Actualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDeleteTask}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleMarkTask('Finalizada')}>
                    <Text style={styles.buttonText}>Tarea correcta</Text>
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
    fullWidth: {
        width: '80%',
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

export default TaskDetailScreen;