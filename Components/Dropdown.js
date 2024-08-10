// import React from 'react';
// import { StyleSheet } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';

// const DropdownComponent = ({ data, value, setValue, placeholder }) => {
//     return (
//         <Dropdown
//             style={styles.dropdown}
//             data={data}
//             labelField="label"
//             valueField="value"
//             placeholder={placeholder}
//             value={value}
//             onChange={item => {
//                 setValue(item.value);
//             }}
//         />
//     );
// };

// const styles = StyleSheet.create({
//     dropdown: {
//         width: '80%',
//         height: 40,
//         borderColor: '#D9D9D9',
//         borderWidth: 1,
//         borderRadius: 15,
//         paddingHorizontal: 10,
//         marginVertical: 10,
//         backgroundColor: '#D9D9D9',
//     },
// });

// export default DropdownComponent;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownComponent = ({ data, value, setValue, placeholder }) => {
    return (
        <Dropdown
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            onChange={item => {
                setValue(item.value);
            }}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        width: '80%',
        height: 40,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: '#D9D9D9',
    },
});

export default DropdownComponent;