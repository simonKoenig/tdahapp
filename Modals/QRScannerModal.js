import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, ActivityIndicator, Text, Pressable, AccessibilityInfo } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';

const QRScannerModal = ({ visible, onClose, onScan }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(true);
    const [closeButtonAccessible, setCloseButtonAccessible] = useState(false);

    // Restablecer el estado 'scanned' y solicitar permisos cuando el modal se vuelva a abrir
    useEffect(() => {
        if (visible) {
            setScanned(false);
            setLoading(true);  // Reiniciar el estado de carga también al abrir

            if (!permission?.granted) {
                requestPermission().then((response) => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }

            // Anunciar al abrir el modal para evitar que TalkBack enfoque automáticamente el botón "Cerrar"
            AccessibilityInfo.announceForAccessibility('Escáner de código QR abierto.');


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
                accessible={true}
                accessibilityLabel="Modal de escaneo de código QR"
            >
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                    <Text accessibilityRole="alert">Solicitando permisos de cámara...</Text>
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
                accessible={true}
                accessibilityLabel="Modal de permisos de cámara no concedidos"
            >
                <View style={styles.container}>
                    <Text>No se concedieron permisos para usar la cámara.</Text>
                    <Pressable
                        onPress={onClose}
                        style={styles.button}
                        accessible={false}
                    // accessible={closeButtonAccessible} // Hacer accesible el botón "Cerrar" solo después de un retraso
                    // accessibilityLabel="Cerrar el escáner de código QR"
                    // accessibilityHint="Cierra este modal y regresa a la pantalla anterior"
                    >
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

            // Verificar si el lector de pantalla está habilitado
            AccessibilityInfo.isScreenReaderEnabled().then((isEnabled) => {
                if (isEnabled) {
                    AccessibilityInfo.announceForAccessibility('El QR está siendo procesado.');
                    onScan(data);
                    setTimeout(() => {
                        onClose(); // Cerrar el modal después de 3 segundos
                    }, 3000);
                } else {
                    // Si el lector de pantalla no está habilitado cerrar el modal al instante y procesar el escaneo sin ningún retraso
                    onClose();
                    onScan(data);
                }
            });
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
            accessible={false}
            accessibilityLabel="Modal de escaneo de código QR"
        >
            <View style={{ flex: 1 }}>
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={(data) => handleBarcodeScanned(data.data)}
                    accessible={true}
                    accessibilityLabel="Vista de la cámara para escanear el código QR"
                />
                <View style={styles.closeButtonContainer}   // Android: deshabilita accesibilidad de esta vista y sus hijos
                >
                    <Pressable
                        onPress={onClose}
                        style={styles.button}
                    // accessible={closeButtonAccessible} // Controlar la accesibilidad del botón "Cerrar"
                    // accessibilityLabel="Cerrar el escáner de código QR"
                    // accessibilityHint="Cierra el escáner de código QR y regresa a la pantalla anterior"
                    >
                        <Text style={styles.buttonText} >Cerrar</Text>
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
