import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, RefreshControl, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Context/AuthProvider';
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de que la ruta sea correcta
import { PatientsContext } from '../Context/PatientsProvider';

function ProfileScreen() {
    const { logout, isAuthenticated, user } = useContext(AuthContext);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);


    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const { patients, setSelectedPatientId, addPatientByEmail, selectedPatientId, fetchPatients, deletePatient } = useContext(PatientsContext);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };
    console.log('Patients:', patients);
    console.log('Selected patient ID:', selectedPatientId);
    console.log('UserUid:', user.uid);

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