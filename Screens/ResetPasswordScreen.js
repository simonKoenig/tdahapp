import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../Context/AuthProvider';
import Toast from 'react-native-toast-message';
import { globalStyles } from '../Utils/globalStyles';

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
        console.log('Email para restablecer contraseña:', email);
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Restablecer Contraseña</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button title="Enviar" onPress={handleResetPassword} />
        </View>
    );
};

export default ResetPasswordScreen;