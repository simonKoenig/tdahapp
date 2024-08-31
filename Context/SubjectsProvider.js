
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { onSnapshot } from 'firebase/firestore';
import { AuthContext } from './AuthProvider';
import { PatientsContext } from './PatientsProvider'; // Importa el contexto de PatientsProvider

export const SubjectsContext = createContext();

export const SubjectsProvider = ({ children }) => {
    const { user, isPaciente } = useContext(AuthContext);
    const { selectedPatientId } = useContext(PatientsContext);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        // Si el usuario no está autenticado, no hace nada
        if (!user){
            return;
        }
        // Si el usuario es un paciente, se suscribe a sus propias recompensas en tiempo real
        if (isPaciente()) {
            
            // Cancela la suscripción anterior si existe
            if (unsubscribe) {
                unsubscribe();
            }
            
            // Usa las recompensas en caché si existen
            const cachedSubjects = localStorage.getItem(`subjects_${selectedPatientId}`);
            if (cachedSubjects) {
                console.log('Setting subjects from cache');
                setSubjects(JSON.parse(cachedSubjects));
            }

            // Crea una referencia a la colección de recompensas del usuario
            const subjectsRef = collection(db, 'usuarios', selectedPatientId, 'materias');
            // Se suscribe a los cambios en la colección de recompensas
            const newUnsubscribe = onSnapshot(subjectsRef, (snapshot) => {
                const subjectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubjects(subjectsList);
                console.log('Setting subjects from snapshot');
                localStorage.setItem(`subjects_${selectedPatientId}`, JSON.stringify(subjectsList));
            });

            // Guarda la nueva función de desuscripción
            setUnsubscribe(() => newUnsubscribe);
        }
        // Si el usuario tiene rol de administrador, utiliza el caché y el fetch
        else {
            // Cancela la suscripción anterior si existe
            if (unsubscribe) {
                unsubscribe();
            }
            
            // Usa las recompensas en caché si existen, sino las obtiene con el fetch
            const cachedSubjects = localStorage.getItem(`subjects_${selectedPatientId}`);
            if (cachedSubjects) {
                console.log('Setting subjects from cache');
                setSubjects(JSON.parse(cachedSubjects));
            }
            else {
                console.log('Fetching subjects');
                fetchSubjects(selectedPatientId);
            }
        }

        // Cancela la suscripción al desmontar el componente
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };

    }, [selectedPatientId]);

    const fetchSubjects = async (uid) => {
        if (uid) {
            try {
                console.log('Fetching subjects for UID:', uid);
                const subjectsRef = collection(db, 'usuarios', uid, 'materias'); // Se crea una referencia a la colección de materias del usuario
                const subjectsSnapshot = await getDocs(subjectsRef); // Se obtiene un snapshot de la colección de materias
                const subjectsList = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Se crea una lista de materias a partir del snapshot
                setSubjects(subjectsList); // Se actualiza el estado de materias con la lista obtenida
                localStorage.setItem(`subjects_${uid}`, JSON.stringify(subjectsList));
                return subjectsList; // Se retorna la lista de materias
                // setCurrentPatientId(patientId);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        }
    };

    const addSubject = async (subject, uid) => {
        if (uid) {
            try {
                console.log('Adding subject for UID:', uid);
                const subjectsRef = collection(db, 'usuarios', uid, 'materias'); // Se crea una referencia a la colección de materias del usuario
                const docRef = await addDoc(subjectsRef, subject); // Se añade un documento a la colección de materias
                setSubjects(prevsubjects => [...prevsubjects, { id: docRef.id, ...subject }]); // Se actualiza el estado de materias con la nueva materia
            } catch (error) {
                console.error('Error adding subject:', error);
            }
        } else {
            console.error('No UID provided');
        }
    };


    const updateSubject = async (id, updatedsubject, uid) => {
        if (uid) {
            try {
                console.log('Updating subject with ID:', id);
                const subjectRef = doc(db, 'usuarios', uid, 'materias', id); // Se crea una referencia al documento de la materia
                await updateDoc(subjectRef, updatedsubject); // Se actualiza el documento de la materia
                setSubjects(subjects.map(subject => (subject.id === id ? { id, ...updatedsubject } : subject))); // Se actualiza el estado de materias
            } catch (error) {
                console.error('Error updating subject:', error);
            }
        }
    };

    const deleteSubject = async (id, uid) => {
        if (uid && id) {
            try {
                console.log('Deleting subject with ID:', id, 'for UID:', uid);
                const subjectRef = doc(db, 'usuarios', uid, 'materias', id);
                await deleteDoc(subjectRef);
                setSubjects(prevsubjects => prevsubjects.filter(subject => subject.id !== id));
            } catch (error) {
                console.error('Error deleting subject:', error);
            }
        } else {
            console.error('No UID or subject ID provided');
        }
    };

    const getSubject = async (id, uid) => {
        console.log('UID:', uid);
        console.log('ID:', id);
        if (uid) {
            try {
                console.log('Getting subject with ID:', id);
                const subjectRef = doc(db, 'usuarios', uid, 'materias', id);
                const subjectDoc = await getDoc(subjectRef);
                if (subjectDoc.exists()) {
                    return { id: subjectDoc.id, ...subjectDoc.data() };
                } else {
                    throw new Error('subject not found');
                }
            } catch (error) {
                console.error('Error getting subject:', error);
                throw error;
            }
        }
    };

    return (
        <SubjectsContext.Provider value={{ subjects, setSubjects, fetchSubjects, addSubject, updateSubject, deleteSubject, getSubject, selectedSubjectId, setSelectedSubjectId }}>
            {children}
        </SubjectsContext.Provider>
    );
};