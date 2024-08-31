import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ObtainTaskScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { recompensaNombre } = route.params;

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/regalo.png')} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>¡Felicitaciones!</Text>
            <Text style={styles.message}>¡Has completado la tarea correctamente!</Text>
            <Text style={styles.time}>Podés {recompensaNombre}</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TasksList')}>
                <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4a4a4a',
        marginBottom: 10,
    },
    message: {
        fontSize: 20,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    time: {
        fontSize: 24,
        color: '#333',
        fontWeight: '600',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#8000ff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ObtainTaskScreen;
