import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = () => {
    return (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, // Hace que el componente ocupe toda la pantalla
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente para dar la sensación de overlay
        zIndex: 10, // Asegura que esté por encima del contenido
    },
});

export default LoadingScreen;
