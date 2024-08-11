// import React, { useContext } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { RewardsContext } from '../Context/RewardsProvider';
// import { useNavigation } from '@react-navigation/native';

// function RewardsListScreen() {
//     const { rewards } = useContext(RewardsContext);
//     const navigation = useNavigation();

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <FlatList
//                 data={rewards}
//                 keyExtractor={item => item.id}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity onPress={() => navigation.navigate('RewardDetail', { rewardId: item.id })}>
//                         <Text>{item.nombre}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//             <TouchableOpacity onPress={() => navigation.navigate('AddReward')}>
//                 <Text style={{ fontSize: 30 }}>+</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// export default RewardsListScreen;

import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RewardsContext } from '../Context/RewardsProvider';
import { useNavigation } from '@react-navigation/native';
import RewardItem from '../Components/RewardItem';
import SearchBar from '../Components/SearchBar';
import DropdownComponent from '../Components/Dropdown';  // Importamos DropdownCompone

import { filtradoDificultades } from '../Utils/Constant';

const RewardsListScreen = ({ route }) => {
    const { rewards, fetchRewards } = useContext(RewardsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar la actualización
    const navigation = useNavigation();

    const { patientId } = route.params;
    console.log(patientId);

    useEffect(() => {
        fetchRewards(patientId);
    }, [patientId]);

    // Filtramos las recompensas en función del término de búsqueda y la dificultad seleccionada
    const filteredRewards = rewards.filter(reward =>
        reward.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || reward.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchRewards(patientId);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <SearchBar
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />
            <DropdownComponent
                data={filtradoDificultades}
                value={selectedDifficulty}
                setValue={setSelectedDifficulty}
                placeholder="Selecciona una dificultad"
            />
            <FlatList
                data={filteredRewards}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <RewardItem
                        item={item}
                        onPress={() => navigation.navigate('RewardDetail', { rewardId: item.id })}
                    />
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddReward')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#d32f2f',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default RewardsListScreen;