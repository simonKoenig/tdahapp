import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SearchIcon } from './Icons';

const SearchBar = ({ searchTerm, onSearch }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Buscar..."
                placeholderTextColor="#A9A9A9" // Color gris claro para el placeholder
                value={searchTerm}
                onChangeText={onSearch}
            />
            <SearchIcon size={20} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
        borderRadius: 25, // Bordes redondeados
        backgroundColor: '#E0E0E0', // Color de fondo gris claro
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        paddingHorizontal: 10,
        color: '#000000', // Color del texto ingresado
    },
});

export default SearchBar;
