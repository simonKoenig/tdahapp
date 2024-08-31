import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropdownComponent from '../../Components/Dropdown';
import { dificultades } from '../../Utils/Constant';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingScreen from '../../Components/LoadingScreen'; // Importar LoadingScreen

import DateTimePicker from '@react-native-community/datetimepicker';
// Contextos
import { TasksContext } from '../../Context/TaskProvider';
import { RewardsContext } from '../../Context/RewardsProvider';
import { SubjectsContext } from '../../Context/SubjectsProvider';
import { PatientsContext } from '../../Context/PatientsProvider';
import { AuthContext } from '../../Context/AuthProvider';

import moment from 'moment'; // Importar moment
import 'moment/locale/es'; // Importar el idioma español para moment

function TaskDetailScreen() {
    const route = useRoute();
    const { taskId, uid } = route.params;

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [date, setDate] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [selectedRewardId, setSelectedRewardId] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carga
    const [show, setShow] = useState(false); // Estado para controlar la visibilidad del DateTimePicker
    const [mode, setMode] = useState('date'); // Estado para controlar el modo del DateTimePicker
    const { user, isPaciente, isLoading } = useContext(AuthContext);
    const [estado, setEstado] = useState(''); // Corrección: useState retorna un array con estado y función de actualización
    const [selectedSubjectName, setSelectedSubjectName] = useState('');


    const { getTask, updateTask, deleteTask } = useContext(TasksContext);
    const navigation = useNavigation();
    const { patients, setSelectedPatientId, selectedPatientId, fetchPatients } = useContext(PatientsContext);
    const { subjects, setSelectedSubjectId, selectedSubjectId, fetchSubjects } = useContext(SubjectsContext);
    const { rewards, fetchRewards } = useContext(RewardsContext);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentPatientId = selectedPatientId || user.uid;
                // Primero, cargamos las recompensas y materias
                await fetchRewards(currentPatientId);
                await fetchSubjects(currentPatientId);
                await fetchPatients(currentPatientId);

                // Luego, cargamos la tarea
                console.log('Fetching task details for ID:', taskId);
                const task = await getTask(taskId, uid);
                if (task) {
                    setNombre(task.nombre);
                    setDescripcion(task.descripcion);
                    setDate(task.date.toDate());
                    setDificultad(task.dificultad);
                    setSelectedRewardId(task.selectedRewardId);
                    setSelectedSubjectId(task.selectedSubjectId);
                    setSelectedPatientId(uid); // Establecemos el paciente seleccionado
                    setEstado(task.estado);
                    console.log('Fecha:', task.date.toDate());

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

    // Transforma las materias para el Dropdown
    const transformedSubjects = subjects.map(subject => ({
        label: subject.nombre,
        value: subject.id,
    }));

    // Transforma las recompensas para el Dropdown
    const transformedRewards = rewards.map(reward => ({
        label: reward.nombre,
        value: reward.id,
    }));

    // Date time picker
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

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
        return <LoadingScreen />; // Mostrar pantalla de carga
    }

    if (isPaciente()) {

        return (
            <View style={styles.form}>
                <Text style={styles.label}>Descripción</Text>
                <Text style={styles.input}>{descripcion}</Text>


                <Text style={styles.label}>Fecha</Text>
                <Text style={styles.input}>{moment(date).format('DD/MM/YYYY')}</Text>



                <Text style={styles.label}>Dificultad</Text>
                <Text style={styles.input}>{dificultad}</Text>

                <Text style={styles.label}>Materia</Text>
                <Text style={styles.input}>{subjects.find(subject => subject.id === selectedSubjectId)?.nombre}</Text>



                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.input}>{nombre}</Text>

                {estado === 'En progreso' && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleMarkTask('Pendiente')}
                        >
                            <Text style={styles.buttonText}>Tarea terminada</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {estado === 'Finalizada' && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                        >
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

            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity style={[styles.input, styles.fullWidth]} onPress={showDatepicker}>
                <Text style={styles.dateText}>
                    {moment(date).format('DD/MM/YYYY')}
                </Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}

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
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleMarkTask('Finalizada')}
                >
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
        width: '80%', // Asegura que ocupe el mismo ancho que los demás componentes
    },
    dateText: {
        textAlign: 'left',
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
