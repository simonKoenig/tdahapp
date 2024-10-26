import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const GraphPie = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;

    const colors = ["#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef"];

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Color de fondo
        strokeWidth: 2,
        useShadowColorFromDataset: false,
    };

    return (
        <View style={styles.container}>
            { data.length === 0 ? 
                <Text>No hay tareas</Text>
            : 
                <View>
                    <Text style={styles.title} >Cantidad de tareas por materia</Text>
                    <PieChart
                        data={data.map((item, index) => ({
                            ...item,
                            name: item.materia,
                            color: colors[index % colors.length],
                            legendFontColor: colors[index % colors.length],
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

export default GraphPie;