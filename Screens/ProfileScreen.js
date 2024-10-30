import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Button, Pressable } from 'react-native';
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
import { globalStyles } from '../Utils/globalStyles';
import { SPACING, COLORS } from '../Utils/Constant';





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
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Paciente eliminado correctamente. Toca aquí para cerrar.',

                });
            }
        } catch (error) {
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
        <View style={[globalStyles.container, { flexDirection: 'column' }]}>
            {loading && <LoadingScreen accessibilityLiveRegion="assertive" accessibilityLabel="Cargando, por favor espere" />}
            {!loading && (
                <>
                    {/* Perfil del usuario */}
                    <View style={styles.profileSection}>
                        <Text style={globalStyles.title}>
                            {user.nombreApellido}
                        </Text>
                        <Text style={globalStyles.text}>
                            {user.email}
                        </Text>
                    </View>
                    {!isPaciente() ? (
                        <>
                            <Text style={[globalStyles.lessBoldText, { marginBottom: SPACING.small }]} accessibilityRole="header">Usuarios vinculados</Text>
                            <View style={{ flex: 1 }}>
                                {loadingPatients ? (
                                    <LoadingScreen accessibilityLiveRegion="assertive" accessibilityLabel="Cargando pacientes, por favor espere" />
                                ) : patients.length === 0 ? (
                                    <View style={globalStyles.centeredContainer}>
                                        <Text style={globalStyles.noDataText}>No hay usuarios vinculados.</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={patients}
                                        keyExtractor={(item) => item.id}
                                        renderItem={renderPacienteItem}
                                    />
                                )}
                            </View>
                            <View style={styles.connectionOptions}>
                                <Text style={[globalStyles.lessBoldText, { marginTop: SPACING.small }]} accessibilityRole="header">Vincular nuevo usuario</Text>
                                <TouchableOpacity
                                    style={styles.optionContainer}
                                    onPress={() => setEmailModalVisible(true)}
                                    accessibilityLabel="Añadir usuario por correo electrónico"
                                    accessibilityHint="A continuación se abrirá un modal para ingresar el correo del usuario">
                                    <Text style={globalStyles.text}>Añadir con mail</Text>
                                    <MessageIcon size={24} color="black" accessibilityLabel="Icono de mensaje para añadir usuario por email" />
                                </TouchableOpacity>

                                <Pressable
                                    style={styles.optionContainer}
                                    onPress={() => setQRModalVisible(true)}
                                    accessibilityLabel="Añadir usuario mediante código Q R"
                                    accessibilityHint="A continuación se abrirá la cámara para escanear el Q R de un usuario"
                                    accessibilityRole="button"
                                >
                                    <Text style={globalStyles.text}>Añadir con código QR</Text>
                                    <QrIcon size={24} color="black" />
                                </Pressable>

                            </View>
                            <AddPatientModal
                                visible={isEmailModalVisible}
                                onClose={() => setEmailModalVisible(false)}
                                onSubmit={handleFetchUserRewards}
                            />
                            <QRScannerModal
                                visible={isQRModalVisible}
                                onClose={() => setQRModalVisible(false)}
                                onScan={handleFetchUserRewards}
                            />
                        </>
                    ) : (
                        <PatientQRCode
                            email={user.email}
                            accessible={true} // Hacer accesible el componente
                            accessibilityLabel={`Código Q R del usuario ${user.email}`} // Descripción clara para el lector de pantalla
                            accessibilityHint="Use otro dispositivo para escanear este código QR si necesita compartir información del paciente." // Información adicional para guiar al usuario
                            accessibilityRole="image" // Indica que es una imagen, ya que TalkBack entenderá esto de forma más apropiada
                        />
                    )}
                    <View style={[styles.buttonsContainer, isPaciente() && styles.extraStyle]}>
                        <TouchableOpacity
                            style={globalStyles.button}
                            onPress={handleLogout}
                            accessibilityLabel="Cerrar sesión"
                            accessibilityHint="Cerrar la sesión actual y regresar a la pantalla de inicio de sesión">
                            <Text style={globalStyles.buttonText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
        paddingVertical: SPACING.small,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',  // Mantiene el diseño para alinear texto e ícono
        alignItems: 'center',
        paddingVertical: SPACING.small,  // Utiliza SPACING definido para mantener consistencia
        borderBottomWidth: 1,
        borderBottomColor: COLORS.inputBorder,  // Reutiliza un color definido para bordes
    },

    buttonsContainer: {
        justifyContent: 'flex-end',
    },
    extraStyle: {
        flexGrow: 1,
    }
});


export default ProfileScreen;