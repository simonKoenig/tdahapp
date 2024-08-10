import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../Context/AuthProvider';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

function RewardDetailScreen({ route }) {
    const { rewardId } = route.params;
    const { user } = useContext(AuthContext);
    const [reward, setReward] = useState(null);

    useEffect(() => {
        const fetchReward = async () => {
            if (user) {
                const rewardRef = doc(db, 'usuarios', user.uid, 'recompensas', rewardId);
                const rewardSnap = await getDoc(rewardRef);
                if (rewardSnap.exists()) {
                    setReward(rewardSnap.data());
                }
            }
        };

        fetchReward();
    }, [user, rewardId]);

    if (!reward) {
        return <Text>Cargando...</Text>;
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Nombre: {reward.nombre}</Text>
            <Text>Dificultad: {reward.dificultad}</Text>
        </View>
    );
}

export default RewardDetailScreen;