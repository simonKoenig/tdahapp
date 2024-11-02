import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { globalStyles } from '../../Utils/globalStyles';

const ObtainTaskScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { recompensaNombre, recompensaVencimiento } = route.params;

    return (
        <View style={[globalStyles.container, { alignItems: 'center' }]}>
            <Image
                source={require('../../assets/images/gift.png')}
                style={styles.image}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel="Imagen de un regalo, representando la recompensa ganada"
            />
            <Text
                style={[globalStyles.title, { fontSize: 32 }]}
                accessible={true}
                accessibilityLabel="Felicitaciones, has completado la tarea correctamente"
            >
                ¡Felicitaciones!
            </Text>
            <Text
                style={[globalStyles.text, { fontSize: 25, textAlign: 'center', marginTop: 10 }]} accessible={true}
                accessibilityLabel="Has completado la tarea correctamente"
            >
                ¡Has completado la tarea correctamente!
            </Text>
            <Text
                style={[globalStyles.title, { fontSize: 25, marginVertical: 20, textAlign: 'center' }]} accessible={true}
                accessibilityLabel={`Puedes reclamar la recompensa: ${recompensaNombre}`}
            >
                Podés {recompensaNombre}
            </Text>
            {recompensaVencimiento && (
                <Text
                    style={[globalStyles.text, { fontSize: 20, textAlign: 'center' }]} accessible={true}
                    accessibilityLabel={`Tienes hasta ${moment(recompensaVencimiento).format('LLL')} para reclamar la recompensa`}
                >
                    Tenés tiempo hasta {moment(recompensaVencimiento).format('LLL')}
                </Text>
            )}

            <TouchableOpacity
                style={[globalStyles.button, { width: '80%', marginTop: 30 }]}
                onPress={() => navigation.navigate('TasksList')}
                accessible={true}
                accessibilityLabel="Aceptar"
                accessibilityHint="Toca dos veces para regresar a la lista de tareas"
            >
                <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4a4a4a',
        marginBottom: 10,
    },
    message: {
        fontSize: 20,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    time: {
        fontSize: 24,
        color: '#333',
        fontWeight: '600',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#8000ff',
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ObtainTaskScreen;
