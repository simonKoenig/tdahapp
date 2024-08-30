import React from 'react';
import Item from './Item'; // Asegúrate de importar el componente

const RewardItem = ({ item, onPress }) => {
    return (
        <Item item={item} onPress={onPress} tipo="dificultad" valor={item.dificultad} />
    );
};


export default RewardItem;

