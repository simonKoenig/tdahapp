// PriorityBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PriorityBadge = ({ tipo, valor }) => {
    const getBackgroundColor = (tipo, valor) => {
        if (tipo === 'dificultad') {
            switch (valor.toLowerCase()) {
                case 'baja':
                    return '#81c784'; // Verde claro
                case 'media':
                    return '#ffb74d'; // Naranja claro
                case 'alta':
                    return '#e57373'; // Rojo claro
                default:
                    return '#e0e0e0'; // Gris por defecto
            }
        } else if (tipo === 'estado') {
            switch (valor.toLowerCase()) {
                case 'en progreso':
                    return '#ffb74d'; // Naranja claro
                case 'finalizada':
                    return '#81c784'; // Verde
                case 'pendiente':
                    return '#64b5f6'; // Azul claro
                case 'vencida':
                    return '#e57373'; // Rojo claro
                default:
                    return '#e0e0e0'; // Gris por defecto
            }
        }
    };

    return (
        <View style={[styles.priorityContainer, { backgroundColor: getBackgroundColor(tipo, valor) }]}>
            <Text style={styles.priorityText}>{valor}</Text>
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