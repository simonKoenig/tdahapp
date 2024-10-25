
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

    useEffect(() => {
        const loadTasks = async () => {
            // Si el usuario no está autenticado, no hace nada
            if (!user) {
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
                    let tasksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    // Ordenar tareas directamente aquí antes de establecerlas en el estado
                    const completedTasks = tasksList
                        .filter(task => task.estado.toLowerCase() === 'finalizada')
                        .sort((a, b) => {
                            return (b.correccion?.correctionDate?.seconds || 0) - (a.correccion?.correctionDate?.seconds || 0);
                        });

                    const uncompletedTasks = tasksList
                        .filter(task => task.estado.toLowerCase() !== 'finalizada')
                        .sort((a, b) => {
                            return (a.date?.seconds || 0) - (b.date?.seconds || 0);
                        });

                    const finalTasks = [...uncompletedTasks, ...completedTasks];

                    console.log('Setting tasks from snapshot');
                    setTasks(finalTasks);
                    await setAsyncStorage(`tasks_${user.uid}`, finalTasks);
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

    }, [selectedPatientId, user]);

    //Se usa la misma función para el paciente, donde si no se le pasa el uid, se toma el uid del paciente logueado
    const fetchTasks = async (uid = null) => {
        const userId = uid || user?.uid;
        if (userId) {
            try {
                console.log('Fetching tasks for UID:', userId);

                // Crear la referencia y la consulta con la ordenación deseada en Firestore
                const tasksRef = collection(db, 'usuarios', userId, 'tareas');
                const tasksSnapshot = await getDocs(tasksRef);
                let tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Ordenar las tareas después de obtenerlas de Firestore
                const completedTasks = tasksList
                    .filter(task => task.estado.toLowerCase() === 'finalizada')
                    .sort((a, b) => {
                        // Ordenar por correctionDate de mayor a menor
                        return (b.correccion?.correctionDate?.seconds || 0) - (a.correccion?.correctionDate?.seconds || 0);
                    });

                const uncompletedTasks = tasksList
                    .filter(task => task.estado.toLowerCase() !== 'finalizada')
                    .sort((a, b) => {
                        // Ordenar por fecha para que las tareas que vencen primero estén arriba
                        return (a.date?.seconds || 0) - (b.date?.seconds || 0);
                    });

                // Combinar las listas ordenadas
                const finalTasks = [...uncompletedTasks, ...completedTasks];

                // Actualizar el estado con las tareas ordenadas
                setTasks(finalTasks);

                // Verificación de las tareas ordenadas
                console.log("Tareas después de ordenar en fetchTasks:");
                finalTasks.forEach(task => {
                    console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                });

                return finalTasks;
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

                // Añadir la nueva tarea y luego ordenar todas las tareas
                setTasks(prevTasks => {
                    const updatedTasks = [...prevTasks, newTask];

                    // Ordenar las tareas después de añadir la nueva tarea
                    const completedTasks = updatedTasks
                        .filter(task => task.estado.toLowerCase() === 'finalizada')
                        .sort((a, b) => {
                            return (b.correccion?.correctionDate?.seconds || 0) - (a.correccion?.correctionDate?.seconds || 0);
                        });

                    const uncompletedTasks = updatedTasks
                        .filter(task => task.estado.toLowerCase() !== 'finalizada')
                        .sort((a, b) => {
                            return (a.date?.seconds || 0) - (b.date?.seconds || 0);
                        });

                    return [...uncompletedTasks, ...completedTasks];
                });

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
        // Usa el uid pasado como parámetro o el uid del usuario actual
        const userId = uid || user?.uid;
        if (userId) {
            try {
                console.log('Updating task with ID:', id);
                const taskRef = doc(db, 'usuarios', userId, 'tareas', id);
                await updateDoc(taskRef, updatedTask);

                // Actualiza la lista de tareas en el estado local
                setTasks(prevTasks => {
                    // Imprimir antes de modificar las tareas
                    console.log("Antes de modificar y ordenar:");

                    prevTasks.forEach(task => {
                        console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                    });

                    // Actualizamos la tarea correspondiente si coincide con el `id`
                    let updatedTasks = prevTasks.map(task =>
                        task.id === id ? { id, ...updatedTask } : task
                    );

                    // Separamos las tareas finalizadas y no finalizadas
                    let completedTasks = updatedTasks.filter(task => task.estado.toLowerCase() === 'finalizada');
                    let uncompletedTasks = updatedTasks.filter(task => task.estado.toLowerCase() !== 'finalizada');

                    // Verificar los valores de `correctionDate` de las tareas finalizadas
                    console.log("Tareas finalizadas antes de ordenar:");
                    completedTasks.forEach(task => {
                        console.log(`Tarea: ${task.nombre}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                    });

                    // Ordenar las tareas finalizadas por correctionDate de mayor a menor
                    completedTasks = completedTasks.sort((a, b) => {
                        const dateA = a.correccion?.correctionDate?.seconds || 0;
                        const dateB = b.correccion?.correctionDate?.seconds || 0;
                        return dateB - dateA;
                    });

                    // Combinar las listas para el estado final
                    const finalTasks = [...uncompletedTasks, ...completedTasks];

                    // Imprimir después de ordenar y combinar
                    console.log("Lista final después de ordenar:");
                    finalTasks.forEach(task => {
                        console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                    });

                    return finalTasks;
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

    return (
        <TasksContext.Provider value={{ tasks, setTasks, fetchTasks, addTask, updateTask, deleteTask, getTask }}>
            {children}
        </TasksContext.Provider>
    );

};