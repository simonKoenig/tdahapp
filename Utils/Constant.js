// ../Utils/Constant.js
export const dificultades = [
    { label: 'Baja', value: 'Baja' },
    { label: 'Media', value: 'Media' },
    { label: 'Alta', value: 'Alta' }
];

export const filtradoDificultades = [
    { label: 'Todas las dificultades', value: '' },
    { label: 'Dificultad baja', value: 'Baja' },
    { label: 'Dificultad media', value: 'Media' },
    { label: 'Dificultad alta', value: 'Alta' },
];

export const roles = [
    { label: 'Usuario', value: 'paciente' },
    { label: 'Profesional de la salud', value: 'administrador' },
    { label: 'Profesional de la educación', value: 'administrador' },
    { label: 'Acompañante terapéutico', value: 'administrador' },
    { label: 'Padre/Madre/Tutor', value: 'administrador' }
];

export const COLORS = {
    primary: '#285583',  // Color accesible con mayor contraste para botones y elementos destacados
    secondary: '#FFFFFF',
    background: '#F9F9F4',  // Fondo claro para maximizar el contraste con el texto
    text: '#1A1A1A',  // Texto principal con mejor contraste
    infoText: '#565454',
};

export const FONT_SIZES = {
    small: 15,  // Tamaño aumentado para mejorar la legibilidad
    medium: 18, // Tamaño aumentado para textos generales
    large: 20,  // Tamaño para subtítulos o encabezados
    xlarge: 28, // Tamaño mayor para encabezados principales
};

export const SPACING = {
    small: 10,  // Aumentado ligeramente para mejorar el confort de lectura y navegación
    medium: 18,
    large: 24,
};

export const FONTS = {
    regular: 'AtkinsonHyperlegible_400Regular',  // Esta fuente es accesible debido a su alta legibilidad
    bold: 'AtkinsonHyperlegible_700Bold',
};

export const HEADER_STYLE = {
    headerStyle: {
        backgroundColor: '#F9F9F4', // Color de fondo del header
    },
    headerTintColor: '#1A1A1A', // Color del texto y los íconos del header
    headerTitleStyle: {
        fontWeight: 'regular', // Peso de la fuente del título del header
        fontFamily: 'AtkinsonHyperlegible_400Regular', // Fuente del título del header
    },
};

export const TAB_BAR_STYLE = {
    tabBarStyle: {
        backgroundColor: '#F9F9F4', // Color de fondo del tab bar
        // backgroundColor: '#F9F9F4', // Color de fondo del tab bar

    },
    tabBarActiveTintColor: '#285583', // Color del texto y los íconos activos
    // tabBarActiveTintColor: '#285583', // Color del texto y los íconos activos

    tabBarInactiveTintColor: '#1A1A1A', // Color del texto y los íconos inactivos
    // tabBarInactiveTintColor: '#1A1A1A', // Color del texto y los íconos inactivos
};