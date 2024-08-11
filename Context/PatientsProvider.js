// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { collection, getDocs, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '../firebase-config';
// import { AuthContext } from './AuthProvider';

// export const PatientsContext = createContext();

// export const PatientsProvider = ({ children }) => {
//     const { user } = useContext(AuthContext);
//     const [patients, setPatients] = useState([]);

//     const fetchPatients = async () => {
//         if (user) {
//             const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
//             const patientsSnapshot = await getDocs(patientsRef);
//             const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setPatients(patientsList);
//         }
//     };

//     useEffect(() => {
//         fetchPatients();
//     }, [user]);

//     const addPatient = async (patient) => {
//         if (user) {
//             const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
//             const docRef = await addDoc(patientsRef, patient);
//             setPatients([...patients, { id: docRef.id, ...patient }]);
//             return docRef; // Asegúrate de devolver el documento agregado
//         }
//     };
//     const copyUserData = async (sourceUserId, targetUserId, loggedInUserId) => {
//         try {
//             if (!sourceUserId || !targetUserId || !loggedInUserId) {
//                 throw new Error('Uno o más parámetros son undefined');
//             }

//             const sourceDocRef = doc(db, 'usuarios', sourceUserId);
//             const targetDocRef = doc(db, 'usuarios', loggedInUserId, 'pacientes', targetUserId);

//             const sourceDoc = await getDoc(sourceDocRef);
//             if (sourceDoc.exists()) {
//                 const userData = sourceDoc.data();

//                 // Copiar todos los campos del usuario fuente
//                 await setDoc(targetDocRef, userData);

//                 // Copiar la colección de recompensas
//                 const rewardsCollectionRef = collection(sourceDocRef, 'recompensas');
//                 const rewardsSnapshot = await getDocs(rewardsCollectionRef);

//                 for (const rewardDoc of rewardsSnapshot.docs) {
//                     const rewardData = rewardDoc.data();
//                     const targetRewardDocRef = doc(targetDocRef, 'recompensas', rewardDoc.id);
//                     await setDoc(targetRewardDocRef, rewardData);
//                 }
//             } else {
//                 console.error('No se encontró el documento del usuario fuente');
//             }
//         } catch (error) {
//             console.error('Error copiando datos del usuario:', error);
//         }
//     };

