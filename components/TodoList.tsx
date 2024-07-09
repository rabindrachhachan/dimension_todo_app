import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Todo, storeTodos, getTodos } from "../modules/storage";
import uuid from "react-native-uuid";
import AddInputBox from "./AddInput";
import { ThemedText } from "./ThemedText";
import ThemedButton from "./ThemedButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import CustomFAB from "./FAB";
import ListItem from "./TodoItem";
import CustomModal from "./InputModal";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const fetchTodos = async () => {
    const storedTodos = await getTodos();
    setTodos(storedTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleShowModal = () => {
    setIsVisible(true);
  };
  const handleHideModal = () => {
    setIsVisible(false);
  };

  const handleAddTodo = async (inputText: string) => {
    if (inputText.trim().length === 0) return;
    let newTodo: Todo = {
      id: `${uuid.v4()}`,
      task: inputText.trim(),
      completed: false,
    };
    let updatedTodos = [...todos];

    if (editIndex !== -1) {
      newTodo = {
        ...(todos[editIndex] ?? {}),
        task: inputText.trim(),
      };
      updatedTodos[editIndex] = newTodo;
      setEditIndex(-1);
    } else {
      updatedTodos = [...todos, newTodo];
    }
    handleHideModal();
    setTodos(updatedTodos);
    setNewTodoText("");
    await storeTodos(updatedTodos);
  };

  const handleEditTodo = (index: number) => {
    const taskToEdit = todos[index]?.task;
    setNewTodoText(taskToEdit);
    setEditIndex(index);
    handleShowModal();
  };

  const handleRemoveTodo = async (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    await storeTodos(updatedTodos);
  };

  const handleCompleteTodo = async (id: string) => {
    let updatedTodos = [...todos];
    const editIndex = updatedTodos.findIndex((item: Todo) => item.id === id);
    if (editIndex !== -1) {
      let newTodo = {
        ...(todos[editIndex] ?? {}),
        completed: true,
      };
      updatedTodos[editIndex] = newTodo;
    }
    setTodos(updatedTodos);
    await storeTodos(updatedTodos);
  };

  const renderItem = ({ item, index }: { item: Todo; index: number }) => {
    return (
      <ListItem
        item={item}
        index={index}
        handleEdit={handleEditTodo}
        handleDelete={handleRemoveTodo}
        handleComplete={handleCompleteTodo}
        editIndex={editIndex}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Todo List:</ThemedText>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
      <CustomFAB onPress={handleShowModal} />
      <CustomModal
        isVisible={isVisible}
        onClose={handleHideModal}
        handleAddTodo={handleAddTodo}
        editIndex={editIndex}
        newTodoText={newTodoText}
      />
    </View>
  );
};

const keyExtractor = (item: Todo) => item.id;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "white",
  },
  label: {
    fontSize: 18,
  },
});
export default TodoList;
