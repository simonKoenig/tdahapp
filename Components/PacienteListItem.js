import React from 'react';
import { DeleteIcon } from './Icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';


const PacienteListItem = ({ paciente, onDelete }) => {
    const nombreArray = paciente.nombreApellido.split(' ');

    // Obtener las iniciales (primera letra de las dos primeras palabras)
    const iniciales = nombreArray.length > 1
        ? `${nombreArray[0][0]}${nombreArray[1][0]}`
        : nombreArray[0][0]; // Si solo hay una palabra, tomar solo la primera letra


    return (



        <View style={styles.pacienteContainer}>
            <View style={styles.circle}>
                <Text style={styles.circleText}>{iniciales}</Text>
            </View>
            <View>
                <Text style={styles.pacienteText}>{paciente.nombreApellido}</Text>
                <Text style={styles.pacienteEmail}>{paciente.email}</Text>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(paciente.id)}>
                <DeleteIcon size={42} color="red" />

            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    pacienteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        elevation: 3,
        height: 70,
        position: 'relative', // Necesario para posicionar el ícono de eliminación
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
    pacienteText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pacienteEmail: {
        fontSize: 14,
        color: '#777',
    },
    deleteButton: {
        position: 'absolute',
        right: 10,
        top: 'auto',
    },
    infoContainer: {
        flex: 1,
    },
});

export default PacienteListItem;
