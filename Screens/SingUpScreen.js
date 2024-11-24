import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigation } from '@react-navigation/native';
import DropdownComponent from '../Components/Dropdown';
import { EyeIcon, EyeOffIcon } from '../Components/Icons';
import { roles, PLACEHOLDER_TEXT_COLOR } from '../Utils/Constant';
import { globalStyles } from '../Utils/globalStyles';

function SignUpScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreApellido, setNombreApellido] = useState('');
    const [role, setRole] = useState(''); // Valor predeterminado
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para la visibilidad de la contraseña

    const handleSignUp = async () => {
        if (!email || !password || !nombreApellido || !role) {
            setErrorMessage('Por favor, complete todos los campos y seleccione un rol.');
            return;
        }

        const auth = getAuth();
        try {
            setErrorMessage(''); // Limpiar cualquier mensaje de error previo
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
            console.error('Error al registrar el usuario:', error);
            setErrorMessage(error.message || 'Error al registrar el usuario:');
        }
    };

    const handleCancel = () => {
        setEmail('');
        setPassword('');
        setNombreApellido('');
        setRole('paciente');
        navigation.goBack();
    };

    return (
        <View style={globalStyles.form}>
            <Text style={globalStyles.label}>Nombre y apellido</Text>
            <TextInput
                style={globalStyles.input}
                value={nombreApellido}
                onChangeText={setNombreApellido}
                placeholder='Ingrese su nombre y apellido'
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            />

            <Text style={globalStyles.label} accessibilityLabel="Campo del correo electrónico">Correo electrónico</Text>
            <TextInput 
                accessible={true}
                onChangeText={(text) => setEmail(text)} 
                style={globalStyles.input} 
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                placeholder='ejemplo@mail.com'
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={globalStyles.label} accessibilityLabel='Campo de ingreso de contraseña'>Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        accessible={true}
                        onChangeText={(text) => setPassword(text)}
                        style={[globalStyles.input, {width: '100%'}]}
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
    picker: {
        width: '80%',
        height: 40,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: '#D9D9D9',
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
