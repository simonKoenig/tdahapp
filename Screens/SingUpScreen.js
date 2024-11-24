import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigation } from '@react-navigation/native';
import DropdownComponent from '../Components/Dropdown';
import { EyeIcon, EyeOffIcon } from '../Components/Icons';
import { roles, PLACEHOLDER_TEXT_COLOR } from '../Utils/Constant';
import { globalStyles } from '../Utils/globalStyles';
import Toast from 'react-native-toast-message';

function SignUpScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreApellido, setNombreApellido] = useState('');
    const [role, setRole] = useState(''); // Valor predeterminado
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para la visibilidad de la contraseña
    const [errors, setErrors] = useState({});

    const handleSignUp = async () => {
        const newErrors = {};

        if (nombreApellido.length === 0) {
            newErrors.nombreApellido = 'El nombre y apellido es obligatorio';
        }

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

        if (role.length === 0) {
            newErrors.role = 'El rol es obligatorio';
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

        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Crear usuario con correo y contraseña
            const user = userCredential.user;

            // Guardar el rol y nombreApellido en Firestore
            await setDoc(doc(db, 'usuarios', user.uid), {
                email: user.email,
                nombreApellido: nombreApellido,
                rol: role,
            });

            console.log('Usuario registrado con éxito:', user.uid);
            await signInWithEmailAndPassword(auth, email, password);
            
        } catch (error) {
            let message = 'No se pudo registrar el usuario. Toca aquí para cerrar.';

            if (error.code === 'auth/email-already-in-use') {
                message = 'El correo electrónico ya está en uso. Toca aquí para cerrar.';
            }

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: message,
            });
        }
    };

    return (
        <View style={globalStyles.form}>
            <Text style={globalStyles.label}>Nombre y apellido</Text>
            <TextInput
                style={[globalStyles.input, errors.nombreApellido && globalStyles.errorInput]}
                value={nombreApellido}
                onChangeText={(text) => {
                    setNombreApellido(text);
                    setErrors((prevErrors) => ({ ...prevErrors, nombreApellido: '' }));
                }}
                placeholder='Ingrese su nombre y apellido'
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            />
            {errors.nombreApellido ? (
                    <Text style={globalStyles.errorText}>
                        {errors.nombreApellido}
                    </Text>
                ) : null}

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
            {errors.password ? (
                <Text style={globalStyles.errorText}>
                    {errors.password}
                </Text>
            ) : null}

            <Text style={globalStyles.label}>Seleccione el rol</Text>
            <DropdownComponent
                data={roles}
                value={role}
                setValue={setRole}
                placeholder="Seleccione un rol"
                onSelect={(value) => console.log('Selected:', value)}
                width='80%'
                searchActivo={false}
            />
            {errors.role ? (
                <Text style={globalStyles.errorText}>
                    {errors.role}
                </Text>
            ) : null}

            <TouchableOpacity style={[globalStyles.button, {width:'80%'}]} onPress={handleSignUp}>
                <Text style={globalStyles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
            
            
            {typeof errorMessage === 'string' && errorMessage.length > 0 && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
            )}
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
    errorContainer: {
        marginVertical: 8,
        padding: 10,
        backgroundColor: '#fee',
        borderRadius: 5,

    },
    errorMessage: {
        color: 'red',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center'
    }
});

export default SignUpScreen;
