import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Asegúrate de que la configuración de Firebase esté correctamente importada
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de que la pantalla de carga esté correctamente importada

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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