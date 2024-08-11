// import React, { useState, useContext } from 'react';
// import { View, TextInput, Button, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../firebase-config';
// import { PatientsContext } from '../Context/PatientsProvider';

// const AddPatientScreen = () => {
//     const [email, setEmail] = useState('');
//     const { addPatient, copyUserData } = useContext(PatientsContext);
//     const navigation = useNavigation();
//     const auth = getAuth();
//     const user = auth.currentUser;

//     const handleAddPatient = async () => {
//         try {
//             if (!user) {
//                 console.error('No hay un usuario autenticado');
//                 return;
//             }

//             // Buscar el sourceUserId basado en el email proporcionado
//             const usersRef = collection(db, 'usuarios');
//             const q = query(usersRef, where('email', '==', email));
//             const querySnapshot = await getDocs(q);

//             if (querySnapshot.empty) {
//                 console.error('No se encontró un usuario con ese email');
//                 return;
//             }

//             const sourceUserId = querySnapshot.docs[0].id;

//             // Agregar el nuevo paciente
//             const newPatient = { email };
//             const docRef = await addPatient(newPatient);
//             const targetUserId = docRef.id;

//             // Copiar los datos del usuario fuente al nuevo paciente
//             await copyUserData(sourceUserId, targetUserId, user.uid); // Pasa el ID del usuario logueado

//             navigation.goBack();
//         } catch (error) {
//             console.error('Error adding patient:', error);
//         }
//     };

//     return (
//         <View style={styles.form}>
//             <TextInput
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Email"
//                 style={styles.input}
//             />
//             <Button title="Add Patient" onPress={handleAddPatient} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     form: {
//         padding: 20,
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 20,
//         paddingHorizontal: 10,
//     },
// });

// export default AddPatientScreen;

// import React, { useState, useContext } from 'react';
// import { View, TextInput, Button, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../firebase-config';
// import { PatientsContext } from '../Context/PatientsProvider';

// const AddPatientScreen = () => {
//     const [email, setEmail] = useState('');
//     const { addPatient, copyUserData } = useContext(PatientsContext);
//     const navigation = useNavigation();
//     const auth = getAuth();
//     const user = auth.currentUser;

//     const handleAddPatient = async () => {
//         try {
//             if (!user) {
//                 console.error('No hay un usuario autenticado');
//                 return;
//             }

//             // Buscar el sourceUserId basado en el email proporcionado
//             const usersRef = collection(db, 'usuarios');
//             const q = query(usersRef, where('email', '==', email));
//             const querySnapshot = await getDocs(q);

//             if (querySnapshot.empty) {
//                 console.error('No se encontró un usuario con ese email');
//                 return;
//             }

//             const sourceUserId = querySnapshot.docs[0].id;

//             // Verificar que sourceUserId no sea undefined
//             if (!sourceUserId) {
//                 console.error('sourceUserId es undefined');
//                 return;
//             }

//             // Agregar el nuevo paciente guardando solo la referencia del paciente
//             const newPatient = { patientId: sourceUserId }; // Guardar solo la referencia del paciente
//             const docRef = await addPatient(newPatient);
//             const targetUserId = docRef.id;

//             // No copiar los datos del usuario fuente al nuevo paciente
//             // await copyUserData(sourceUserId, targetUserId, user.uid); // No copiar datos

//             navigation.goBack();
//         } catch (error) {
//             console.error('Error adding patient:', error);
//         }
//     };

//     return (
//         <View style={styles.form}>
//             <TextInput
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Email"
//                 style={styles.input}
//             />
//             <Button title="Add Patient" onPress={handleAddPatient} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     form: {
//         padding: 20,
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 20,
//         paddingHorizontal: 10,
//     },
// });

// export default AddPatientScreen;

import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PatientsContext } from '../Context/PatientsProvider';

const AddPatientScreen = () => {
    const [email, setEmail] = useState('');
    const { addPatientByEmail, fetchPatients } = useContext(PatientsContext);
    const navigation = useNavigation();

    const handleAddPatient = async () => {
        try {
            await addPatientByEmail(email);
            await fetchPatients(); // Asegura que la lista se actualice
            navigation.goBack();
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };

    return (
        <View style={styles.form}>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                style={styles.input}
            />
            <Button title="Add Patient" onPress={handleAddPatient} />
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default AddPatientScreen;
