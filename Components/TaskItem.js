import React from 'react';
import Item from './Item'; // Asegúrate de importar el componente

const TaskItem = ({ item, onPress }) => {
    return (
        <Item item={item} onPress={onPress} tipo="estado" valor={item.estado} />
    );
};


export default TaskItem;

