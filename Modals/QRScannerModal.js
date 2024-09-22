import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, ActivityIndicator, Text, Pressable } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';

const QRScannerModal = ({ visible, onClose, onScan }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(true);

    // Restablecer el estado 'scanned' y solicitar permisos cuando el modal se vuelva a abrir
    useEffect(() => {
        if (visible) {
            setScanned(false);
            if (!permission?.granted) {
                requestPermission().then((response) => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        }
    }, [visible]);

    // Mostrar indicador de carga mientras se solicita el permiso
    if (loading) {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                    <Text>Solicitando permisos de cámara...</Text>
                </View>
            </Modal>
        );
    }

    // Si los permisos no fueron concedidos, mostramos un mensaje
    if (!permission?.granted) {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                    <Text>No se concedieron permisos para usar la cámara.</Text>
                    <Pressable onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </Pressable>
                </View>
            </Modal>
        );
    }

    const handleBarcodeScanned = (data) => {
        if (!scanned) {
            setScanned(true);
            console.log(`El código QR escaneado es: ${data}`);
            onScan(data);  // Llamar a la función pasada como prop
            // El modal se cierra automáticamente al escanear
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1 }}>
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={(data) => handleBarcodeScanned(data.data)}
                />
                <View style={styles.closeButtonContainer}>
                    <Pressable onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonContainer: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default QRScannerModal;
