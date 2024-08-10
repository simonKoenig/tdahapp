import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PriorityBadge from './PriorityBadge';

const RewardItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <View style={styles.circle}>
                <Text style={styles.circleText}>{item.nombre[0]}</Text>
            </View>
            <Text style={styles.itemText}>{item.nombre}</Text>
            <PriorityBadge dificultad={item.dificultad} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        elevation: 3,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#d32f2f',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    circleText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
    },
});

export default RewardItem;
