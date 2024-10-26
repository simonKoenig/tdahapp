import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import PriorityBadge from './PriorityBadge';
import moment from 'moment';
import { globalStyles } from '../Utils/globalStyles'; // Importamos los estilos globales
import { COLORS, SPACING } from '../Utils/Constant'; // Importamos constantes de colores y espaciado


const Item = ({ item, onPress, tipo, valor, mostrarFecha }) => {
    const [formattedDate, setFormattedDate] = React.useState('');

    React.useEffect(() => {
        let dateToFormat = null;

        // Determinar cuál fecha formatear
        if (item.estado.toLowerCase() === 'finalizada' && item.correccion?.correctionDate) {
            dateToFormat = item.correccion.correctionDate;
        } else if (item.date) {
            dateToFormat = item.date;
        }

        // Convertir el timestamp a Date si es necesario y luego formatear
        if (dateToFormat) {
            const dateObject = dateToFormat.toDate ? dateToFormat.toDate() : dateToFormat;
            setFormattedDate(moment(dateObject).calendar());
        }
    }, [item]);

    return (
        <TouchableOpacity
            accessible={true}  // Indica que este es un elemento accesible
            accessibilityLabel={`${item.nombre}. ${valor === 'Finalizada' ? `Corregida ${formattedDate}` : `Vence el ${formattedDate}`}. Estado: ${valor}`} // Texto completo que leerá el lector de pantalla

            style={styles.itemContainer} onPress={onPress}>
            <View style={styles.circle}>
                <Text style={styles.circleText}>{item.nombre[0]}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={globalStyles.text}>{item.nombre}</Text>
                <Text style={globalStyles.InfoText}>
                    {valor === 'Finalizada' ? `Corregida: ${formattedDate}` : `Vence: ${formattedDate}`}
                </Text>
            </View>

            <PriorityBadge tipo={tipo} valor={valor} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.small,  // Usamos el espaciado definido en constantes
        marginVertical: 8,
        borderRadius: 10,
        height: 60,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,  // Usamos el color primario definido
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.small,
    },
    circleText: {
        color: COLORS.secondary,  // Usamos el color de texto secundario
        fontWeight: 'bold',
        fontSize: 18,
    },
    textContainer: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
    },
    dateText: {
        flex: 1,
        fontSize: 12,
        color: '#888',
    },
});

export default Item;