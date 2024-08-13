import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { RewardsContext } from '../Context/RewardsProvider';
import { PatientsContext } from '../Context/PatientsProvider';


import { useNavigation } from '@react-navigation/native';


const UserRewardsScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const { patients, setSelectedPatientId, addPatientByEmail } = useContext(PatientsContext);
    const { fetchRewards, userRewards, setRewards } = useContext(RewardsContext);

    const handleFetchUserRewards = async () => {
        try {
            if (email) {
                const patientData = await addPatientByEmail(email);

                if (patientData && patientData.uid) {
                    const rewards = await fetchRewards(patientData.uid);
                    setRewards(rewards);
                    //ir a la pantalla de atras con goback

                    console.log('Patient data:', patientData);
                    console.log('User rewards:', rewards);
                }
            }
        } catch (error) {
            console.error('Error fetching user rewards:', error);
        }
    };

    const handleSelectPatient = async (patientId) => {
        setSelectedPatientId(patientId);
        const rewards = await fetchRewards(patientId);
        setRewards(rewards);
        navigation.navigate('RewardsList');
    };

    console.log('Patients:', patients);
    console.log(patients.length);
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Ingrese correo electrónico del usuario</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico del usuario"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleFetchUserRewards}>
                <Text style={styles.buttonText}>Buscar Recompensas</Text>
            </TouchableOpacity>



            {patients.length === 0 && email && (
                <Text style={styles.noPatientsText}>No se encontraron pacientes para este correo electrónico.</Text>
            )}


            {patients.length > 0 && (




                <FlatList
                    data={patients}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectPatient(item.id)}>
                            <Text style={styles.patientItem}>{item.nombreApellido}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* {userRewards.length === 0 && email && (
                <Text style={styles.noRewardsText}>No se encontraron recompensas para este correo electrónico.</Text>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4c669f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    noRewardsText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    patientItem: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});

export default UserRewardsScreen;