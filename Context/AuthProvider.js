import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Asegúrate de que la configuración de Firebase esté correctamente importada
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de que la pantalla de carga esté correctamente importada


import messaging from '@react-native-firebase/messaging';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Función para guardar el token FCM en Firestore
    const saveTokenToFirestore = async (userId, token) => {
        try {
            const userRef = doc(db, 'usuarios', userId);
            await updateDoc(userRef, {
                FCMtokens: token ? [token] : [],  // Actualiza el array de tokens FCM (sólo un token para móvil)
            });
            console.log('Token FCM guardado/actualizado en Firestore');
        } catch (error) {
            console.error('Error al guardar el token FCM en Firestore:', error);
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
            const auth = getAuth();
            await signOut(auth);
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);

            // Opcional: Elimina el token FCM del usuario en Firestore al cerrar sesión
            const authUser = getAuth().currentUser;
            if (authUser) {
                await saveTokenToFirestore(authUser.uid, null);  // Limpia el token FCM del usuario al cerrar sesión
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