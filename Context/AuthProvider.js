import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../firebase-config';
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de tener esta pantalla de carga
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado de autenticación
    const [role, setRole] = useState(null); // Estado del rol
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
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

    const login = (userRole) => {
        setIsAuthenticated(true);
        setRole(userRole);
    };

    const logout = async () => {
        const auth = getAuth();
        await signOut(auth);
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return <LoadingScreen />; // Renderiza la pantalla de carga mientras se obtiene el estado de autenticación
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};