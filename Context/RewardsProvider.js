import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';

export const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        const fetchRewards = async () => {
            if (user) {
                const rewardsRef = collection(db, 'usuarios', user.uid, 'recompensas');
                const rewardsSnapshot = await getDocs(rewardsRef);
                const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRewards(rewardsList);
            }
        };

        fetchRewards();
    }, [user]);

    const addReward = async (reward) => {
        if (user) {
            const rewardsRef = collection(db, 'usuarios', user.uid, 'recompensas');
            const docRef = await addDoc(rewardsRef, reward);
            setRewards([...rewards, { id: docRef.id, ...reward }]);
        }
    };

    const updateReward = async (id, updatedReward) => {
        if (user) {
            const rewardRef = doc(db, 'usuarios', user.uid, 'recompensas', id);
            await updateDoc(rewardRef, updatedReward);
            setRewards(rewards.map(reward => (reward.id === id ? { id, ...updatedReward } : reward)));
        }
    };

    const deleteReward = async (id) => {
        if (user) {
            const rewardRef = doc(db, 'usuarios', user.uid, 'recompensas', id);
            await deleteDoc(rewardRef);
            setRewards(rewards.filter(reward => reward.id !== id));
        }
    };

    return (
        <RewardsContext.Provider value={{ rewards, addReward, updateReward, deleteReward }}>
            {children}
        </RewardsContext.Provider>
    );
};