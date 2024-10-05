import { Alert } from 'react-native';

export const showConfirmAlert = ({ 
    title = "Confirmar",  // Título por defecto
    message = "¿Estás seguro?",  // Mensaje por defecto
    confirmText = "Confirmar",  // Texto por defecto del botón de confirmación
    cancelText = "Cancelar",  // Texto por defecto del botón de cancelación
    onConfirm,  // Función a ejecutar al confirmar
    onCancel,   // Función opcional para cancelar
}) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: cancelText,
                onPress: onCancel || (() => {}),  // Ejecuta onCancel si está definido, o hace nada
                style: "cancel",
            },
            {
                text: confirmText,
                onPress: onConfirm,  // Llama a la función pasada para confirmar
                style: "destructive",  // Estilo destructivo para acciones como eliminar
            },
        ],
        { cancelable: true }
    );
};
