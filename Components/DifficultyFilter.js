import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const DifficultyFilter = ({ selectedDifficulty, onSelectDifficulty }) => {
    const difficulties = [
        { key: '', value: 'Todas las dificultades' },
        { key: 'Baja', value: 'Dificultad baja' },
        { key: 'Media', value: 'Dificultad media' },
        { key: 'Alta', value: 'Dificultad alta' },
    ];

    return (
        <View style={styles.container}>
            <SelectList
                setSelected={(key) => onSelectDifficulty(key)}
                data={difficulties}
                placeholder={selectedDifficulty ? difficulties.find(d => d.key === selectedDifficulty)?.value : 'Selecciona una dificultad'}
                boxStyles={styles.box} // Estilos para el contenedor del dropdown
                dropdownStyles={styles.dropdown} // Estilos para el menú desplegable
                inputStyles={styles.input} // Estilos para el texto dentro del input
                dropdownItemStyles={styles.dropdownItem} // Estilos para los ítems en el dropdown
                dropdownTextStyles={styles.dropdownText} // Estilos para el texto dentro de los ítems del dropdown
                defaultOption={{ key: selectedDifficulty, value: difficulties.find(d => d.key === selectedDifficulty)?.value }}
                search={false} // Deshabilitar la opción de búsqueda
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        alignItems: 'flex-start', // Alinear el contenido a la izquierda
    },
    box: {
        borderRadius: 25,

        width: '100%', // Ajustar el ancho al 80% del contenedor
        backgroundColor: '#E0E0E0', // Fondo gris claro
        borderWidth: 0, // Eliminar el borde
    },
    dropdown: {
        borderRadius: 25,
        borderWidth: 0, // Eliminar el borde del menú desplegable
        backgroundColor: '#E0E0E0', // Fondo gris claro para el menú desplegable
    },
    input: {
        fontSize: 16,
        color: '#333',
        whiteSpace: 'nowrap', // Evitar que el texto salte de línea
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
        whiteSpace: 'nowrap', // Evitar que el texto salte de línea
    },
});

export default DifficultyFilter;