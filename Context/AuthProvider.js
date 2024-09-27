import React, { createContext, useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, arrayUnion, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase-config'; // Asegúrate de que la configuración de Firebase esté correctamente importada
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de que la pantalla de carga esté correctamente importada
import messaging from '@react-native-firebase/messaging';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Solicita permiso para recibir notificaciones
    const requestUserPermission = async () => {
        try {
            let authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (Platform.OS === 'android' && Platform.Version >= 33) {
                // En Android 13 o superior, también se necesita el permiso de POST_NOTIFICATIONS
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permiso de notificaciones en Android 13 no autorizado');
                    return false;
                }
            }

            if (enabled) {
                console.log('Permiso de notificaciones autorizado:', authStatus);
                return true;
            } else {
                console.log('Permiso de notificaciones no autorizado:', authStatus);
                return false;
            }
        } catch (error) {
            console.error('Error al solicitar permisos de notificaciones:', error);
            return false;
        }
    };

    // Función para guardar el token FCM en Firestore
    const saveTokenToFirestore = async (userId, token) => {
        try {
            // Referencia al documento del usuario en Firestore
            const userRef = doc(db, 'usuarios', userId);

            // Verificamos el documento actual para ver si ya tiene tokens
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Comprobamos si el token ya está en el array de FCMtokens
                const existingTokens = userData.FCMtokens || [];
                if (!existingTokens.includes(token)) {
                    // Si el token no existe, lo agregamos
                    await updateDoc(userRef, {
                        FCMtokens: arrayUnion(token),  // arrayUnion agrega el token solo si no está presente
                    });
                    console.log('Nuevo token FCM agregado en Firestore');
                } else {
                    console.log('El token FCM ya existe en Firestore, no se agregó');
                }
            }
        } catch (error) {
            console.error('Error al guardar el token FCM en Firestore:', error);
        }
    };

    // Función para eliminar un token FCM específico de Firestore
    const removeFcmTokenFromFirestore = async (userId, token) => {
        try {
            const userRef = doc(db, 'usuarios', userId);
            await updateDoc(userRef, {
                FCMtokens: arrayRemove(token)  // Usa arrayRemove para eliminar solo el token específico
            });
            console.log('Token FCM eliminado de Firestore');
        } catch (error) {
            console.error('Error al eliminar el token FCM de Firestore:', error);
        }
    };


    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'usuarios', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setRole(userData.rol); // Aquí se usa userData.rol
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            nombreApellido: userData.nombreApellido,
                        });
                        setIsAuthenticated(true);

                        requestUserPermission(); // Solicita permiso para recibir notificaciones

                        // Si el usuario inicia sesión correctamente, obtenemos el token FCM
                        const fcmToken = await messaging().getToken();
                        if (fcmToken) {
                            console.log('Token FCM obtenido:', fcmToken);
                            await saveTokenToFirestore(user.uid, fcmToken);
                        }

                        // Listener para detectar cambios en el token FCM
                        const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
                            console.log('Token FCM actualizado:', newToken);
                            await saveTokenToFirestore(user.uid, newToken); // Guarda el nuevo token en Firestore
                        });

                        setIsLoading(false);

                        // Limpia el listener al salir
                        return () => unsubscribeOnTokenRefresh();


                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error al obtener el documento:", error);
                }
            } else {
                setUser(null);
                setRole(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error en la autenticación:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (userRole) => {
        try {
            setIsAuthenticated(true);
            setRole(userRole);
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
        }
    };

    const logout = async () => {
        try {
            const fcmToken = await messaging().getToken();

            const auth = getAuth();

            // Guarda el UID del usuario actual antes de cerrar sesión
            const userId = user?.uid;

            // Cierra la sesión de Firebase Auth
            await signOut(auth);

            // Limpia el estado local
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);

            // Verifica si el `userId` y el token FCM actual están disponibles para eliminarlos de Firestore
            if (userId && fcmToken) {
                await removeFcmTokenFromFirestore(userId, fcmToken);
                console.log('Token FCM eliminado del usuario en Firestore');
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };


    if (isLoading) {
        return <LoadingScreen />; // Renderiza la pantalla de carga mientras se obtiene el estado de autenticación
    }

    const isPaciente = () => {
        return role === 'paciente';
    };

    return (
        <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, isPaciente }}>
            {children}
        </AuthContext.Provider>
    );
};