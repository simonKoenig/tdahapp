import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownComponent = ({ data, value, setValue, placeholder, onSelect, searchActivo = true, width = '100%' }) => {
    return (
        <Dropdown
            style={[styles.dropdown, { width }]} // Aplicando el ancho recibido como prop
            data={data}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            search={searchActivo}
            searchPlaceholder="Buscar..."
            placeholderStyle={styles.placeholderStyle} // Estilo para el placeholder
            selectedTextStyle={styles.selectedTextStyle} // Estilo para el texto seleccionado
            inputSearchStyle={styles.inputSearchStyle} // Estilo para el input de búsqueda
            onChange={item => {
                setValue(item.value);
                if (onSelect) {
                    onSelect(item.value);
                }
            }}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 48,
        borderColor: '#D9D9D9', // Usando el color de border desde las constantes
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
        borderColor: '#000000', // Usando el color de border desde las constantes
        backgroundColor: '#F9F9F4', // Usando el color de fondo desde las constantes
    },
    placeholderStyle: {
        fontSize: 18, // Usar tamaño de fuente desde las constantes
        color: '#1A1A1A', // Usar color desde las constantes
        fontFamily: 'AtkinsonHyperlegible_400Regular', // Usar la familia de fuente desde las constantes
    },
    selectedTextStyle: {
        fontSize: 18, // Usar tamaño de fuente desde las constantes
        color: '#1A1A1A', // Usar color desde las constantes
        fontFamily: 'AtkinsonHyperlegible_400Regular', // Usar la familia de fuente desde las constantes
    },
    inputSearchStyle: {
        height: 48,
        fontSize: 18, // Usar tamaño de fuente desde las constantes
        color: '#1A1A1A', // Usar color desde las constantes
        fontFamily: 'AtkinsonHyperlegible_400Regular', // Usar la familia de fuente desde las constantes
    },
});

export default DropdownComponent;
