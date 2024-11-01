import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { globalStyles } from '../Utils/globalStyles';

const GraphPie = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;

    // Generador de tonos de azul en función del índice
    const generateBlueShade = (index) => {
        const baseHue = 215; // Base de tono en azul
        const saturation = 40 + (index * 10) % 40; // Ampliar el rango de saturación entre 40 y 80
        const lightness = 50 + (index * 15) % 30; // Ampliar el rango de luminosidad entre 50 y 80

        return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    };

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Color de fondo
        strokeWidth: 2,
        useShadowColorFromDataset: false,
    };

    return (
        <View>
            { data.length === 0 ? 
                <Text style={globalStyles.noDataText}>No hay tareas</Text>
            : 
                <View>
                    <PieChart
                        data={data.map((item, index) => ({
                            ...item,
                            name: item.materia,
                            color: generateBlueShade(index),
                            legendFontColor: "#333333",
                            legendFontSize: 15,
                        }))}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"cantidad"}
                        backgroundColor="transparent"
                        absolute
                    />
                </View>
            }
        </View>
    );
};

export default GraphPie;