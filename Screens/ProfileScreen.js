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
import { showConfirmAlert } from '../Utils/showConfirmAlert';
import AddPatientModal from '../Modals/AddPatientModal';
import PatientQRCode from '../Components/QR';
import QRScannerModal from '../Modals/QRScannerModal';



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

    const renderPacienteItem = ({ item }) => {
        return (
            <PacienteListItem
                paciente={item}
                onDelete={() => {
                    showConfirmAlert({
                        title: "Confirmar eliminación",
                        message: `¿Estás seguro que deseas eliminar al usuario "${item.nombreApellido}"?`,
                        confirmText: "Eliminar",  // Texto personalizado para el botón de confirmación
                        cancelText: "Cancelar",   // Texto del botón de cancelar
                        onConfirm: () => handleDeletePatient(item.id),  // Función para confirmar la eliminación
                    });
                }}
            />
        );
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
                            <View style={styles.listContainer}>
                                {loadingPatients ? (
                                    <LoadingScreen />
                                ) : patients.length === 0 ? (
                                    <View style={styles.noPatientsContainer}>
                                        <Text style={styles.noPatientsText}>No hay usuarios vinculados.</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={patients} // Lista de pacientes
                                        keyExtractor={(item) => item.id} // Asegúrate de que cada paciente tiene un id
                                        renderItem={renderPacienteItem}
                                    />
                                )}
                            </View>
                            <View style={styles.connectionOptions}>
                                <Text style={styles.sectionTitle}>Vincular nuevo usuario</Text>
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
                            <QRScannerModal
                                visible={isQRModalVisible}
                                onClose={() => setQRModalVisible(false)}
                                onScan={handleFetchUserRewards} // Pasar la función handleScan al modal
                            />
                        </>
                    ) : (
                        <>
                            <PatientQRCode email={user.email} />
                        </>
                    )}
                    <View style={[styles.buttonsContainer, isPaciente() && styles.extraStyle]}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
                        </TouchableOpacity>
                    </View>
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
        flexDirection: 'column',
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
    buttonsContainer: {
        justifyContent: 'flex-end',
    },
    extraStyle: {
        flexGrow: 1,
    },
    logoutButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
    },
    noPatientsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPatientsText: {
        fontSize: 16,
        color: 'gray',
    },
});


export default ProfileScreen;