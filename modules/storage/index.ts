import AsyncStorage from '@react-native-async-storage/async-storage';
const USER_ID_KEY = 'user_id';
const TODOS_KEY ='todos'

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

export const storeUserId = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Failed to save the user ID to the storage', error);
  }
};

export const getUserId = async (): Promise<string | null> => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    return userId;
  } catch (error) {
    console.error('Failed to fetch the user ID from the storage', error);
    return null;
  }
};

export const removeUserId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('Failed to remove the user ID from the storage', error);
  }
};

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TODOS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Failed to fetch todos from storage', error);
    return [];
  }
};
export const storeTodos = async (todos: Todo[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(TODOS_KEY, jsonValue);
  } catch (error) {
    console.error('Failed to save todos to storage', error);
  }
};
