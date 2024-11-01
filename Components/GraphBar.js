import React from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { globalStyles } from '../Utils/globalStyles';
import { COLORS } from '../Utils/Constant';

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
                color: () => COLORS.primary
            }
        ]
    };

    const screenWidth = Dimensions.get('window').width * 0.9;
    
    const chartConfig = {
        backgroundGradientFrom: COLORS.background,
        backgroundGradientTo: COLORS.background,
        color: () => COLORS.primary,
        strokeWidth: 2,
        useShadowColorFromDataset: false,
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

export default GraphBar;