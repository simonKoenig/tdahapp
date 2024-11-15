// Components/Modals/AddPatientModal.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Text, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { globalStyles } from '../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR } from '../Utils/globalStyles';
import Toast from 'react-native-toast-message';



const AddPatientModal = ({ visible, onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleSubmit = () => {
        const newErrors = {};

        if (!validateEmail(email)) {
            newErrors.email = 'El email ingresado no es válido';
        }
        if (email.length === 0) {
            newErrors.email = 'El email es obligatorio';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const accessibilityMessage = `Error al vincular un estudiante. ${Object.values(newErrors).join('. ')}`;
            AccessibilityInfo.announceForAccessibility(accessibilityMessage);
            return;
        }

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
                        style={[globalStyles.input, errors.email && styles.errorInput, { width: '100%' }]}
                        placeholder="Email del estudiante"
                        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors((prevErrors) => ({ ...prevErrors, email: '' })); // Limpia el error mientras escribe
                        }}
                    />
                    {errors.email ? (
                        <Text style={styles.errorMessage}>
                            {errors.email}
                        </Text>
                    ) : null}

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={onClose} style={[globalStyles.backbutton, { flex: 1, marginRight: 10 }]}>
                            <Text style={globalStyles.backbuttonText}>Atrás</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={[globalStyles.button, { flex: 1 }]}>
                            <Text style={globalStyles.buttonText}>Vincular</Text>
                        </TouchableOpacity>
                        {/* <Button title="Cancelar" onPress={onClose} />
                        <Button title="Vincular" onPress={handleSubmit} /> */}
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
        width: '90%',
        maxHeight: '50%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
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
    errorInput: {
        borderColor: 'red',
        borderWidth: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 10,
        marginTop: -5,
    },
});

export default AddPatientModal;
