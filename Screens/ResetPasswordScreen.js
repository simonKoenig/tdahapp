import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Context/AuthProvider';
import Toast from 'react-native-toast-message';
import { globalStyles } from '../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR } from '../Utils/globalStyles';

const ResetPasswordScreen = () => {
    const { resetPassword} = useContext(AuthContext);
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (email === '') {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Por favor, proporciona un mail válido. Toca aquí para cerrar.',
            });
            return;
        }
        resetPassword(email);
    };

    return (
        <View style={globalStyles.centeredContainer}>
            <Text style={globalStyles.label}>Correo electrónico</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="ejemplo@mail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                accessibilityLabel="Campo de ingreso de mail"
            />
            <TouchableOpacity style={[globalStyles.button, {width: '80%'}]} onPress={handleResetPassword}>
                <Text style={globalStyles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            
        </View>
    );
};

export default ResetPasswordScreen;