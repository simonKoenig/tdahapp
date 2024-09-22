import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';
import { PatientsContext } from '../Context/PatientsProvider';
import { RewardsContext } from '../Context/RewardsProvider';
import { TasksContext } from '../Context/TaskProvider';
import { SubjectsContext } from '../Context/SubjectsProvider';
import LoadingScreen from '../Components/LoadingScreen';
import { clearStorage } from '../Utils/AsyncStorage';
import Toast from 'react-native-toast-message';
import { MessageIcon, QrIcon } from '../Components/Icons';
import PacienteListItem from '../Components/PacienteListItem';
import ConfirmDeleteAlert from '../Components/ConfirmDeleteAlert';
import AddPatientModal from '../Modals/AddPatientModal';
import PatientQRCode from '../Components/QR';



function ProfileScreen() {
    //ESTADOS
    const navigation = useNavigation(); // Hook de navegación
    const [loading, setLoading] = useState(false); // Estado de carga del componente general
    const [loadingPatients, setLoadingPatients] = useState(false); // Estado de carga de los pacientes
    const [email, setEmail] = useState('');
    const [isQRModalVisible, setQRModalVisible] = useState(false);
    const [isEmailModalVisible, setEmailModalVisible] = useState(false);
    //CONTEXT
    const { logout, isAuthenticated, user, isPaciente } = useContext(AuthContext);
    const { patients, setPatients, setSelectedPatientId, addPatientByEmail, deletePatient } = useContext(PatientsContext);
    const { setRewards } = useContext(RewardsContext);
    const { setTasks } = useContext(TasksContext);
    const { setSubjects } = useContext(SubjectsContext);


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

    const handleFetchUserRewards = async (email) => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Por favor, proporciona un mail válido. Toca aquí para cerrar.',
            });
            return;
        }
        try {
            setLoadingPatients(true);
            const patientData = await addPatientByEmail(email);
            if (patientData?.error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `${patientData.error} Toca aquí para cerrar.`,
                });
                console.log('Error en handleFetchUserRewards:', patientData.error);
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Exito',
                    text2: 'Usuario agregado correctamente. Toca aquí para cerrar.',

                });
            }
        } catch (error) {
            console.error('Error en handleAddPatientByEmail:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Ocurrió un error al agregar el usuario.',
            });
        } finally {
            setLoadingPatients(false);
        }
    };

    const handleDeletePatient = async (patientId) => {
        try {
            setLoadingPatients(true); // Muestra algún indicador de carga si es necesario

            // Lógica de eliminación
            const result = await deletePatient(patientId, user.uid);

            // Verificamos si la operación tuvo éxito o si resultó en un error
            if (result?.error) {
                // Si hubo un error en la eliminación
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: `${result.error} Toca aquí para cerrar.`,
                });
                console.log('Error en handleDeletePatient:', result.error);
            } else {
                // Si la eliminación fue exitosa
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Paciente eliminado correctamente. Toca aquí para cerrar.',
                });
            }
        } catch (error) {
            // Si algo salió mal en la operación
            console.error('Error en handleDeletePatient:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Ocurrió un error al eliminar el paciente. Toca aquí para cerrar.',
            });
        } finally {
            setLoadingPatients(false); // Se quita el indicador de carga en cualquier caso (éxito o error)
        }
    };


    return (
        <View style={styles.container}>
            {loading && <LoadingScreen />}
            {!loading && (
                <>
                    {/* Perfil del usuario */}
                    <View style={styles.profileSection}>
                        <Text style={styles.profileName}>{user.nombreApellido}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text>
                    </View>
                    {!isPaciente() ? (
                        <>
                            <Text style={styles.sectionTitle}>Usuarios vinculados</Text>
                            {loadingPatients ? (
                                <LoadingScreen />
                            ) : (
                                <FlatList
                                    data={patients} // Lista de pacientes
                                    keyExtractor={(item) => item.id} // Asegúrate de que cada paciente tiene un id
                                    renderItem={({ item }) => {
                                        // Configuramos la alerta de confirmación de eliminación para cada paciente
                                        const showDeletePatientAlert = ConfirmDeleteAlert({
                                            itemId: item.id,
                                            itemName: item.nombreApellido,
                                            onConfirm: handleDeletePatient, // Función que elimina al paciente
                                        });

                                        return (
                                            <PacienteListItem
                                                paciente={item}
                                                onDelete={showDeletePatientAlert} // La alerta de eliminación se muestra cuando se presiona el botón
                                            />
                                        );
                                    }}
                                />
                            )}
                            <Text style={styles.sectionTitle}>Vincular nuevo usuario</Text>
                            <View style={styles.connectionOptions}>
                                <TouchableOpacity style={styles.optionContainer} onPress={() => setEmailModalVisible(true)} >
                                    <Text style={styles.optionText}>Añadir con mail</Text>
                                    <MessageIcon size={24} color="black" />
                                </TouchableOpacity>

                                {/* Opción: Agregar por código QR */}
                                <TouchableOpacity style={styles.optionContainer} onPress={() => setQRModalVisible(true)}>
                                    <Text style={styles.optionText}>Añadir con codigo QR</Text>
                                    <QrIcon size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <AddPatientModal
                                visible={isEmailModalVisible}
                                onClose={() => setEmailModalVisible(false)}
                                onSubmit={handleFetchUserRewards}
                            />
                        </>
                    ) : (
                        <>
                            <PatientQRCode email={user.email} />
                        </>
                    )}
                    <Button
                        title="Cerrar Sesión"
                        onPress={handleLogout}
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


    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    profileEmail: {
        fontSize: 16,
        color: '#777',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Para que el texto esté a la izquierda y el ícono a la derecha
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para el modal
    },
    modalContainer: {
        width: '80%', // Ajusta el ancho del modal según sea necesario
        maxHeight: '50%', // Ajusta la altura máxima del modal según sea necesario
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
        width: '100%',
    },
});


export default ProfileScreen;