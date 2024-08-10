import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RewardsContext } from '../Context/RewardsProvider';
import { useNavigation } from '@react-navigation/native';
import RewardItem from '../Components/RewardItem';
import SearchBar from '../Components/SearchBar';
import DropdownComponent from '../Components/Dropdown';
import { filtradoDificultades } from '../Utils/Constant';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa el ícono

const RewardsListScreen = () => {
    const { rewards, deleteReward } = useContext(RewardsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const navigation = useNavigation();

    const filteredRewards = rewards.filter(reward =>
        reward.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || reward.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteReward(data.item.id)}
            >
                <Icon name="delete" size={24} color="#ffffff" /> {/* Ícono de tacho de basura */}
            </TouchableOpacity>
        </View>
    );

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
            <SwipeListView
                data={filteredRewards}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <RewardItem
                        item={item}
                        onPress={() => navigation.navigate('RewardDetail', { rewardId: item.id })}
                    />
                )}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-75}
                leftOpenValue={75} // Añade esta línea para permitir deslizar a la izquierda
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
        backgroundColor: '#f44336',
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 70, // Ajustado para que coincida con RewardItem
        borderRadius: 10, // Añadir un radio de borde para que coincida
        marginVertical: 8, // Añadido para que coincida con el margen de RewardItem
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%', // Hacer que el botón ocupe todo el alto del rowBack
    },
});

export default RewardsListScreen;
