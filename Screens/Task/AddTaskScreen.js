// React 
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Componentes y constantes
import DropdownComponent from '../../Components/Dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dificultades } from '../../Utils/Constant';
// Contextos
import { TasksContext } from '../../Context/TaskProvider';
import { RewardsContext } from '../../Context/RewardsProvider';
import { SubjectsContext } from '../../Context/SubjectsProvider';
import { PatientsContext } from '../../Context/PatientsProvider';
import { ScrollView } from 'react-native-gesture-handler';

function AddTaskScreen() {
    const { patients, setSelectedPatientId, selectedPatientId, fetchPatients } = useContext(PatientsContext);
    const { addTask } = useContext(TasksContext);
    const { subjects, setSelectedSubjectId, selectedSubjectId, fetchSubjects } = useContext(SubjectsContext);


    const { rewards, setSelectedRewardId, selectedRewardId, fetchRewards } = useContext(RewardsContext);
    const navigation = useNavigation();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [date, setDate] = useState(new Date()); //  Use new Date() para obtener la fecha actual
    const [mode, setMode] = useState('date'); // Date time picker
    const [show, setShow] = useState(false); // Date time picker

    // Transforma los pacientes para el Dropdown
    const transformedPatients = patients.map(patient => ({
         label: patient.nombreApellido,
         value: patient.id,
    }));

    // Transforma las materias para el Dropdown
    const transformedSubjects = subjects.map(subject => ({
        label: subject.nombre,
        value: subject.id,
    }));
    
    // Transforma las recompensas y las filtra según la dificultad elegida para el Dropdown
    const transformedRewards = rewards
    .filter(reward => reward.dificultad === dificultad)
    .map(reward => ({
        label: reward.nombre,
        value: reward.id,
        dificultad: reward.dificultad
    }));
    
    // Función para seleccionar una materia
    const handleSelectSubject = async (subjectId) => {
        setSelectedSubjectId(subjectId);
    };

    // Función para seleccionar una recompensa
    const handleSelectReward = async (rewardId) => {
        setSelectedRewardId(rewardId);
    };

    // Función para seleccionar un paciente
    const handleSelectPatient = async (patientId) => {
        // al seleccionar el paciente, se obtienen las materias y recompensas del paciente
        const subjects = await fetchSubjects(patientId);
        const rewards = await fetchRewards(patientId);
        setSelectedPatientId(patientId);
    };

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

    const showTimepicker = () => {
        showMode('time');
    };
    
    // Función para agregar una tarea
    const handleAddTask = async () => {
        if (selectedPatientId) {
            const newTask = {
                nombre,
                descripcion,
                date,
                dificultad,
                selectedRewardId,
                selectedSubjectId,
            };
            
            await addTask(newTask, selectedPatientId); // Pasa el UID del paciente seleccionado
            //navigation.goBack();
        } else {
            console.error('No patient selected');
        }
    };

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombre de la nueva tarea'
                value={nombre}
                onChangeText={setNombre}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={styles.input}
                placeholder='Descripción de la nueva tarea'
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <Text style={styles.label}>Fecha de vencimiento</Text>
            <Button onPress={showDatepicker} title="Show date picker!" />
            <Button onPress={showTimepicker} title="Show time picker!" />
            <Text>Fecha seleccionada: {date.toLocaleString()}</Text>
            {show && (
                <DateTimePicker
                minimumDate={new Date()}
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                />
            )}

            <Text style={styles.label}>Paciente</Text>
            {patients.length > 0 ? (
                    <DropdownComponent
                        data={transformedPatients}
                        value={selectedPatientId}
                        setValue={setSelectedPatientId}
                        placeholder="Seleccione un paciente"
                        onSelect={handleSelectPatient}
                    />
                ) : (
                    <Text style={styles.noPatientsText}>No se encontraron pacientes.</Text>
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
                onSelect={handleSelectReward}
            />

            <Text style={styles.label}>Materia</Text>
            <DropdownComponent
                data={transformedSubjects}
                value={selectedSubjectId}
                setValue={setSelectedSubjectId}
                placeholder="Selecciona una materia"
                onSelect={handleSelectSubject}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddTask}>
                    <Text style={styles.buttonText}>Aceptar</Text>
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
        textAlign: 'left', // Alinea el texto a la izquierda
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

export default AddTaskScreen;