import React from 'react';
import { DeleteIcon } from './Icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../Utils/globalStyles'; // Importamos los estilos globales
import { COLORS, SPACING } from '../Utils/Constant'; // Importamos constantes de colores y espaciado

const PacienteListItem = ({ paciente, onDelete }) => {
    const nombreArray = paciente.nombreApellido.split(' ');

    const iniciales = () => {
        if (nombreArray.length > 0 && nombreArray[0]) {
            return nombreArray.length > 1 && nombreArray[1]
                ? `${nombreArray[0][0]}${nombreArray[1][0]}`
                : nombreArray[0][0]; // Si solo hay una palabra, tomar solo la primera letra
        } else {
            return ''; // Manejar el caso donde nombreArray está vacío o tiene elementos inválidos
        }
    };

    return (
        <View
            style={styles.pacienteContainer}
            accessible={true}
            accessibilityLabel={`Usuario: ${paciente.nombreApellido}, Correo electrónico: ${paciente.email}`}
        >
            {/* Ícono con las iniciales del usuario */}
            <View style={styles.circle} accessibilityLabel={`Iniciales del usuario: ${iniciales()}`}>
                <Text style={styles.circleText}>{iniciales()}</Text>
            </View>

            {/* Nombre y correo del usuario */}
            <View style={styles.infoContainer}>
                <Text style={globalStyles.text}>{paciente.nombreApellido}</Text>
                <Text style={globalStyles.InfoText}>{paciente.email}</Text>
            </View>

            {/* Botón para eliminar al usuario */}
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(paciente.id)}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar a ${paciente.nombreApellido}`}
                accessibilityHint="Eliminará a este usuario de la lista de usuarios vinculados"
            >
                <DeleteIcon size={42} color="red" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    pacienteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.small,  // Usamos el espaciado definido en constantes
        borderRadius: 10,
        height: 60,
        position: 'relative',  // Necesario para posicionar el ícono de eliminación
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
    deleteButton: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    infoContainer: {
        flex: 1,
    },
});

export default PacienteListItem;
