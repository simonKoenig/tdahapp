import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PriorityBadge = ({ dificultad }) => {
    const getBackgroundColor = (dificultad) => {
        if (dificultad.toLowerCase() === 'baja') {
            return '#81c784'; // Verde claro
        } else if (dificultad.toLowerCase() === 'media') {
            return '#ffb74d'; // Naranja claro
        } else if (dificultad.toLowerCase() === 'alta') {
            return '#e57373'; // Rojo claro
        } else {
            return '#e0e0e0'; // Gris por defecto
        }
    };

    return (
        <View style={[styles.priorityContainer, { backgroundColor: getBackgroundColor(dificultad) }]}>
            <Text style={styles.priorityText}>{dificultad}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    priorityContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    priorityText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default PriorityBadge;