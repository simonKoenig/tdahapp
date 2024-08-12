
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';

export const PatientsContext = createContext();

export const PatientsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);



    //patients: Contiene la lista completa de pacientes del usuario autenticado.
    //selectedPatientId: Es el ID del paciente seleccionado actualmente por el usuario en la interfaz, y está almacenado en el contexto.

    //Cuando seleccionas un paciente desde el ProfileScreen, actualizas el valor de selectedPatientId con el ID del paciente seleccionado.

    //En ProfileScreen, cuando un usuario selecciona un paciente de la lista desplegable, el estado selectedPatient se actualiza con el valor seleccionado, y luego este valor se usa para actualizar selectedPatientId en PatientsContext.







    //La función fetchPatients se encarga de obtener la lista de pacientes desde Firestore para el usuario autenticado o para un usuario específico 
    //si se pasa un userId. Una vez obtenidos los datos, se actualiza el estado patients.
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


    // Agrega un nuevo paciente a la colección de pacientes
    const addPatient = async (patient) => {
        if (user) {
            const patientsRef = collection(db, 'usuarios', user.uid, 'pacientes');
            const docRef = await addDoc(patientsRef, patient);

            // Actualiza el estado de patients con una nueva referencia de lista
            setPatients(prevPatients => [...prevPatients, { id: docRef.id, ...patient }]);

            return docRef;
        }
    };



    // Obtiene los pacientes de un usuario

    const addPatientByEmail = async (email) => {
        try {
            if (!user) {
                console.error('No hay un usuario autenticado');
                return;
            }

            const usersRef = collection(db, 'usuarios'); // Se genera la referencia a la colección de usuarios
            const q = query(usersRef, where('email', '==', email)); // Se genera la consulta para buscar un usuario por email
            const querySnapshot = await getDocs(q); // Se ejecuta la consulta

            if (querySnapshot.empty) {
                console.error('No se encontró un usuario con ese email'); // Se muestra un error si no se encontró un usuario con ese email
                return;
            }

            const sourceDoc = querySnapshot.docs[0]; // El documento 0 es el unico que hay, ya que al buscar por mail solo puede haber uno
            const sourceUserId = sourceDoc.id;  // Se obtiene el ID del usuario
            const sourceUserData = sourceDoc.data();  // Se obtienen los datos del usuario

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
        <PatientsContext.Provider value={{ patients, fetchPatients, addPatient, addPatientByEmail, selectedPatientId, setSelectedPatientId }}>
            {children}
        </PatientsContext.Provider>
    );
};