import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsyncStorage = async (key, item) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(item));
    }
    catch (error) {
        console.error(`Error setting AsyncStorage for key ${key}:`, error);
    }
}

export const getAsyncStorage = async (key) => {
    try {
        const cachedItems = await AsyncStorage.getItem(key);
        return cachedItems ? JSON.parse(cachedItems) : null;
    } catch (error) {
        console.error(`Error getting AsyncStorage for key ${key}:`, error);
    }
};

export const addAsyncStorage = async (key, newItem) => {
    try {
        const cachedItems = await getAsyncStorage(key);
        cachedItems.push(newItem);
        await setAsyncStorage(key, cachedItems);
    } catch (error) {
        console.error(`Error updating AsyncStorage for key ${key}:`, error);
    }
};

export const updateAsyncStorage = async (key, updatedItem) => {
    try {
        const cachedItems = await getAsyncStorage(key);
        const updatedItems = cachedItems.map(item => (item.id === updatedItem.id ? updatedItem : item));
        await setAsyncStorage(key, updatedItems);
    } catch (error) {
        console.error(`Error updating AsyncStorage for key ${key}:`, error);
    }
};

export const deleteAsyncStorage = async (key, id) => {
    try {
        const cachedItems = await getAsyncStorage(key);
        const updatedItems = cachedItems.filter(item => item.id !== id);
        await setAsyncStorage(key, updatedItems);
    } catch (error) {
        console.error(`Error deleting AsyncStorage for key ${key}:`, error);
    }
};

export const clearStorage = async () => {
    try {
        // Limpio el almacenamiento local
        const keys = await AsyncStorage.getAllKeys();
        const keysToClear = keys.filter(key => key.startsWith('rewards_') || key.startsWith('tasks_') || key.startsWith('subjects_'));
        await AsyncStorage.multiRemove(keysToClear);
        console.log('Specific storage keys cleared');
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
  };