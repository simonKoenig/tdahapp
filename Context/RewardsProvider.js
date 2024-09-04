
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';
import { PatientsContext } from './PatientsProvider';
import { setAsyncStorage, getAsyncStorage, updateAsyncStorage, addAsyncStorage, deleteAsyncStorage } from '../Utils/AsyncStorage';

export const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
    const { user, isPaciente } = useContext(AuthContext);
    const [rewards, setRewards] = useState([]);
    const [selectedRewardId, setSelectedRewardId] = useState(null);
    const { selectedPatientId } = useContext(PatientsContext);
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        const loadRewards = async () => {
            // Si el usuario no está autenticado, no hace nada
            if (!user){
                return;
            }
            // Si el usuario es un paciente, se suscribe a sus propias recompensas en tiempo real
            if (isPaciente()) {
                console.log('User is a patient');
                // Cancela la suscripción anterior si existe
                if (unsubscribe) {
                    unsubscribe();
                }
                
                // Usa las recompensas en caché si existen
                const cachedRewards = await getAsyncStorage(`rewards_${user.uid}`);
                if (cachedRewards) {
                    console.log('Setting Rewards from cache');
                    setRewards(cachedRewards);
                }
                else {
                    console.log('Fetching rewards');
                    fetchRewards(user.uid);
                }

                // Crea una referencia a la colección de recompensas del usuario
                const rewardsRef = collection(db, 'usuarios', user.uid, 'recompensas');
                // Se suscribe a los cambios en la colección de recompensas
                const newUnsubscribe = onSnapshot(rewardsRef, async (snapshot) => {
                    const rewardsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setRewards(rewardsList);
                    console.log('Setting rewards from snapshot');
                    await setAsyncStorage(`rewards_${user.uid}`, rewardsList);
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
                const cachedRewards = await getAsyncStorage(`rewards_${selectedPatientId}`);
                console.log('Cached rewards:', cachedRewards); 
                if (cachedRewards) {
                    console.log('Setting rewards from cache');
                    setRewards(cachedRewards);
                } else {
                    console.log('Fetching rewards');
                    fetchRewards(selectedPatientId);
                }
            }

            // Cancela la suscripción al desmontar el componente
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        }
        loadRewards();
    }, [selectedPatientId, user]);

    const fetchRewards = async (uid) => {
        if (uid) {
            try {
                console.log('Fetching rewards for UID:', uid);
                const rewardsRef = collection(db, 'usuarios', uid, 'recompensas');
                const rewardsSnapshot = await getDocs(rewardsRef);
                const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRewards(rewardsList);
                await setAsyncStorage(`rewards_${selectedPatientId}`, rewardsList); // Guarda las recompensas en caché
                return rewardsList;
            } catch (error) {
                console.error('Error fetching rewards:', error);
            }
        }
    };

    const addReward = async (reward, uid) => {
        if (uid) {
            try {
                console.log('Adding reward for UID:', uid);
                const rewardsRef = collection(db, 'usuarios', uid, 'recompensas');
                const docRef = await addDoc(rewardsRef, reward);
                const newReward = { id: docRef.id, ...reward };
                setRewards(prevRewards => [...prevRewards, newReward]);
                await addAsyncStorage(`rewards_${uid}`, newReward);
            } catch (error) {
                console.error('Error adding reward:', error);
            }
        } else {
            console.error('No UID provided');
        }
    };


    const updateReward = async (id, updatedReward, uid) => {
        if (uid) {
            try {
                console.log('Updating reward with ID:', id);
                const rewardRef = doc(db, 'usuarios', uid, 'recompensas', id);
                await updateDoc(rewardRef, updatedReward);
                setRewards(rewards.map(reward => (reward.id === id ? { id, ...updatedReward } : reward)));
                const updatedRewardWithId = { id, ...updatedReward };
                await updateAsyncStorage(`rewards_${uid}`, updatedRewardWithId);
            } catch (error) {
                console.error('Error updating reward:', error);
            }
        }
    };

    const deleteReward = async (id, uid) => {
        if (uid && id) {
            try {
                console.log('Deleting reward with ID:', id, 'for UID:', uid);
                const rewardRef = doc(db, 'usuarios', uid, 'recompensas', id);
                await deleteDoc(rewardRef);
                setRewards(prevRewards => prevRewards.filter(reward => reward.id !== id));
                await deleteAsyncStorage(`rewards_${uid}`, id);
            } catch (error) {
                console.error('Error deleting reward:', error);
            }
        } else {
            console.error('No UID or reward ID provided');
        }
    };

    const getReward = async (id, uid) => {
        console.log('UID:', uid);
        console.log('ID:', id);
        if (uid) {
            try {
                console.log('Getting reward with ID:', id);
                const rewardRef = doc(db, 'usuarios', uid, 'recompensas', id);
                const rewardDoc = await getDoc(rewardRef);
                if (rewardDoc.exists()) {
                    return { id: rewardDoc.id, ...rewardDoc.data() };
                } else {
                    throw new Error('Reward not found');
                }
            } catch (error) {
                console.error('Error getting reward:', error);
                throw error;
            }
        }
    };

    return (
        <RewardsContext.Provider value={{ rewards, setRewards, fetchRewards, addReward, updateReward, deleteReward, getReward, selectedRewardId, setSelectedRewardId }}>
            {children}
        </RewardsContext.Provider>
    );
};