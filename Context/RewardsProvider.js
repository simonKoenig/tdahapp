// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
// import { db } from '../firebase-config';
// import { AuthContext } from './AuthProvider';

// export const RewardsContext = createContext();

// export const RewardsProvider = ({ children }) => {
//     const { user } = useContext(AuthContext);
//     const [rewards, setRewards] = useState([]);
//     const [currentPatientId, setCurrentPatientId] = useState(null);

//     const fetchRewards = async (patientId) => {
//         if (user) {
//             const rewardsRef = collection(db, 'usuarios', user.uid, 'pacientes', patientId, 'recompensas');
//             const rewardsSnapshot = await getDocs(rewardsRef);
//             const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setRewards(rewardsList);
//             setCurrentPatientId(patientId);
//             console.log('Fetched rewards:', rewardsList); // Log the rewards
//         }
//     };

//     const addReward = async (reward) => {
//         if (user && currentPatientId) {
//             const rewardsRef = collection(db, 'usuarios', user.uid, 'pacientes', currentPatientId, 'recompensas');
//             const docRef = await addDoc(rewardsRef, reward);
//             setRewards([...rewards, { id: docRef.id, ...reward }]);
//         }
//     };

//     const updateReward = async (id, updatedReward) => {
//         if (user && currentPatientId) {
//             const rewardRef = doc(db, 'usuarios', user.uid, 'pacientes', currentPatientId, 'recompensas', id);
//             await updateDoc(rewardRef, updatedReward);
//             setRewards(rewards.map(reward => (reward.id === id ? { id, ...updatedReward } : reward)));
//         }
//     };

//     const deleteReward = async (id) => {
//         if (user && currentPatientId) {
//             const rewardRef = doc(db, 'usuarios', user.uid, 'pacientes', currentPatientId, 'recompensas', id);
//             await deleteDoc(rewardRef);
//             setRewards(rewards.filter(reward => reward.id !== id));
//         }
//     };

//     const getReward = async (id) => {
//         if (user && currentPatientId) {
//             const rewardRef = doc(db, 'usuarios', user.uid, 'pacientes', currentPatientId, 'recompensas', id);
//             const rewardDoc = await getDoc(rewardRef);
//             if (rewardDoc.exists()) {
//                 return { id: rewardDoc.id, ...rewardDoc.data() };
//             } else {
//                 throw new Error('Reward not found');
//             }
//         }
//     };

//     return (
//         <RewardsContext.Provider value={{ rewards, fetchRewards, addReward, updateReward, deleteReward, getReward }}>
//             {children}
//         </RewardsContext.Provider>
//     );
// };

import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from './AuthProvider';

export const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [rewards, setRewards] = useState([]);
    const [currentPatientId, setCurrentPatientId] = useState(null);

    const fetchRewards = async (patientId) => {
        if (user) {
            const rewardsRef = collection(db, 'usuarios', patientId, 'recompensas');
            const rewardsSnapshot = await getDocs(rewardsRef);
            const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRewards(rewardsList);
            setCurrentPatientId(patientId);

        }
    };

    const addReward = async (reward) => {
        if (user && currentPatientId) {
            const rewardsRef = collection(db, 'usuarios', currentPatientId, 'recompensas');
            const docRef = await addDoc(rewardsRef, reward);
            setRewards([...rewards, { id: docRef.id, ...reward }]);
        }
    };

    const updateReward = async (id, updatedReward) => {
        if (user && currentPatientId) {
            const rewardRef = doc(db, 'usuarios', currentPatientId, 'recompensas', id);
            await updateDoc(rewardRef, updatedReward);
            setRewards(rewards.map(reward => (reward.id === id ? { id, ...updatedReward } : reward)));
        }
    };

    const deleteReward = async (id) => {
        if (user && currentPatientId) {
            const rewardRef = doc(db, 'usuarios', currentPatientId, 'recompensas', id);
            await deleteDoc(rewardRef);
            setRewards(rewards.filter(reward => reward.id !== id));
        }
    };

    const getReward = async (id) => {
        if (user && currentPatientId) {
            const rewardRef = doc(db, 'usuarios', currentPatientId, 'recompensas', id);
            const rewardDoc = await getDoc(rewardRef);
            if (rewardDoc.exists()) {
                return { id: rewardDoc.id, ...rewardDoc.data() };
            } else {
                throw new Error('Reward not found');
            }
        }
    };

    return (
        <RewardsContext.Provider value={{ rewards, fetchRewards, addReward, updateReward, deleteReward, getReward }}>
            {children}
        </RewardsContext.Provider>
    );
};