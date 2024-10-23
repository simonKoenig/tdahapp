import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, FONTS } from './Constant';
import { InfoToast } from 'react-native-toast-message';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.small,
    },
    text: {
        fontSize: FONT_SIZES.medium,
        color: COLORS.text,
        fontFamily: FONTS.regular,
    },
    lessBoldText: {
        fontSize: FONT_SIZES.medium,
        color: COLORS.text,
        fontFamily: FONTS.bold,
    },
    title: {
        fontSize: FONT_SIZES.large,
        color: COLORS.title,
        fontFamily: FONTS.bold,
    },
    button: {
        backgroundColor: COLORS.buttonBackground,
        paddingVertical: SPACING.medium,  // Se cambia a paddingVertical para mejorar la usabilidad
        paddingHorizontal: SPACING.large,  // Aumentado para hacer los botones más fáciles de presionar
        borderRadius: 8,  // Bordes redondeados más accesibles visualmente
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.buttonText,
        fontSize: FONT_SIZES.large,
        fontFamily: FONTS.bold,
    },
    input: {
        width: '100%',
        height: 48,  // Aumentado para mejorar la accesibilidad táctil
        borderColor: COLORS.inputBorder,
        borderWidth: 1,
        borderRadius: 8,  // Borde más redondeado para mejorar la estética y la accesibilidad
        paddingHorizontal: SPACING.medium,  // Aumentado para un mayor confort
        marginVertical: SPACING.small,
        backgroundColor: COLORS.inputBackground,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium,  // Tamaño de fuente mejorado para la legibilidad
        color: COLORS.text,  // Asegura que el color del texto del input sea suficientemente contrastante
    },
    centeredContainer: {  // Nuevo estilo para contenedores centrados
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noDataText: {  // Estilo para textos que indiquen que no hay datos disponibles
        fontSize: FONT_SIZES.medium,
        color: 'gray',  // Usar un color secundario para mensajes menos prominentes
    },
    InfoText:
    {
        fontSize: FONT_SIZES.small,
        color: COLORS.infoText,
        fontFamily: FONTS.regular,
    },
});
