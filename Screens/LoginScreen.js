import { StyleSheet, Text, View, TextInput, TouchableOpacity, AccessibilityInfo } from 'react-native';
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { useNavigation } from '@react-navigation/native';
import { EyeIcon, EyeOffIcon } from '../Components/Icons';
import Toast from 'react-native-toast-message';
import { globalStyles } from '../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR, SPACING } from '../Utils/Constant';


function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para la visibilidad de la contraseña
    const [errors, setErrors] = useState({});

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const crearCuenta = () => {
        navigation.navigate('Signup');
    }

    const olvideContraseña = () => {
        navigation.navigate('ResetPassword');
    }

    const iniciarSesion = () => {
        const newErrors = {};

        if (email.length === 0) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!email.includes('@') && !email.includes('.')) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        if (password.length === 0) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Verifica si hay errores
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            
            // Construye el mensaje para el lector de pantalla
            const accessibilityMessage = `Error al iniciar sesión. ${Object.values(newErrors).join('. ')}`;

            // Anuncia el mensaje para TalkBack o VoiceOver
            AccessibilityInfo.announceForAccessibility(accessibilityMessage);

            return;
        } else {
            setErrors({});
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Sesión iniciada');
                const user = userCredential.user;
            })
            .catch((error) => {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Correo electrónico o contraseña incorrectos. Toca aquí para cerrar.',
                });
            })
    }

    return (
        <View style={globalStyles.container}>
        
            <Text style={[globalStyles.title, {fontSize: 60, textAlign:'center'}]}>plAAAner</Text>
            <Text style={[globalStyles.lessBoldText, {textAlign:'center', paddingTop:SPACING.medium}]}>Bienvenido</Text>
            
            <View style={globalStyles.form}>
                <Text style={globalStyles.label} accessibilityLabel="Campo del correo electrónico">Correo electrónico</Text>
                <TextInput 
                    accessible={true}
                    onChangeText={(text) => {
                        setEmail(text);
                        setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                    }} 
                    style={[globalStyles.input, errors.email && globalStyles.errorInput]}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    placeholder='ejemplo@mail.com'
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {errors.email ? (
                    <Text style={globalStyles.errorText}>
                        {errors.email}
                    </Text>
                ) : null}
                
                <Text style={globalStyles.label} accessibilityLabel='Campo de ingreso de contraseña'>Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        accessible={true}
                        onChangeText={(text) => {
                            setPassword(text)
                            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                        }}
                        style={[globalStyles.input, {width: '100%'} , errors.password && globalStyles.errorInput]}
                        placeholder='Ingrese su contraseña'
                        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                        secureTextEntry={!isPasswordVisible} 
                        value={password}
                        autoCapitalize="none"

                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                        {isPasswordVisible ? (
                            <EyeIcon color="gray" size={24} /> 
                        ) : (
                            <EyeOffIcon color="gray" size={24} /> 
                        )}
                    </TouchableOpacity>
                </View>
                {errors.email ? (
                    <Text style={globalStyles.errorText}>
                        {errors.password}
                    </Text>
                ) : null}
                
                <TouchableOpacity onPress={olvideContraseña}>
                    <Text style={styles.olvidePassword}>¿Olvidó su contraseña?</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={iniciarSesion} style={[globalStyles.button, {width:'80%'}]}>
                        <Text style={globalStyles.buttonText}>Iniciar sesión</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={crearCuenta} style={[globalStyles.backbutton, {width:'80%'}]}>
                    <Text style={globalStyles.backbuttonText}>Crear cuenta</Text>
                </TouchableOpacity>
            </View>
        
        </View>
    );
}

const styles = StyleSheet.create({
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },
    eyeIcon: {
        zIndex: 1,
        position: 'absolute',
        right: 10,
    },
    olvidePassword: {
        color: 'blue',
        marginTop: 10,
        marginBottom: 20,
    },
});

export default LoginScreen;