//     return (
//         <PatientsContext.Provider value={{ patients, fetchPatients, addPatient, copyUserData }}>
//             {children}
//         </PatientsContext.Provider>
//     );
// };

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { collection, getDocs, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '../firebase-config';
// import { AuthContext } from './AuthProvider';

// export const PatientsContext = createContext();

// export const PatientsProvider = ({ children }) => {
//     const { user } = useContext(AuthContext);
//     const [patients, setPatients] = useState([]);

//     const fetchPatients = async () => {
//         if (user) {
//             const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
//             const patientsSnapshot = await getDocs(patientsRef);
//             const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setPatients(patientsList);
//         }
//     };

//     useEffect(() => {
//         fetchPatients();
//     }, [user]);

//     const addPatient = async (patient) => {
//         if (user) {
//             const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
//             const docRef = await addDoc(patientsRef, patient);
//             setPatients([...patients, { id: docRef.id, ...patient }]);
//             return docRef; // Asegúrate de devolver el documento agregado
//         }
//     };

//     const copyUserData = async (sourceUserId, targetUserId, loggedInUserId) => {
//         try {
//             if (!sourceUserId || !targetUserId || !loggedInUserId) {
//                 throw new Error('Uno o más parámetros son undefined');
//             }

//             const sourceDocRef = doc(db, 'usuarios', sourceUserId);
//             const targetDocRef = doc(db, 'usuarios', loggedInUserId, 'pacientes', targetUserId);

//             const sourceDoc = await getDoc(sourceDocRef);
//             if (sourceDoc.exists()) {
//                 const userData = sourceDoc.data();

//                 // Copiar todos los campos del usuario fuente
//                 await setDoc(targetDocRef, userData);

//                 // Copiar la colección de recompensas
//                 const rewardsCollectionRef = collection(sourceDocRef, 'recompensas');
//                 const rewardsSnapshot = await getDocs(rewardsCollectionRef);

//                 for (const rewardDoc of rewardsSnapshot.docs) {
//                     const rewardData = rewardDoc.data();
//                     const targetRewardDocRef = doc(targetDocRef, 'recompensas', rewardDoc.id);
//                     await setDoc(targetRewardDocRef, rewardData);
//                 }
//             } else {
//                 console.error('No se encontró el documento del usuario fuente');
//             }
//         } catch (error) {
//             console.error('Error copiando datos del usuario:', error);
//         }
//     };

//     //Quiero traerme todos los pacientes de un usuario con un get

//     const getPatientsByUser = async (userId) => {
//         try {
//             const patientsRef = collection(db, 'usuarios', userId, 'pacientes');
//             const patientsSnapshot = await getDocs(patientsRef);
//             const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             return patientsList;
//         } catch (error) {
//             console.error('Error getting patients:', error);
//             return [];
//         }
//     };

//     // Usage example:
//     // const patients = await getPatientsByUser(user.uid);

//     return (
//         <PatientsContext.Provider value={{ patients, fetchPatients, addPatient, copyUserData, getPatientsByUser }}>
//             {children}
//         </PatientsContext.Provider>
//     );
// };

import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';

export const PatientsContext = createContext();

export const PatientsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);

    const fetchPatients = async () => {
        if (user) {
            const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
            const patientsSnapshot = await getDocs(patientsRef);
            const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Forzar la actualización del estado para asegurar que la lista sea reactiva
            setPatients([...patientsList]);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [user]);

    const addPatient = async (patient) => {
        if (user) {
            const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
            const docRef = await addDoc(patientsRef, patient);

            // Actualiza el estado de patients con una nueva referencia de lista
            setPatients(prevPatients => [...prevPatients, { id: docRef.id, ...patient }]);

            return docRef;
        }
    };

    const copyUserData = async (sourceUserId, targetUserId, loggedInUserId) => {
        try {
            if (!sourceUserId || !targetUserId || !loggedInUserId) {
                throw new Error('Uno o más parámetros son undefined');
            }

            const sourceDocRef = doc(db, 'usuarios', sourceUserId);
            const targetDocRef = doc(db, 'usuarios', loggedInUserId, 'pacientes', targetUserId);

            const sourceDoc = await getDoc(sourceDocRef);
            if (sourceDoc.exists()) {
                const userData = sourceDoc.data();
                await setDoc(targetDocRef, userData);

                const rewardsCollectionRef = collection(sourceDocRef, 'recompensas');
                const rewardsSnapshot = await getDocs(rewardsCollectionRef);

                for (const rewardDoc of rewardsSnapshot.docs) {
                    const rewardData = rewardDoc.data();
                    const targetRewardDocRef = doc(targetDocRef, 'recompensas', rewardDoc.id);
                    await setDoc(targetRewardDocRef, rewardData);
                }
            } else {
                console.error('No se encontró el documento del usuario fuente');
            }
        } catch (error) {
            console.error('Error copiando datos del usuario:', error);
        }
    };

    const getPatientsByUser = async (userId) => {
        try {
            const patientsRef = collection(db, 'usuarios', userId, 'pacientes');
            const patientsSnapshot = await getDocs(patientsRef);
            const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return patientsList;
        } catch (error) {
            console.error('Error getting patients:', error);
            return [];
        }
    };

    const addPatientByEmail = async (email) => {
        try {
            if (!user) {
                console.error('No hay un usuario autenticado');
                return;
            }

            const usersRef = collection(db, 'usuarios');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.error('No se encontró un usuario con ese email');
                return;
            }

            const sourceDoc = querySnapshot.docs[0];
            const sourceUserId = sourceDoc.id;
            const sourceUserData = sourceDoc.data();

            if (!sourceUserId) {
                console.error('sourceUserId es undefined');
                return;
            }

            // Extraer los datos necesarios
            const newPatient = {
                patientId: sourceUserId,
                nombreApellido: sourceUserData.nombreApellido || '', // Nombre y apellido del paciente
                email: sourceUserData.email || email, // Email del paciente
                rol: sourceUserData.rol || 'paciente' // Rol del paciente, por defecto "paciente"
            };

            const docRef = await addPatient(newPatient);
            return docRef;
        } catch (error) {
            console.error('Error adding patient by email:', error);
        }
    };

    return (
        <PatientsContext.Provider value={{ patients, fetchPatients, addPatient, copyUserData, getPatientsByUser, addPatientByEmail }}>
            {children}
        </PatientsContext.Provider>
    );
};
