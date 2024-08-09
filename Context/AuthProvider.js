import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const { uid, email, displayName, emailVerified, metadata } = user;
                const userDoc = await getDoc(doc(db, "usuarios", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser({
                        uid,
                        email,
                        displayName,
                        emailVerified,
                        nombreApellido: userData.nombreApellido,
                        metadata: {
                            creationTime: metadata.creationTime
                        }
                    });
                    setRole(userData.rol);
                }
            } else {
                setUser(null);
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role }}>
            {children}
        </AuthContext.Provider>
    );
};