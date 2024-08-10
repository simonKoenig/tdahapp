import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PriorityBadge = ({ dificultad }) => {
    return (
        <View style={styles.priorityContainer}>
            <Text style={styles.priorityText}>{dificultad}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    priorityContainer: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    priorityText: {
        color: '#d32f2f',
        fontWeight: 'bold',
    },
});

export default PriorityBadge;
