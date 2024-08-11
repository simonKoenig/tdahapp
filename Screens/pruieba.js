import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';

const data = [
    { key: '1', text: 'Item 1' },
    { key: '2', text: 'Item 2' },
    { key: '3', text: 'Item 3' },
];

const RewardsListScreen = () => {
    const navigation = useNavigation();

    const handleRowPress = (item) => {
        navigation.navigate('DetailScreen', { item });
    };

    const handleDelete = (rowKey) => {
        // Implementar la lógica de eliminación aquí
        console.log('Eliminar', rowKey);
    };

    const renderItem = (data) => (
        <TouchableOpacity
            style={styles.rowFront}
            onPress={() => handleRowPress(data.item)}
        >
            <Text>{data.item.text}</Text>
        </TouchableOpacity>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.backRightBtn}
                onPress={() => handleDelete(data.item.key)}
            >
                <Text style={styles.backTextWhite}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SwipeListView
            data={data}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
        />
    );
};

const styles = StyleSheet.create({
    rowFront: {
        backgroundColor: '#FFF',
        borderBottomColor: '#CCC',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
        paddingLeft: 15,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: 'red',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
});

export default RewardsListScreen;