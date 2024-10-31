import React from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const GraphBarHours = ({tareasPorHora}) => {

    if (tareasPorHora === undefined) {
        console.log('tareasPorHora es undefined');
        return null;
    }
    
    const screenWidth = Dimensions.get('window').width;

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
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: () => '#4c669f',
        strokeWidth: 2,
        useShadowColorFromDataset: false,
        formatXLabel: (value) => {
            // Muestra solo labels específicos
            return [0, 4, 8, 12, 16, 20, 23].includes(Number(value)) ? value : '';
        },
    };
    

    return (
        <View>
            { data.length === 0 ? 
                <Text>No hay tareas</Text>
            : 
                <View>
                    <Text style={styles.title} >Cantidad de tareas finalizadas por hora</Text>
                    <BarChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        fromZero={true}
                        withInnerLines={false}
                        showValuesOnTopOfBars={true}
                        withHorizontalLabels={false}
                    />
                </View>
            }
        </View>            
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default GraphBarHours;