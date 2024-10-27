import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import PriorityBadge from './PriorityBadge';
import moment from 'moment';
import { globalStyles } from '../Utils/globalStyles';
import { COLORS, SPACING } from '../Utils/Constant';

const Item = ({ item, onPress, tipo, valor = '', mostrarFecha }) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        let dateToFormat = null;

        if (item.estado && item.estado.toLowerCase() === 'finalizada' && item.correccion?.correctionDate) {
            dateToFormat = item.correccion.correctionDate;
        } else if (item.date) {
            dateToFormat = item.date;
        }

        if (dateToFormat) {
            const dateObject = dateToFormat.toDate ? dateToFormat.toDate() : dateToFormat;
            setFormattedDate(moment(dateObject).calendar());
        }
    }, [item]);

    return (
        <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityHint="Toque dos veces para ver los detalles"
            accessibilityLabel={`${item.nombre}. ${valor === 'Finalizada' ? `Corregida el ${formattedDate}` : formattedDate ? `Vencimiento ${formattedDate}` : ''}. Estado: ${valor}`}
            style={styles.itemContainer}
            onPress={onPress}
        >
            <View style={styles.circle} accessible={false}>
                <Text style={styles.circleText}>{item.nombre ? item.nombre[0] : '?'}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={globalStyles.text}>{item.nombre}</Text>
                {formattedDate && (
                    <Text style={globalStyles.InfoText}>
                        {valor === 'Finalizada' ? `Corregida: ${formattedDate}` : `Vence: ${formattedDate}`}
                    </Text>
                )}
            </View>

            <PriorityBadge tipo={tipo} valor={valor} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.small,
        marginVertical: 8,
        borderRadius: 10,
        height: 60,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.small,
    },
    circleText: {
        color: COLORS.secondary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    textContainer: {
        flex: 1,
    },
});

export default Item;
