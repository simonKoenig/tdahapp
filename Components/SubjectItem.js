import React from 'react';
import Item from './Item'; // Asegúrate de importar el componente

const SubjectItem = ({ item, onPress }) => {
    return (
        <Item item={item} onPress={onPress} />
    );
};

export default SubjectItem;

