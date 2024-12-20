
import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import { RewardsContext } from '../../Context/RewardsProvider';
import { useNavigation } from '@react-navigation/native';
import RewardItem from '../../Components/RewardItem';
import SearchBar from '../../Components/SearchBar';
import DropdownComponent from '../../Components/Dropdown';
import { globalStyles } from '../../Utils/globalStyles';

import PatientSelector from '../../Components/PatientSelector';
import LoadingScreen from '../../Components/LoadingScreen';

import { filtradoDificultades } from '../../Utils/Constant';

import { AuthContext } from '../../Context/AuthProvider';
import { PatientsContext } from '../../Context/PatientsProvider';

const RewardsListScreen = ({ route }) => {
    const { rewards, fetchRewards, loadingRewards } = useContext(RewardsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const [rewardsCache, setRewardsCache] = useState({});
    const [loading, setLoading] = useState(false);
    const { selectedPatientId } = useContext(PatientsContext);



    const filteredRewards = rewards.filter(reward =>
        reward.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDifficulty === '' || reward.dificultad.toLowerCase() === selectedDifficulty.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchRewards(selectedPatientId);
        setRefreshing(false);


    };

    const handlePatientSelection = async (patientId) => {
        if (patientId) {
            await fetchRewards(patientId);
        }
    };

    const renderRewardList = () => {
        return (
            <FlatList
                data={filteredRewards}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <RewardItem
                        item={item}
                        onPress={() => navigation.navigate('RewardDetail', { rewardId: item.id, uid: selectedPatientId })}
                    />
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        );
    };


    return (
        <View style={globalStyles.container}>
            <PatientSelector onPatientSelected={handlePatientSelection} />
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
            {loadingRewards ? (
                <LoadingScreen />
            ) : (
                selectedPatientId ? (
                    <>
                        {/* Título antes de mostrar la FlatList */}
                        <Text style={[globalStyles.lessBoldText]} accessibilityRole="header">Lista de recompensas</Text>
                        {renderRewardList()}
                    </>
                ) : (
                    <Text style={styles.noPatientText}>Selecciona un estudiante para ver sus recompensas.</Text>
                )
            )}
            <TouchableOpacity
                style={globalStyles.addButton}
                onPress={() => navigation.navigate('AddReward')}
            >
                <Text style={globalStyles.addButtonText}>+</Text>
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
    noPatientText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666666',
        marginTop: 20,
    },
});

export default RewardsListScreen;