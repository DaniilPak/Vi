import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key: string, value: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Data saved successfully');
  } catch (error) {
    console.log('Error saving data: ', error);
    throw error;
  }
};

export const getData = async (key: string): Promise<number | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      console.log('No data found');
      return null;
    }
  } catch (error) {
    console.log('Error retrieving data: ', error);
    throw error;
  }
};