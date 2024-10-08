import React, { useContext, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SubjectsContext } from '../../Context/SubjectsProvider';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../Components/SearchBar';
import SubjectItem from '../../Components/SubjectItem';
import PatientSelector from '../../Components/PatientSelector';
import { PatientsContext } from '../../Context/PatientsProvider';
import LoadingScreen from '../../Components/LoadingScreen'; 

const SubjectsListScreen = () => {
    const { subjects, fetchSubjects } = useContext(SubjectsContext);
    const { selectedPatientId } = useContext(PatientsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false); 
    const navigation = useNavigation();
    
    // Filtrar materias basadas en el término de búsqueda
    const filteredSubjects = subjects.filter(subject =>
        subject.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar la actualización manual
    const handleRefresh = async () => {
        if (selectedPatientId) {
            setRefreshing(true);  
            setLoading(true);  
            await fetchSubjects(selectedPatientId);  
            setRefreshing(false);  
            setLoading(false);  
        }
    };

    const handlePatientSelection = async (patientId) => {
        if (patientId) {
            setLoading(true);  
            await fetchSubjects(patientId);  
            setLoading(false);  
        }
    };

    const renderSubjectList = () => {
        return (
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
        );
    };

    return (
        <View style={styles.container}>
            <PatientSelector onPatientSelected={handlePatientSelection} /> 
            <SearchBar
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />

            {loading ? (
                <LoadingScreen />
            ) : (
                selectedPatientId ? (
                    renderSubjectList()  
                ) : (
                    <Text style={styles.noPatientText}>Selecciona un paciente para ver sus materias.</Text>
                )
            )}

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
    noPatientText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666666',
        marginTop: 20,
    },
});

export default SubjectsListScreen;
