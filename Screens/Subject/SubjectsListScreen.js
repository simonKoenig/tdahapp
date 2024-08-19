
import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import { SubjectsContext } from '../../Context/SubjectsProvider';
import { useNavigation } from '@react-navigation/native';
import RewardItem from '../../Components/RewardItem';
import SearchBar from '../../Components/SearchBar';  // Importamos SearchBar
import SubjectItem from '../../Components/SubjectItem';  // Importamos SubjectItem




import { AuthContext } from '../../Context/AuthProvider';
import { PatientsContext } from '../../Context/PatientsProvider';

const SubjectsListScreen = ({ route }) => {
    const { subjects, fetchSubjects } = useContext(SubjectsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar la actualización
    const navigation = useNavigation();

    const { selectedPatientId } = useContext(PatientsContext);



    // Filtramos las recompensas en función del término de búsqueda y la dificultad seleccionada
    const filteredSubjects = subjects.filter(subject =>
        subject.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchSubjects(selectedPatientId);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <Button
                title="Ver Recompensas de Otro Usuario"
                onPress={() => navigation.navigate('UserSubjects')}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddSubject')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <SearchBar
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />
            <FlatList
                data={filteredSubjects}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <SubjectItem
                        item={item}
                        onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id, uid: selectedPatientId })}
                    />
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddSubject')}
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

export default SubjectsListScreen;