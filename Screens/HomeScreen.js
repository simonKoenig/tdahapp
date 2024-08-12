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
    const { setSelectedPatientId } = useContext(PatientsContext);

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
            </View>

        </View>
    );
}

export default HomeScreen;