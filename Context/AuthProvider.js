import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../firebase-config';
import LoadingScreen from '../Components/LoadingScreen'; // Asegúrate de tener esta pantalla de carga
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado de autenticación
    const [role, setRole] = useState(null); // Estado del rol
    const [isLoading, setIsLoading] = useState(true); // Estado de carga



    useEffect(() => {
        const auth = getAuth(); // Inicializa el servicio de autenticación
        const unsubscribe = onAuthStateChanged(auth, async (user) => { // Escucha los cambios de autenticación
            if (user) {
                const { uid, email } = user; // Extrae los datos del usuario
                const userDoc = await getDoc(doc(db, "usuarios", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser({
                        uid,
                        email,
                        nombreApellido: userData.nombreApellido,
                    });
                    setRole(userData.rol);
                }
            } else {
                setUser(null); //En caso de que no haya un usuario autenticado, establece el estado de usuario en nulo
                setRole(null); // Establece el estado del rol en n
            }
            setIsLoading(false); // Actualiza el estado de carga
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        const auth = getAuth();
        await signOut(auth);
        setUser(null);
        setRole(null);
    };

    if (isLoading) {
        return <LoadingScreen />; // Renderiza la pantalla de carga mientras se obtiene el estado de autenticación
    }

    return (
        <AuthContext.Provider value={{ user, role, logout }}>
            {children}
        </AuthContext.Provider>
    );
};