import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import { SubjectsContext } from '../../Context/SubjectsProvider';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../Components/SearchBar';
import SubjectItem from '../../Components/SubjectItem';
import PatientSelector from '../../Components/PatientSelector';
import { getAsyncStorage } from '../../Utils/AsyncStorage';
import { PatientsContext } from '../../Context/PatientsProvider';



const SubjectsListScreen = () => {
    const { subjects, fetchSubjects } = useContext(SubjectsContext);
    const { selectedPatientId } = useContext(PatientsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    
    // guardo subjects en una variable intermedia para que su valor se capture correctamente
    const auxSubjects = subjects;
    const filteredSubjects = auxSubjects.filter(subject =>
        subject.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchSubjects(selectedPatientId);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {/* <Button
                title="Ver Recompensas de Otro Usuario"
                onPress={() => navigation.navigate('UserSubjects')}
            /> */}
            <PatientSelector />


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
