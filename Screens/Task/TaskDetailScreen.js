import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
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
import { showConfirmAlert } from '../../Utils/showConfirmAlert';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { Timestamp } from 'firebase/firestore';
import { globalStyles } from '../../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR } from '../../Utils/globalStyles';





function TaskDetailScreen() {
    const route = useRoute();
    const { taskId, uid } = route.params;

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [date, setDate] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [adminName, setAdminName] = useState(null);
    const [correctionDate, setCorrectionDate] = useState(null);
    const [tareaTerminada, setTareaTerminada] = useState(null);
    const [selectedRewardId, setSelectedRewardId] = useState('');
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [show1, setShow1] = useState(false); // Añado estados pra el segundo DateTimePicker
    const [mode1, setMode1] = useState('date');
    const [estado, setEstado] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [rewardExpires, setRewardExpires] = useState(false);
    const [dateRewards, setDateRewards] = useState(new Date());
    const { isPaciente, user } = useContext(AuthContext);
    const { getTask, updateTask, deleteTask } = useContext(TasksContext);
    const navigation = useNavigation();
    const { setSelectedPatientId, selectedPatientId } = useContext(PatientsContext);
    const { subjects, setSelectedSubjectId, selectedSubjectId } = useContext(SubjectsContext);
    const { rewards } = useContext(RewardsContext);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const task = await getTask(taskId, uid);
                console.log('task:', task);
                if (task) {
                    setNombre(task.nombre);
                    setDescripcion(task.descripcion);
                    setDate(task.date.toDate());
                    setDificultad(task.dificultad);
                    setSelectedRewardId(task.selectedRewardId);
                    setSelectedSubjectId(task.selectedSubjectId);
                    setSelectedPatientId(uid);
                    setEstado(task.estado);
                    setFechaCreacion(task.fechaCreacion.toDate());
                    if (task.correccion) {
                        setAdminName(task.correccion.adminName);
                        setCorrectionDate(task.correccion.correctionDate.toDate());
                    }
                    if (task.tareaTerminada) {
                        setTareaTerminada(task.tareaTerminada.toDate());
                    }
                    if (task.dateRewards) {
                        console.log('task.dateRewards:', task.dateRewards.toDate());
                        setDateRewards(task.dateRewards.toDate());
                        setRewardExpires(true);
                    } else {
                        setRewardExpires(false);
                    }
                    if (task.tareaTerminada) {
                        setTareaTerminada(task.tareaTerminada.toDate());
                    }
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


    const handleMarkTask = async (nuevoEstado) => {
        try {
            // Verificar si el estado es "Finalizada"
            if (nuevoEstado === 'Finalizada') {
                // Crear el objeto updatedTask con los datos adicionales de la corrección
                const correccion = {
                    adminUID: user.uid,
                    adminName: user.nombreApellido,
                    correctionDate: Timestamp.fromDate(new Date()) // Convertir explícitamente a Timestamp
                };
                const updatedTask = {
                    nombre,
                    descripcion,
                    date,
                    dificultad,
                    selectedRewardId,
                    selectedSubjectId,
                    estado: nuevoEstado,
                    fechaCreacion,
                    dateRewards: rewardExpires ? dateRewards : null,
                    tareaTerminada: tareaTerminada ? tareaTerminada : null,
                    correccion,
                };

                // Llamar a la función de actualización
                await updateTask(taskId, updatedTask, selectedPatientId);
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Tarea corregida correctamente. Toca aquí para cerrar.',
                });
            } else {
                // Si el estado no es "Finalizada", solo actualiza los campos necesarios sin incluir los datos del administrador
                const updatedTask = {
                    nombre,
                    descripcion,
                    date,
                    dificultad,
                    selectedRewardId,
                    selectedSubjectId,
                    estado: nuevoEstado,
                    fechaCreacion,
                    dateRewards: rewardExpires ? dateRewards : null,
                    tareaTerminada: Timestamp.fromDate(new Date())
                };

                // Llamar a la función de actualización
                await updateTask(taskId, updatedTask, selectedPatientId);
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Tarea actualizada correctamente. Toca aquí para cerrar.',
                });
            }

            // Navegar hacia atrás después de la actualización
            navigation.goBack();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleUpdateTask = async () => {
        showConfirmAlert({
            title: "Confirmar actualización",
            message: `¿Estás seguro que deseas actualizar la tarea "${nombre}"?`,
            confirmText: "Confirmar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    setLoading(true);
                    const result = await updateTask(taskId, { nombre, descripcion, date, dificultad, selectedRewardId, selectedSubjectId, estado, fechaCreacion, dateRewards: rewardExpires ? dateRewards : null, tareaTerminada: tareaTerminada ? tareaTerminada : null, }, selectedPatientId);
                    if (result?.error) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: `${result.error} Toca aquí para cerrar.`,
                        });
                        console.log('Error en handleDeletePatient:', result.error);
                    } else {
                        Toast.show({
                            type: 'success',
                            text1: 'Éxito',
                            text2: 'Tarea actualizada correctamente. Toca aquí para cerrar.',
                        });
                        navigation.goBack();
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Ocurrió un error al actualizar la tarea. Toca aquí para cerrar.',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };


    const handleDeleteTask = () => {

        showConfirmAlert({
            title: "Confirmar eliminación",
            message: `¿Estás seguro que deseas eliminar la tarea "${nombre}"?`,
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    setLoading(true);
                    const result = await deleteTask(taskId, selectedPatientId);
                    if (result?.error) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: `${result.error} Toca aquí para cerrar.`,
                        });
                    } else {
                        Toast.show({
                            type: 'success',
                            text1: 'Éxito',
                            text2: 'Tarea eliminada correctamente. Toca aquí para cerrar.',
                        });
                        navigation.goBack();
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Ocurrió un error al eliminar la tarea. Toca aquí para cerrar.',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (loading) {
        return <LoadingScreen />;
    }

    const recompensaNombre = rewards.find(reward => reward.id === selectedRewardId)?.nombre;
    const recompensaVencimiento = rewardExpires ? dateRewards : null;

    if (isPaciente()) {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {loading ? (
                    <LoadingScreen />
                ) : (
                    <View style={globalStyles.form}>
                        <Text style={globalStyles.label}>Nombre</Text>
                        <Text style={globalStyles.input}>{nombre}</Text>
                        <Text style={globalStyles.label}>Descripción</Text>
                        <Text style={globalStyles.input}>{descripcion}</Text>
                        <Text style={globalStyles.label}>Fecha de creación</Text>
                        <DateTimePickerComponent
                            date={fechaCreacion}
                            setDate={setDate}
                            mode={mode}
                            setMode={setMode}
                            show={show}
                            setShow={setShow}
                            editable={false}
                        />
                        <Text style={globalStyles.label}>Fecha y hora de vencimiento</Text>
                        <DateTimePickerComponent
                            date={date}
                            setDate={setDate}
                            mode={mode}
                            setMode={setMode}
                            show={show}
                            setShow={setShow}
                            editable={false}
                        />
                        <Text style={globalStyles.label}>Dificultad</Text>
                        <Text style={globalStyles.input}>{dificultad}</Text>
                        <Text style={globalStyles.label}>Materia</Text>
                        <Text style={globalStyles.input}>{subjects.find(subject => subject.id === selectedSubjectId)?.nombre}</Text>

                        {tareaTerminada && (
                            <Text style={styles.tareaCorregidaText}>
                                Tarea terminada el {moment(tareaTerminada).format('lll')}
                            </Text>
                        )}

                        {estado === 'En progreso' && (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={() => handleMarkTask('Pendiente')}>
                                    <Text style={globalStyles.buttonText}>Tarea terminada</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {estado === 'Finalizada' && (
                            <View style={styles.buttonContainer}>
                                {!recompensaVencimiento || recompensaVencimiento > new Date() ? (
                                    <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={() => navigation.navigate('ObtainTask', { recompensaNombre, recompensaVencimiento })}>
                                        <Text style={styles.buttonText}>Obtener recompensa</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={[globalStyles.backbutton, { flex: 1 }]}>
                                        <Text style={globalStyles.backbuttonText}>Recompensa vencida</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        );
    }


    return (
        <ScrollView >
            <View style={globalStyles.form}>
                <Text style={globalStyles.label}>Nombre</Text>
                <TextInput
                    style={globalStyles.input}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    placeholder='Nombre de la tarea'
                    value={nombre}
                    onChangeText={setNombre}
                />

                <Text style={globalStyles.label}>Descripción</Text>
                <TextInput
                    style={globalStyles.input}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    placeholder='Descripción de la nueva tarea'
                    value={descripcion}
                    onChangeText={setDescripcion}
                />

                <Text style={globalStyles.label}>Fecha y hora de vencimiento</Text>
                <DateTimePickerComponent
                    date={date}
                    setDate={setDate}
                    mode={mode}
                    setMode={setMode}
                    show={show}
                    setShow={setShow}
                    editable={true}
                />

                <Text style={globalStyles.label}>Materia</Text>
                <DropdownComponent
                    data={transformedSubjects}
                    value={selectedSubjectId}
                    setValue={setSelectedSubjectId}
                    placeholder="Selecciona una materia"
                    width='80%'
                />

                <Text style={globalStyles.label}>Dificultad</Text>
                <DropdownComponent
                    data={dificultades}
                    value={dificultad}
                    setValue={setDificultad}
                    placeholder="Selecciona una dificultad"
                    width='80%'
                />
                <Text style={globalStyles.label}>Recompensa</Text>
                <DropdownComponent
                    data={transformedRewards}
                    value={selectedRewardId}
                    setValue={setSelectedRewardId}
                    placeholder="Selecciona una recompensa"
                    width='80%'
                />

                <Text style={globalStyles.label}>Vencimiento de la recompensa</Text>
                <DateTimePickerComponent
                    date={dateRewards}
                    setDate={setDateRewards}
                    mode={mode1}
                    setMode={setMode1}
                    show={show1}
                    setShow={setShow1}
                    editable={rewardExpires}
                />
                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>¿La recompensa se vence?</Text>
                    <Switch
                        trackColor={{ false: '#D9D9D9', true: 'lightblue' }}
                        thumbColor={rewardExpires ? '#4c669f' : 'gray'}
                        value={rewardExpires}
                        onValueChange={setRewardExpires}
                    />
                </View>

                <Text style={styles.tareaCreadaText}>
                    Tarea creada {moment(fechaCreacion).format('lll')}
                </Text>
                {tareaTerminada && (
                    <Text style={styles.tareaCorregidaText}>
                        Tarea terminada el {moment(tareaTerminada).format('lll')}
                    </Text>
                )}

                {correctionDate && adminName && (
                    <Text style={styles.tareaCorregidaText}>
                        Tarea corregida por {adminName} el {moment(correctionDate).format('lll')}
                    </Text>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[globalStyles.button, { flex: 1, marginRight: 10 }]} onPress={handleUpdateTask}>
                        <Text style={globalStyles.buttonText}>Actualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={handleDeleteTask}>
                        <Text style={globalStyles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
                {estado === 'Pendiente' && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={() => handleMarkTask('Finalizada')}>
                            <Text style={globalStyles.buttonText}>Tarea correcta</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
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
    tareaCreadaText: {
        fontSize: 14,
        marginTop: 10,
    },
    tareaCorregidaText: {
        fontSize: 14,
        color: 'green',
        flexWrap: 'wrap',  // Permite que el texto se divida en varias líneas
        width: '80%',  // Asegura que el texto no exceda el 80% del ancho del formulario
        textAlign: 'center',
    },
    noCorreccionText: {
        fontSize: 14,
        color: 'red',
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
    buttonDisabled: {
        flex: 1,
        height: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    buttonDisabledText: {
        fontSize: 18,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '80%',
    },
    switchText: {
        fontSize: 14,
    },
});

export default TaskDetailScreen;