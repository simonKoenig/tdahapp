import React, { useContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../Context/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import { PatientsContext } from '../Context/PatientsProvider';
function HomeScreen() {
    const { user } = useContext(AuthContext);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const { selectedPatientId } = useContext(PatientsContext);
    const [patientInfo, setPatientInfo] = useState(null);

    useEffect(() => {
        const obtenerRol = async () => {
            if (user) {
                const docRef = doc(db, 'usuarios', user.uid); // Referencia al documento del usuario usando su UID
                const docSnap = await getDoc(docRef); // Obtiene el documento del usuario de Firestore
                if (docSnap.exists()) {
                    setRole(docSnap.data().rol); // Actualiza el estado del rol
                } else {
                    console.log('Documento no encontrado'); // Documento no encontrado
                }
                setLoading(false);
            }
        };

        obtenerRol();
    }, [user]);

    useEffect(() => {
        const fetchPatientInfo = async () => {
            if (selectedPatientId) {
                const docRef = doc(db, 'usuarios', selectedPatientId); // Asume que 'usuarios' tiene info de pacientes
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPatientInfo(docSnap.data()); // Guardar la información del paciente seleccionado
                } else {
                    console.log('Paciente no encontrado');
                }
            }
        };

        fetchPatientInfo();
    }, [selectedPatientId]);


    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                {user && <Text>Mail: {user.email}</Text>}
                {user && <Text>UID: {user.uid}</Text>}
                {user && <Text>Nombre y Apellido: {user.nombreApellido}</Text>}
                {user && <Text>Rol: {role}</Text>}
                {patientInfo && (
                    <>
                        <Text>Paciente Seleccionado: {patientInfo.nombreApellido}</Text>
                        <Text>Email del Paciente: {patientInfo.email}</Text>
                        <Text>Rol del Paciente: {patientInfo.rol}</Text>
                    </>
                )}
            </View>

        </View>
    );
}

export default HomeScreen;