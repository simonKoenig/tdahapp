import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigation = useNavigation();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const crearCuenta = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Cuenta creado');
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
      Alert.alert(error.message);
    })
  }

  const iniciarSesion = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Sesión iniciada');
      const user = userCredential.user;
      console.log(user);
      navigation.navigate('Home');
    })
    .catch((error) => {
      console.log(error);
      Alert.alert(error.message);
    })
  }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Hola</Text>
          <Text style={styles.subtitulo}>Iniciar sesión</Text>
          <TextInput onChangeText={(text) => setEmail(text)} style={styles.TextInput} placeholder='Email' />
          <TextInput onChangeText={(text) => setPassword(text)} style={styles.TextInput} placeholder='Password' secureTextEntry={true} />
          <Text style={styles.olvidePassword}>¿Olvidó su contraseña?</Text>
          <TouchableOpacity onPress={iniciarSesion} style={styles.boton}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.gradient}
            >
              <Text style={styles.sesion}>Iniciar sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={crearCuenta}  style={[styles.boton, styles.botonCrearCuenta]}>
            <Text style={styles.crearCuenta}>Crear cuenta</Text>
          </TouchableOpacity>
          <StatusBar style="auto" />
        </View>
      </View>
    );
  }

  const Stack = createNativeStackNavigator();
  
  export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#f1f1f1',
      flex: 1,
    },
    container: {
      backgroundColor: '#f1f1f1',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    titulo: {
      fontSize: 60,
      color: '#344340',
      fontWeight: 'bold',
    },
    subtitulo: {
      fontSize: 24,
      color: 'gray',
      marginBottom: 30,
    },
    TextInput: {
      padding: 10,
      paddingStart: 20,
      width: '100%',
      height: 50,
      marginTop: 20,
      color: 'gray',
      borderRadius: 30,
      backgroundColor: '#fff',
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