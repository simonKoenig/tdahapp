// PriorityBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PriorityBadge = ({ tipo, valor }) => {
    const getBackgroundColor = (tipo, valor) => {
        if (tipo === 'dificultad') {
            switch (valor.toLowerCase()) {
                case 'baja':
                    return '#037208'; // Verde claro
                case 'media':
                    return '#a46200'; // Naranja claro
                case 'alta':
                    return '#a41b1b'; // Rojo claro
                default:
                    return '#e0e0e0'; // Gris por defecto
            }
        } else if (tipo === 'estado') {
            switch (valor.toLowerCase()) {
                case 'en progreso':
                    return '#a46200'; // Naranja claro
                case 'finalizada':
                    return '#037208'; // Verde
                case 'pendiente':
                    return '#3c729e'; // Azul claro
                case 'vencida':
                    return '#a41b1b'; // Rojo claro
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
        paddingHorizontal: 12.5,
        paddingVertical: 5,
        borderRadius: 5,
        borderRadius: 5,
    },
    priorityText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default PriorityBadge;