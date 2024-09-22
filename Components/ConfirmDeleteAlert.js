import { Alert } from 'react-native';

const ConfirmDeleteAlert = ({ itemId, itemName, onConfirm }) => {
    const showAlert = () => {
        const alertMessage = itemName
            ? `¿Estás seguro que deseas eliminar al usuario ${itemName}?`
            : "¿Estás seguro que deseas eliminar este elemento?";

        Alert.alert(
            "Confirmar eliminación",
            alertMessage,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: () => onConfirm(itemId),
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    return showAlert; // Retornamos la función para ser llamada
};

export default ConfirmDeleteAlert;
