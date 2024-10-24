import React from 'react';
import Item from './Item'; // Asegúrate de importar el componente

const TaskItem = ({ item, onPress }) => {
    return (
        <Item item={item} onPress={onPress} tipo="estado" valor={item.estado} mostrarFecha={true} />
    );
};

export default TaskItem;