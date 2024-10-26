
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
                    setTasks(sortTasks(cachedTasks)); // Ordenar las tareas antes de establecerlas en el estado
                } else {
                    console.log('Fetching tasks');
                    fetchTasks(user.uid);
                }

                // Crea una referencia a la colección de recompensas del usuario
                const tasksRef = collection(db, 'usuarios', user.uid, 'tareas');

                // Se suscribe a los cambios en la colección de recompensas
                const newUnsubscribe = onSnapshot(tasksRef, async (snapshot) => {
                    // Convertir los documentos de Firestore en objetos
                    let tasksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    // Log antes de ordenar
                    console.log("Tareas desde snapshot antes de ordenar:");
                    tasksList.forEach(task => {
                        console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                    });

                    // Ordenar las tareas usando la función `sortTasks`
                    const sortedTasks = sortTasks(tasksList);

                    // Log después de ordenar
                    console.log("Tareas después de ordenar desde snapshot:");
                    sortedTasks.forEach(task => {
                        console.log(`Tarea: ${task.nombre}, Estado: ${task.estado}, correctionDate: ${task.correccion?.correctionDate?.seconds}`);
                    });

                    // Actualizar el estado con la lista ordenada
                    setTasks(sortedTasks);
                    console.log('Setting tasks from snapshot');

                    // Guardar las tareas ordenadas en AsyncStorage
                    await setAsyncStorage(`tasks_${user.uid}`, sortedTasks);
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
                    setTasks(sortTasks(cachedTasks)); // Ordenar las tareas antes de establecerlas en el estado
                } else {
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
        <TasksContext.Provider value={{ tasks, setTasks, fetchTasks, addTask, updateTask, deleteTask, getTask }}>
            {children}
        </TasksContext.Provider>
    );

};