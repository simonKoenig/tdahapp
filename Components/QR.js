import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const PatientQRCode = ({ email }) => {
    return (
        <View style={styles.qrContainer}>
            <QRCode
                value={email}
                size={150}  // Tamaño más pequeño
            />
        </View>
    );
};

const styles = StyleSheet.create({
    qrContainer: {
        alignItems: 'center',  // Centra el código QR horizontalmente
        justifyContent: 'center', // Centra el código QR verticalmente
        padding: 20,
        borderRadius: 10,  // Bordes redondeados para darle un estilo más suave
        marginBottom: 20,  // Espacio debajo del código QR
    },
});

export default PatientQRCode;
