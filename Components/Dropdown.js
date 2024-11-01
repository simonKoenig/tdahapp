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
            autoScroll={false}
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
            accessible={true}
            accessibilityLabel={`Desplegable: ${placeholder ? placeholder : ''}`} // Describe la función del dropdown
            accessibilityHint="Toque dos veces para abrir el desplegable y seleccionar una opción" // Instrucciones adicionales para los usuarios del lector de pantalla
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 48,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
        borderColor: '#000000',
        backgroundColor: '#F9F9F4',
    },
    placeholderStyle: {
        fontSize: 18,
        color: '#1A1A1A',
        fontFamily: 'AtkinsonHyperlegible_400Regular',
    },
    selectedTextStyle: {
        fontSize: 18,
        color: '#1A1A1A',
        fontFamily: 'AtkinsonHyperlegible_400Regular',
    },
    inputSearchStyle: {
        height: 48,
        fontSize: 18,
        color: '#1A1A1A',
        fontFamily: 'AtkinsonHyperlegible_400Regular',
    },
});

export default DropdownComponent;
