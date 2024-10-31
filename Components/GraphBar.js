import React from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
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
                color: () => '#4c669f'
            }
        ]
    };

    const screenWidth = Dimensions.get('window').width * 0.9;
    
    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: () => '#4c669f',
        strokeWidth: 2,
        useShadowColorFromDataset: false,
    };

    return (
        <View >
            <Text style={styles.title} >Cantidad de tareas finalizadas por día</Text>
            { data.length === 0 ? 
                <Text>No hay tareas</Text>
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
                        style={{ paddingRight: 0 }} // Ajusta el espacio a la derecha
                    />
                </View>
            }
        </View>            
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default GraphBar;