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

import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
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
            setPatients(patientsList);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [user]);

    const addPatient = async (patient) => {
        if (user) {
            const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
            const docRef = await addDoc(patientsRef, patient);
            setPatients([...patients, { id: docRef.id, ...patient }]);
            return docRef; // Asegúrate de devolver el documento agregado
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

                // Copiar todos los campos del usuario fuente
                await setDoc(targetDocRef, userData);

                // Copiar la colección de recompensas
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

    return (
        <PatientsContext.Provider value={{ patients, fetchPatients, addPatient, copyUserData }}>
            {children}
        </PatientsContext.Provider>
    );
};