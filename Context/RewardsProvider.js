
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';

export const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [rewards, setRewards] = useState([]);
    const [selectedRewardId, setSelectedRewardId] = useState(null);


    const fetchRewards = async (uid) => {
        if (uid) {
            try {
                console.log('Fetching rewards for UID:', uid);
                const rewardsRef = collection(db, 'usuarios', uid, 'recompensas');
                const rewardsSnapshot = await getDocs(rewardsRef);
                const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRewards(rewardsList);
                return rewardsList;
                // setCurrentPatientId(patientId);
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
                setRewards(prevRewards => [...prevRewards, { id: docRef.id, ...reward }]);
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