import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export async function storeData(key: string, value: any) {
    try {
        value = JSON.stringify(value);
        AsyncStorage.setItem(key, value);
    } catch (error) {
        Alert.alert('Error trying to save data');
    }
}

export async function retrieveData(key: string) {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        return null;
    }
}

export async function deleteData(key: string) {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        Alert.alert('Error trying to delete data');
    }
}