import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => {

    return (
        <View
            style={styles.loadingOverlay}
            accessible={true}
            accessibilityLabel="Cargando, por favor espere." // Mensaje general para el lector de pantalla
        >
            <ActivityIndicator
                size="large"
                color="#0000ff"
                accessibilityLabel="Indicador de actividad, cargando..." // Mensaje descriptivo del indicador de actividad
            />
            <Text style={styles.loadingText}>
                Cargando...
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, // Hace que el componente ocupe toda la pantalla
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F4', // Fondo blanco semitransparente para dar la sensación de overlay
        zIndex: 10, // Asegura que esté por encima del contenido
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#000', // Color del texto
    },
});

export default LoadingScreen;
