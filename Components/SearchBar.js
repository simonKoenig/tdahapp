import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SearchIcon } from './Icons';

const SearchBar = ({ searchTerm, onSearch }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Buscar..."
                placeholderTextColor="#565454" // Color gris claro para el placeholder
                value={searchTerm}
                onChangeText={onSearch}
                accessible={true}
                accessibilityLabel="Barra de búsqueda"
                accessibilityHint="Ingrese texto para buscar"
            />
            <SearchIcon
                size={20}
                accessible={false} // Marcar el ícono como no accesible para que sea ignorado por el lector de pantalla
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
        borderRadius: 25,
        backgroundColor: '#F9F9F4',
        borderColor: '#000000',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        paddingHorizontal: 10,
        color: '#000000',
        fontFamily: 'AtkinsonHyperlegible_400Regular',
    },
});

export default SearchBar;
