import React, { useContext, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, RefreshControl } from 'react-native';
import { RewardsContext } from '../Context/RewardsProvider';
import { useNavigation } from '@react-navigation/native';
import RewardItem from '../Components/RewardItem';
import SearchBar from '../Components/SearchBar';
import DropdownComponent from '../Components/Dropdown';
import { filtradoDificultades } from '../Utils/Constant';

const RewardsListScreen = () => {
    const { rewards, fetchRewards } = useContext(RewardsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    // Filtramos las recompensas en función del término de búsqueda y la dificultad seleccionada
    const filteredRewards = rewards.filter(reward =>
        reward.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || reward.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRewards(); // Suponiendo que fetchRewards es una función que obtiene las recompensas
        setRefreshing(false);
    };

    // Renderiza SearchBar y Dropdown como encabezado fijo
    const renderHeader = () => (
        <View style={styles.header}>
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
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={renderHeader}
                data={filteredRewards}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <RewardItem
                        item={item}
                        onPress={() => navigation.navigate('RewardDetail', { rewardId: item.id })}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
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
        backgroundColor: '#ffffff',
    },
    header: {
        padding: 16,
        backgroundColor: '#ffffff',
        // Eliminamos la línea gris
        borderBottomWidth: 0,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#4c669f',
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
