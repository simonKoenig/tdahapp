import React from "react";
import { StyleSheet } from "react-native";
import Toast, { BaseToast } from "react-native-toast-message";

// Configuración de estilo para los toasts
const toastProps = {
    text1Style: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text2Style: {
        fontSize: 15,
    },
    text2NumberOfLines: 5, // Establece el número de líneas para text2
    style: {
        height: "auto", // Permite que la altura sea automática
        paddingVertical: 10,
        paddingHorizontal: 0,
        width: "100%",
    },
};

// Configuración de los toasts
export const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            {...toastProps}
            style={[toastProps.style, { borderLeftColor: "green" }]}
            onPress={() => props.hide()} // Ocultar al tocar
        />
    ),
    error: (props) => (
        <BaseToast
            {...props}
            {...toastProps}
            style={[toastProps.style, { borderLeftColor: "red" }]}
            onPress={() => props.hide()} // Ocultar al tocar
        />
    ),
    warning: (props) => (
        <BaseToast
            {...props}
            {...toastProps}
            style={[toastProps.style, { borderLeftColor: "yellow" }]}
            onPress={() => props.hide()} // Ocultar al tocar
        />
    ),
};

// En tu componente principal, asegúrate de incluir el Toast
<Toast config={toastConfig} />
