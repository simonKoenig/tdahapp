
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, setDoc, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';

export const PatientsContext = createContext();

export const PatientsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const { isPaciente } = useContext(AuthContext);
    const [selectedPatient, setSelectedPatient] = useState(null);



    const fetchPatients = async (userId = null) => {
        try {
            const uid = userId || (user && user.uid);
            if (!uid) {
                console.error('No user ID provided and no authenticated user found.');
                return [];
            }

            const patientsRef = collection(db, 'usuarios', uid, 'pacientes'); // Se genera la referencia a la colección de pacientes
            const patientsSnapshot = await getDocs(patientsRef); // Se obtiene TODOS los documentos de la colección de pacientes
            const patientsList = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Se mapea cada documento de la colección de pacientes a un objeto con el id del documento y los datos del documento

            if (!userId) {
                setPatients([...patientsList]); // Se actualiza el estado de patients si no se proporcionó userId
            }

            return patientsList; // Se retorna la lista de pacientes obtenida
        } catch (error) {
            console.error('Error getting patients:', error);
            return [];
        }
    };

    useEffect(() => {
        if (user && isPaciente() === false) {
            fetchPatients();
        }
    }, [user]);

    // const addPatientByEmail = async (email) => {
    //     try {
    //         if (!user) {
    //             console.error('No hay un usuario autenticado');
    //             return null;
    //         }

    //         const usersRef = collection(db, 'usuarios');
    //         const q = query(usersRef, where('email', '==', email));
    //         const querySnapshot = await getDocs(q);

    //         if (querySnapshot.empty) {
    //             throw new Error('No se encontró un usuario con ese email');

    //         }

    //         const sourceDoc = querySnapshot.docs[0];
    //         const sourceUserId = sourceDoc.id;
    //         const sourceUserData = sourceDoc.data();

    //         setSelectedPatientId(sourceUserId);

    //         const patientsRef = doc(db, 'usuarios', user.uid, 'pacientes', sourceUserId);
    //         const patientDoc = await getDoc(patientsRef);

    //         if (!patientDoc.exists()) {
    //             const newPatientData = {
    //                 patientId: sourceUserId,
    //                 nombreApellido: sourceUserData.nombreApellido || '',
    //                 email: sourceUserData.email || email,
    //                 rol: sourceUserData.rol || 'paciente',
    //             };

    //             await setDoc(patientsRef, newPatientData);
    //             fetchPatients(); // Refresca la lista de pacientes después de agregar uno nuevo
    //         }

    //         return {
    //             uid: sourceUserId,
    //             ...sourceUserData,
    //         };
    //     } catch (error) {
    //         console.error('Error al buscar o agregar paciente por email:', error);
    //         return null;
    //     }
    // };

    const addPatientByEmail = async (email) => {
        try {
            if (!user) {
                throw new Error('No hay un usuario autenticado');
            }

            const usersRef = collection(db, 'usuarios');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const sourceDoc = querySnapshot.docs[0];
            const sourceUserId = sourceDoc.id;
            const sourceUserData = sourceDoc.data();

            setSelectedPatientId(sourceUserId);

            const patientsRef = doc(db, 'usuarios', user.uid, 'pacientes', sourceUserId);
            const patientDoc = await getDoc(patientsRef);

            if (!patientDoc.exists()) {
                const newPatientData = {
                    patientId: sourceUserId,
                    nombreApellido: sourceUserData.nombreApellido || '',
                    email: sourceUserData.email || email,
                    rol: sourceUserData.rol || 'paciente',
                };

                await setDoc(patientsRef, newPatientData);
                fetchPatients(); // Refresca la lista de pacientes después de agregar uno nuevo
            }

            return {
                uid: sourceUserId,
                ...sourceUserData,
            };
        } catch (error) {
            console.error('Error en addPatientByEmail:', error);
            throw error; // Lanzar el error para que sea manejado en un nivel superior
        }
    };

    const deletePatient = async (patientUid, userUid) => {
        if (userUid && patientUid) {
            try {
                console.log('Deleting patient with UID:', patientUid, 'for user UID:', userUid);
                const patientRef = doc(db, 'usuarios', userUid, 'pacientes', patientUid);
                await deleteDoc(patientRef);
                setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientUid));
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        } else {
            console.error('No user or patient UID provided');
        }
    };


    return (
        <PatientsContext.Provider value={{ patients, addPatientByEmail, selectedPatientId, setSelectedPatientId, fetchPatients, deletePatient }}>
            {children}
        </PatientsContext.Provider>
    );
};