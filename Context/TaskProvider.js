
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';


export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async (uid) => {
        if (uid) {
            try {
                console.log('Fetching tasks for UID:', uid);
                const tasksRef = collection(db, 'usuarios', uid, 'tareas');
                const tasksSnapshot = await getDocs(tasksRef);
                const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTasks(tasksList);
                return tasksList;
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }
    }

    const addTask = async (task, uid) => {
        if (uid) {
            try {
                console.log('Adding task for UID:', uid);
                const tasksRef = collection(db, 'usuarios', uid, 'tareas');
                const docRef = await addDoc(tasksRef, task);
                setTasks(prevTasks => [...prevTasks, { id: docRef.id, ...task }]);
            } catch (error) {
                console.error('Error adding task:', error);
            }
        } else {
            console.error('No UID provided');
        }
    }

    const updateTask = async (id, updatedTask, uid) => {
        if (uid) {
            try {
                console.log('Updating task with ID:', id);
                const taskRef = doc(db, 'usuarios', uid, 'tareas', id);
                await updateDoc(taskRef, updatedTask);
                setTasks(tasks.map(task => (task.id === id ? { id, ...updatedTask } : task)));
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    }

    const deleteTask = async (id, uid) => {
        if (uid && id) {
            try {
                console.log('Deleting task with ID:', id, 'for UID:', uid);
                const taskRef = doc(db, 'usuarios', uid, 'tareas', id);
                await deleteDoc(taskRef);
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        } else {
            console.error('No UID or task ID provided');
        }
    }

    const getTask = async (id, uid) => {
        console.log('UID:', uid);
        console.log('ID:', id);
        if (uid) {
            try {
                console.log('Getting task with ID:', id);
                const taskRef = doc(db, 'usuarios', uid, 'tareas', id);
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

    const patientGetTasks = async (id) => {
        if (user) {
            const rewardRef = doc(db, 'usuarios', user.uid, 'tareas', id);
            const rewardDoc = await getDoc(rewardRef);
            if (rewardDoc.exists()) {
                return { id: rewardDoc.id, ...rewardDoc.data() };
            } else {
                throw new Error('Task not found');
            }
        }
    }

    return (
        <TasksContext.Provider value={{ tasks, setTasks, fetchTasks, addTask, updateTask, deleteTask, getTask, patientGetTasks }}>
            {children}
        </TasksContext.Provider>
    );

};