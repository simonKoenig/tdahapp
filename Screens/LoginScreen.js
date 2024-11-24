import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as React from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { useNavigation } from '@react-navigation/native';
import { EyeIcon, EyeOffIcon } from '../Components/Icons';
import { globalStyles } from '../Utils/globalStyles';
import { PLACEHOLDER_TEXT_COLOR, SPACING } from '../Utils/Constant';


function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false); // Estado para la visibilidad de la contraseña

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const crearCuenta = () => {
        navigation.navigate('Signup');
    }

    const olvideContraseña = () => {
        navigation.navigate('ResetPassword');
    }

    const iniciarSesion = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Sesión iniciada');
                const user = userCredential.user;
            })
            .catch((error) => {
                console.log(error);
                Alert.alert(error.message);
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
    container: {
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    subtitulo: {
        fontSize: 24,
        color: 'gray',
        marginBottom: 30,
    },
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
    boton: {
        width: '100%',
        height: 50,
        borderRadius: 30,
        marginTop: 20,
    },
    gradient: {
        flex: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sesion: {
        fontSize: 20,
        color: 'white',
    },
    olvidePassword: {
        color: 'blue',
        marginTop: 10,
        marginBottom: 20,
    },
    botonCrearCuenta: {
        backgroundColor: '#fff',
        borderColor: '#4c669f',
        borderWidth: 1,
        marginTop: 10,
    },
    crearCuenta: {
        fontSize: 20,
        color: '#4c669f',
        textAlign: 'center',
        padding: 10,
    },
});

export default LoginScreen;
