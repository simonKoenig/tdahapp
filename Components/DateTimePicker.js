import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/es';

const DateTimePickerComponent = ({ date, setDate, mode, setMode, show, setShow }) => {

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View style={styles.datetimeView}>
                <TouchableOpacity style={styles.datetimeElement} onPress={showDatepicker}>
                    <Text style={styles.dateText}>{moment(date).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.datetimeElement} onPress={showTimepicker}>
                    <Text style={styles.dateText}>{moment(date).format('HH:mm')}</Text>
                </TouchableOpacity>
            {show && (
                <DateTimePicker
                minimumDate={new Date()}
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    datetimeView: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    datetimeElement: {
        width: '45%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
    },
    dateText: {
        textAlign: 'center',
    },
});

export default DateTimePickerComponent;