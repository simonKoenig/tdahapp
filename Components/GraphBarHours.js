import React from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { globalStyles } from '../Utils/globalStyles';
import { COLORS } from '../Utils/Constant';

const GraphBarHours = ({tareasPorHora}) => {

    if (tareasPorHora === undefined) {
        console.log('tareasPorHora es undefined');
        return null;
    }
    
    const screenWidth = Dimensions.get('window').width * 0.9;

    const data = {
        labels: Array.from({ length: 24 }, (_, i) => i), // Horas de 0 a 23
        datasets: [
            {
                data: tareasPorHora,
                color: () => '#4c669f',
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: COLORS.background,
        backgroundGradientTo: COLORS.background,
        color: () => COLORS.primary,
        strokeWidth: 2,
        useShadowColorFromDataset: false,
        formatXLabel: (value) => {
            // Muestra solo labels específicos
            return [0, 4, 8, 12, 16, 20, 23].includes(Number(value)) ? value : '';
        },
        barPercentage: 0.3,
        
    };
    

    return (
        <View>
            { data.length === 0 ? 
                <Text style={globalStyles.noDataText}>No hay tareas</Text>
            : 
                <View>
                    <BarChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        fromZero={true}
                        withInnerLines={false}
                        showValuesOnTopOfBars={true}
                        withHorizontalLabels={false}
                        style={{
                            paddingRight: 0,
                         }}
                    />
                </View>
            }
        </View>            
    );
};

export default GraphBarHours;