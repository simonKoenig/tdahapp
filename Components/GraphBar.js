import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const GraphBar = ({cantidadTareasPorDia}) => {
    
    if (cantidadTareasPorDia === undefined) {
        console.log('cantidadTareasPorDia es undefined');
        return null;
    }

    const data = {
        labels: cantidadTareasPorDia.map((item) => item.dia),
        datasets: [
            {
                data: cantidadTareasPorDia.map((item) => item.cantidad),
            }
        ]
    };

    const screenWidth = Dimensions.get('window').width;
    
    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Color de fondo
        strokeWidth: 2,
        useShadowColorFromDataset: false,
    };

    return (
        <View>
            <BarChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero={true}
            />
        </View>
    );
};

export default GraphBar;