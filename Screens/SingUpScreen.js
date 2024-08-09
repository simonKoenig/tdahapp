import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreApellido, setNombreApellido] = useState('');
    const [role, setRole] = useState('paciente'); // Valor predeterminado

    const handleSignUp = async () => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar el rol y nombreApellido en Firestore
            await setDoc(doc(db, 'usuarios', user.uid), {
                email: user.email,
                nombreApellido: nombreApellido,
                rol: role,
            });

            console.log('Usuario registrado con éxito:', user.uid);
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
        }
    };

    const handleCancel = () => {
        // Lógica para cancelar el registro
    };

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nombre y apellido</Text>
            <TextInput
                style={styles.input}
                value={nombreApellido}
                onChangeText={setNombreApellido}
            />
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Text style={styles.label}>Seleccione el rol</Text>
            <Picker
                selectedValue={role}
                style={styles.picker}
                onValueChange={(itemValue) => setRole(itemValue)}
            >
                <Picker.Item label="Administrador" value="administrador" />
                <Picker.Item label="Paciente" value="paciente" />
            </Picker>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    label: {
        width: '80%',
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
        textAlign: 'left', // Alinea el texto a la izquierda
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#D9D9D9',
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        flex: 1,
        height: 50,
        backgroundColor: '#4c669f',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default SignUpScreen;