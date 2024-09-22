// Components/Modals/AddPatientModal.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Text } from 'react-native';

const AddPatientModal = ({ visible, onClose, onSubmit }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        onSubmit(email); // Llama la función `onSubmit` con el email ingresado
        setEmail(''); // Limpiar el campo de email
        onClose(); // Cierra el modal
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email del paciente"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <View style={styles.buttonsContainer}>
                        <Button title="Cancelar" onPress={onClose} />
                        <Button title="Vincular" onPress={handleSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para el modal
    },
    modalContainer: {
        width: '80%',
        maxHeight: '50%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 4,
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 4,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
});

export default AddPatientModal;
