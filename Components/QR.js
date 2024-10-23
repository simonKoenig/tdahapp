import React, { useEffect } from 'react';
import { View, StyleSheet, AccessibilityInfo } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const PatientQRCode = ({ email }) => {


    return (
        <View
            style={styles.qrContainer}
            accessible={true} // Hacer que el contenedor sea accesible para el lector de pantalla
            accessibilityLabel={`Código QR para el usuario con el email ${email}`} // Descripción clara para TalkBack
            accessibilityHint="Escanée este código con otro dispositivo para vincular." // Pista adicional para el usuario
            accessibilityRole="image" // Indica que este componente es una imagen
        >
            <QRCode
                value={email}
                size={150}  // Tamaño más pequeño
                accessible={false} // El componente QR en sí no necesita ser accesible
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
