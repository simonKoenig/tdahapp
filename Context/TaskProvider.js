
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
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
    const [loadingTasks, setLoadingTasks] = useState(true);


    useEffect(() => {
        const loadTasks = async () => {
            if (!user) return;

            if (isPaciente()) {
                if (unsubscribe) unsubscribe();
                setLoadingTasks(true); // Arranca en true cuando comienza la carga

                const cachedTasks = await getAsyncStorage(`tasks_${user.uid}`);
                if (cachedTasks) {
                    console.log('Setting Tasks from cache');
                    setTasks(sortTasks(cachedTasks));
                    setLoadingTasks(false); // Desactivar el indicador de carga si se encuentran en caché

                } else {
                    console.log('Fetching tasks');
                    fetchTasks(user.uid);

                }

                const tasksRef = collection(db, 'usuarios', user.uid, 'tareas');
                const newUnsubscribe = onSnapshot(tasksRef, async (snapshot) => {
                    let tasksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const sortedTasks = sortTasks(tasksList);
                    setTasks(sortedTasks);
                    setLoadingTasks(false); // Desactivar el indicador de carga si se encuentran en caché
                    await setAsyncStorage(`tasks_${user.uid}`, sortedTasks);

                });
                setUnsubscribe(() => newUnsubscribe);
            } else {
                if (!selectedPatientId) {
                    console.error('No selected patient ID');
                    setLoadingTasks(false); // Cambia a false cuando se cargan del caché
                    return;
                }

                if (unsubscribe) unsubscribe();

                const cachedTasks = await getAsyncStorage(`tasks_${selectedPatientId}`);
                if (cachedTasks) {
                    console.log('Setting Tasks from cache');
                    setTasks(sortTasks(cachedTasks));
                    setLoadingTasks(false); // Cambia a false cuando se cargan del caché

                } else {
                    console.log('Fetching tasks');
                    fetchTasks(selectedPatientId);
                }
            }

            return () => {
                if (unsubscribe) unsubscribe();
            };
        };
        loadTasks();
    }, [selectedPatientId, user]);


    //Se usa la misma función para el paciente, donde si no se le pasa el uid, se toma el uid del paciente logueado
    const fetchTasks = async (uid = null) => {
        const userId = uid || user?.uid;
        if (userId) {
            setLoadingTasks(true); // Activa el indicador de carga al inicio de fetchTasks
            try {
                console.log('Fetching tasks for UID:', userId);

                // Obtener la lista de tareas desde Firestore
                const tasksRef = collection(db, 'usuarios', userId, 'tareas');
                const tasksSnapshot = await getDocs(tasksRef);
                const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Ordenar usando `sortTasks` y actualizar el estado
                const finalTasks = sortTasks(tasksList);
                setTasks(finalTasks);

                // Verificación de las tareas ordenadas
                console.log("Tareas después de ordenar en fetchTasks:");
                finalTasks.forEach(task => {
                    console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                });

                return finalTasks;
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoadingTasks(false); // Desactiva `loadingTasks` después de completar o fallar
            }
        } else {
            console.error('UID or user is not defined');
            setLoadingTasks(false); // Desactiva si no hay UID
        }
    };


    const addTask = async (task, uid) => {
        if (uid) {
            try {
                console.log('Adding task for UID:', uid);
                const tasksRef = collection(db, 'usuarios', uid, 'tareas');
                const docRef = await addDoc(tasksRef, task);
                const newTask = { id: docRef.id, ...task };

                // Añadir la nueva tarea y luego ordenar todas las tareas con `sortTasks`
                setTasks(prevTasks => sortTasks([...prevTasks, newTask]));

                // También actualizar AsyncStorage para mantener el cache actualizado
                await addAsyncStorage(`tasks_${uid}`, newTask);
            } catch (error) {
                console.error('Error adding task:', error);
            }
        } else {
            console.error('No UID provided');
        }
    };


    const updateTask = async (id, updatedTask, uid = null) => {
        const userId = uid || user?.uid;
        if (userId) {
            try {
                console.log('Updating task with ID:', id);
                const taskRef = doc(db, 'usuarios', userId, 'tareas', id);
                await updateDoc(taskRef, updatedTask);

                // Actualiza la lista de tareas en el estado local y luego ordena
                setTasks(prevTasks => {
                    // Log antes de actualizar y ordenar
                    console.log("Tareas antes de actualizar y ordenar:");
                    prevTasks.forEach(task => {
                        console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                    });

                    // Actualiza la tarea en la lista
                    const updatedTasks = prevTasks.map(task =>
                        task.id === id ? { id, ...updatedTask } : task
                    );

                    // Ordenar las tareas después de actualizar la tarea sin importar el campo
                    const sortedTasks = sortTasks(updatedTasks);

                    // Log después de ordenar
                    console.log("Tareas después de ordenar:");
                    sortedTasks.forEach(task => {
                        console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                    });

                    return sortedTasks;
                });

                // Actualiza también AsyncStorage (opcional)
                const updatedTaskWithId = { id, ...updatedTask };
                await updateAsyncStorage(`tasks_${userId}`, updatedTaskWithId);
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

    const sortTasks = (tasks) => {
        // Crear dos grupos: tareas no finalizadas y tareas finalizadas
        const uncompletedTasks = tasks.filter(task => task.estado.toLowerCase() !== 'finalizada');
        const completedTasks = tasks.filter(task => task.estado.toLowerCase() === 'finalizada');

        // Ordenar las tareas no finalizadas por 'date' de menor a mayor
        uncompletedTasks.sort((a, b) => {
            return a.date.seconds - b.date.seconds;
        });

        // Ordenar las tareas finalizadas por 'correctionDate' de mayor a menor
        completedTasks.sort((a, b) => {
            return (b.correccion?.correctionDate?.seconds || 0) - (a.correccion?.correctionDate?.seconds || 0);
        });

        // Combinar los grupos: primero no finalizadas, luego finalizadas
        return [...uncompletedTasks, ...completedTasks];
    };



    return (
        <TasksContext.Provider value={{ tasks, loadingTasks, setTasks, fetchTasks, addTask, updateTask, deleteTask, getTask }}>
            {children}
        </TasksContext.Provider>
    );

};