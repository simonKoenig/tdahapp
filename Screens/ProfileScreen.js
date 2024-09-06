import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, RefreshControl, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';
import { PatientsContext } from '../Context/PatientsProvider';
import { RewardsContext } from '../Context/RewardsProvider';
import { TasksContext } from '../Context/TaskProvider';
import { SubjectsContext } from '../Context/SubjectsProvider';
import LoadingScreen from '../Components/LoadingScreen';
import { clearStorage } from '../Utils/AsyncStorage';

function ProfileScreen() {
    const { logout, isAuthenticated, user } = useContext(AuthContext);
    const { patients, setPatients, setSelectedPatientId, addPatientByEmail, deletePatient } = useContext(PatientsContext);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const { setRewards } = useContext(RewardsContext);
    const { setTasks } = useContext(TasksContext);
    const { setSubjects } = useContext(SubjectsContext);
    const { isPaciente } = useContext(AuthContext)



    // Logout
    const handleLogout = async () => {
        setLoading(true);
        await logout();
        await clearStorageLogOut();
        setLoading(false);
    };

    // Limpia el almacenamiento al cerrar sesión
    const clearStorageLogOut = async () => {
        try {
            // Limpia la caché de almacenamiento local
            await clearStorage();
            // Limpia los estados de recompensas, tareas, materias y pacientes
            setRewards([]);
            setTasks([]);
            setSubjects([]);
            setPatients([]);
            setSelectedPatientId(null);
        } catch (error) {
            console.error('Error clearing storage:', error);
        };

        return null;
    };

    // Redirige a la pantalla de inicio de sesión si el usuario no está autenticado
    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigation.replace('Login'); // Utiliza replace en lugar de reset
        }
    }, [isAuthenticated, loading, navigation]);

    const handleFetchUserRewards = async () => {
        try {
            if (email) {
                setLoading(true);
                setErrorMessage(''); // Limpiar cualquier mensaje de error previo
                const patientData = await addPatientByEmail(email);

                if (patientData && patientData.uid) {
                    console.log('Patient data:', patientData);
                }
                else {
                    setErrorMessage('No se encontró un usuario con ese email.');
                }
            }
        } catch (error) {
            console.error('Error fetching user rewards:', error);
            setErrorMessage(error.message || 'Ocurrió un error al intentar buscar recompensas.');

        } finally {
            setLoading(false);
        }
    };



    const renderPatientItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.nombreApellido}</Text>


            <TouchableOpacity style={styles.cell} onPress={() => deletePatient(item.id, user.uid)}>
                <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );


    return (

        <View style={styles.container}>
            {loading && <LoadingScreen />}
            {!loading && (
                <>
                    {!isPaciente() && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Email del paciente"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Button title="Buscar Recompensas" onPress={handleFetchUserRewards} />
                            {typeof errorMessage === 'string' && errorMessage.length > 0 && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                                </View>
                            )}
                            <FlatList
                                data={patients}
                                keyExtractor={(item) => item.id}
                                renderItem={renderPatientItem}
                                contentContainerStyle={styles.list}
                            />

                        </>
                    )}
                    <Button
                        title="Cerrar Sesión"
                        onPress={handleLogout} s
                    />



                </>
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
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4c669f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    noRewardsText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    patientItem: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    errorContainer: {
        marginVertical: 8,
        padding: 10,
        backgroundColor: '#fee',
        borderRadius: 5,
    },

    errorMessage: {
        color: 'red',
        fontSize: 16,
        marginTop: 16,
    },
    item: {
        flex: 1,
        backgroundColor: '#d3d3d3', // Fondo gris
        padding: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#d3d3d3', // Fondo gris
        padding: 10,
        marginVertical: 2,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    actionText: {
        color: '#007bff',
    },
    list: {
        width: '100%',
        paddingHorizontal: 10,
    },

});


export default ProfileScreen;