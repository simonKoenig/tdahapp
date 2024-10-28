import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/es';
import { AuthContext } from '../Context/AuthProvider';
import { globalStyles } from '../Utils/globalStyles';


const DateTimePickerComponent = ({ date, setDate, mode, setMode, show, setShow, editable }) => {
    const { isPaciente } = useContext(AuthContext);

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
            <TouchableOpacity
                style={[
                    globalStyles.dateTimeElement,
                    !editable && globalStyles.disabledDateTimeElement, // Aplicar estilos deshabilitados si editable es false
                ]}
                onPress={editable ? showDatepicker : null}
                disabled={!editable}
            >
                <Text
                    style={[
                        { textAlign: 'center' },
                        globalStyles.InfoText,
                        !editable && globalStyles.disabledDateText, // Texto gris si no es editable
                    ]}
                >
                    {editable || isPaciente() ? moment(date).format('DD/MM/YYYY') : 'Fecha'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    globalStyles.dateTimeElement,
                    !editable && globalStyles.disabledDateTimeElement, // Aplicar estilos deshabilitados si editable es false
                ]}
                onPress={editable ? showTimepicker : null}
                disabled={!editable}
            >
                <Text
                    style={[
                        { textAlign: 'center' },
                        globalStyles.InfoText,
                        !editable && globalStyles.disabledDateText, // Texto gris si no es editable
                    ]}
                >
                    {editable || isPaciente() ? moment(date).format('HH:mm') : 'Hora'}
                </Text>
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

    disabledDateText: {
        color: '#A9A9A9', // Color gris para el texto desactivado
    },
});

export default DateTimePickerComponent;