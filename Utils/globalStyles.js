import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, FONTS } from './Constant';
import { InfoToast } from 'react-native-toast-message';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.small,
    },
    form: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
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
        height: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SPACING.small,
        marginVertical: SPACING.small,
    },
    backbutton: {
        height: 50,
        backgroundColor: '#a0a0a0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SPACING.small,
        marginVertical: SPACING.small,
    },
    backbuttonText: {
        color: COLORS.text,
        textAlign: 'center',
        fontSize: FONT_SIZES.medium,
        fontFamily: FONTS.regular,
    },
    buttonText: {
        color: COLORS.secondary,
        textAlign: 'center',
        fontSize: FONT_SIZES.medium,
        fontFamily: FONTS.regular,
    },
    label: {
        width: '80%',
        marginLeft: 10,
        fontSize: FONT_SIZES.medium, // Puedes usar FONT_SIZES en lugar de un número fijo para consistencia
        color: COLORS.text, // Asegúrate de usar la paleta de colores globales
        textAlign: 'left',
    },
    input: {
        width: '80%',
        height: 40, // Aumentado a 48 para accesibilidad si lo prefieres
        borderColor: COLORS.inputBorder,
        borderWidth: 1,
        borderRadius: 20, // O cambia a 8 para consistencia si en otros lados usas menos redondeo
        padding: 10,
        marginVertical: SPACING.small, // Usando tu constante de espaciado para consistencia
        backgroundColor: COLORS.inputBackground,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium, // Consistencia en el tamaño de fuente
        color: COLORS.text,
    },
    disabledInput: {
        backgroundColor: COLORS.disableInput,
        width: '80%',
        height: 40, // Aumentado a 48 para accesibilidad si lo prefieres
        borderColor: COLORS.inputBorder,
        borderWidth: 1,
        borderRadius: 20, // O cambia a 8 para consistencia si en otros lados usas menos redondeo
        padding: 10,
        marginVertical: SPACING.small, // Usando tu constante de espaciado para consistencia
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium, // Consistencia en el tamaño de fuente
        color: COLORS.text,
    },
    dateTimeElement: {
        width: '45%',
        height: 40,
        borderColor: COLORS.inputBorder,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginVertical: SPACING.small,
        backgroundColor: COLORS.inputBackground,
        justifyContent: 'center',
    },
    disabledDateTimeElement: {
        backgroundColor: COLORS.disableInput,
        borderColor: '#A9A9A9',
        borderWidth: 1,
        borderRadius: 20,
    },
    disabledDateText: {
        color: COLORS.text
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

export const PLACEHOLDER_TEXT_COLOR = COLORS.infoText;
