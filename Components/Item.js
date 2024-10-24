import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import PriorityBadge from './PriorityBadge';
import moment from 'moment';

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
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <View style={styles.circle}>
                <Text style={styles.circleText}>{item.nombre[0]}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.nombre}</Text>
                {mostrarFecha && <Text style={styles.dateText}>{formattedDate}</Text>}
            </View>
            <PriorityBadge tipo={tipo} valor={valor} />
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
        height: 70,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4c669f',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    circleText: {
        color: '#fff',
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