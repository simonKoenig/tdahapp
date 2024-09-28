import React from 'react';
import Item from './Item'; // Asegúrate de importar el componente

const RewardItem = ({ item, onPress }) => {
    console.log(item);
    return (
        <Item item={item} onPress={onPress} tipo="dificultad" valor={item.dificultad} />
    );
};

export default RewardItem;