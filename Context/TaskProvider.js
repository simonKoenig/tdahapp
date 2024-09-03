
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';
import { PatientsContext } from './PatientsProvider';
import { setAsyncStorage, getAsyncStorage, updateAsyncStorage, addAsyncStorage, deleteAsyncStorage } from '../Utils/AsyncStorage';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const { user, isPaciente } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const { selectedPatientId } = useContext(PatientsContext);
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        const loadTasks = async () => {
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
                const cachedTasks = await getAsyncStorage(`tasks_${user.uid}`);
                if (cachedTasks) {
                    console.log('Setting Tasks from cache');
                    setTasks(cachedTasks);
                }
                else {
                    console.log('Fetching tasks');
                    fetchTasks(user.uid);
                }

                // Crea una referencia a la colección de recompensas del usuario
                const tasksRef = collection(db, 'usuarios', user.uid, 'tareas');
                // Se suscribe a los cambios en la colección de recompensas
                const newUnsubscribe = onSnapshot(tasksRef, async (snapshot) => {
                    const tasksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setTasks(tasksList);
                    console.log('Setting tasks from snapshot');
                    await setAsyncStorage(`tasks_${user.uid}`, tasksList);
                });

                // Guarda la nueva función de desuscripción
                setUnsubscribe(() => newUnsubscribe);
            }
            // Si el usuario tiene rol de administrador, utiliza el caché y el fetch
            else {
                // Si no hay un paciente seleccionado, sale de la función
                if (!selectedPatientId) {
                    console.error('No selected patient ID');
                    return;
                }

                // Cancela la suscripción anterior si existe
                if (unsubscribe) {
                    unsubscribe();
                }

                
                // Usa las recompensas en caché si existen, sino las obtiene con el fetch
                const cachedTasks = await getAsyncStorage(`tasks_${selectedPatientId}`);
                if (cachedTasks) {
                    console.log('Setting Tasks from cache');
                    setTasks(cachedTasks);
                }
                else {
                    console.log('Fetching tasks');
                    fetchTasks(selectedPatientId);
                }
            }

            // Cancela la suscripción al desmontar el componente
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        };
        loadTasks();

    }, [selectedPatientId]);

    //Se usa la misma función para el paciente, donde si no se le pasa el uid, se toma el uid del paciente logueado
    const fetchTasks = async (uid = null) => {
        // Usa el uid pasado como parámetro o el uid del usuario actual
        const userId = uid || user?.uid;
        if (userId) {
            try {
                console.log('Fetching tasks for UID:', userId);
                const tasksRef = collection(db, 'usuarios', userId, 'tareas');
                const tasksSnapshot = await getDocs(tasksRef);
                const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTasks(tasksList);
                await setAsyncStorage(`tasks_${userId}`, tasksList);
                return tasksList;
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        } else {
            console.error('UID or user is not defined');
        }
    };

    const addTask = async (task, uid) => {
        if (uid) {
            try {
                console.log('Adding task for UID:', uid);
                const tasksRef = collection(db, 'usuarios', uid, 'tareas');
                const docRef = await addDoc(tasksRef, task);
                const newTask = { id: docRef.id, ...task };
                setTasks(prevTasks => [...prevTasks, newTask]);
                await addAsyncStorage(`tasks_${uid}`, newTask);
            } catch (error) {
                console.error('Error adding task:', error);
            }
        } else {
            console.error('No UID provided');
        }
    }

    const updateTask = async (id, updatedTask, uid = null) => {
        // Usa el uid pasado como parámetro o el uid del usuario actual
        const userId = uid || user?.uid;
        if (userId) {
            try {
                console.log('Updating task with ID:', id);
                const taskRef = doc(db, 'usuarios', userId, 'tareas', id);
                await updateDoc(taskRef, updatedTask);

                // Actualiza la lista de tareas en el estado
                setTasks(prevTasks => prevTasks.map(task => (task.id === id ? { id, ...updatedTask } : task)));
                const updatedTaskWithId = { id, ...updatedTask };
                await updateAsyncStorage(`tasks_${uid}`, updatedTaskWithId);
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            console.error('UID or user is not defined');
        }
    };

    const deleteTask = async (id, uid) => {
        if (uid && id) {
            try {
                console.log('Deleting task with ID:', id, 'for UID:', uid);
                const taskRef = doc(db, 'usuarios', uid, 'tareas', id);
                await deleteDoc(taskRef);
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                await deleteAsyncStorage(`tasks_${uid}`, id);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        } else {
            console.error('No UID or task ID provided');
        }
    }

    const getTask = async (id, uid = null) => {
        const userId = uid || user?.uid; // Usa el UID proporcionado o el UID del usuario autenticado
        if (userId) {
            try {
                const taskRef = doc(db, 'usuarios', userId, 'tareas', id);
                const taskDoc = await getDoc(taskRef);
                if (taskDoc.exists()) {
                    return { id: taskDoc.id, ...taskDoc.data() };
                } else {
                    throw new Error('task not found');
                }
            } catch (error) {
                console.error('Error getting task:', error);
                throw error;
            }
        }
    }

    return (
        <TasksContext.Provider value={{ tasks, setTasks, fetchTasks, addTask, updateTask, deleteTask, getTask }}>
            {children}
        </TasksContext.Provider>
    );

};