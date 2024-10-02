import React, { createContext, useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, arrayUnion, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase-config';
import LoadingScreen from '../Components/LoadingScreen';
import messaging from '@react-native-firebase/messaging';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Solicita permiso para recibir notificaciones (solo en dispositivos móviles)
    const requestUserPermission = async () => {
        if (Platform.OS === 'web') return; // Si la plataforma es web, no solicita permiso

        try {
            let authStatus = await messaging().requestPermission();
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (Platform.OS === 'android' && Platform.Version >= 33) {
                // En Android 13 o superior, se necesita el permiso de POST_NOTIFICATIONS
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
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

    // Función para guardar el token FCM en Firestore (solo en dispositivos móviles)
    const saveTokenToFirestore = async (userId, token) => {
        if (Platform.OS === 'web') return; // Si la plataforma es web, no guarda el token

        try {
            const userRef = doc(db, 'usuarios', userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const existingTokens = userData.FCMtokens || [];
                if (!existingTokens.includes(token)) {
                    await updateDoc(userRef, { FCMtokens: arrayUnion(token) });
                    console.log('Nuevo token FCM agregado en Firestore');
                } else {
                    console.log('El token FCM ya existe en Firestore, no se agregó');
                }
                setIsLoading(false);


            }
        } catch (error) {
            console.error('Error al guardar el token FCM en Firestore:', error);
        }
    };

    // Función para eliminar un token FCM específico de Firestore (solo en dispositivos móviles)
    const removeFcmTokenFromFirestore = async (userId, token) => {
        if (Platform.OS === 'web') return; // Si la plataforma es web, no elimina el token

        try {
            const userRef = doc(db, 'usuarios', userId);
            await updateDoc(userRef, { FCMtokens: arrayRemove(token) });
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
                        setRole(userData.rol);
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            nombreApellido: userData.nombreApellido,
                        });
                        setIsAuthenticated(true);

                        if (Platform.OS !== 'web') {
                            // Solicita permiso y gestiona tokens solo en dispositivos móviles
                            await requestUserPermission();

                            // Obtiene el token FCM si es un dispositivo móvil
                            const fcmToken = await messaging().getToken();
                            if (fcmToken) {
                                console.log('Token FCM obtenido:', fcmToken);
                                await saveTokenToFirestore(user.uid, fcmToken);
                            }

                            // Listener para detectar cambios en el token FCM (solo en móviles)
                            const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
                                console.log('Token FCM actualizado:', newToken);
                                await saveTokenToFirestore(user.uid, newToken);
                            });

                            return () => unsubscribeOnTokenRefresh();
                        }
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
            const auth = getAuth();
            const userId = user?.uid;
            const fcmToken = Platform.OS !== 'web' ? await messaging().getToken() : null;

            await signOut(auth);
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);

            if (userId && fcmToken) {
                await removeFcmTokenFromFirestore(userId, fcmToken);
                console.log('Token FCM eliminado del usuario en Firestore');
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    const isPaciente = () => role === 'paciente';

    return (
        <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, isPaciente }}>
            {children}
        </AuthContext.Provider>
    );
};
