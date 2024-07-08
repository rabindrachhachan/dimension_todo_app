import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Todo, storeTodos, getTodos } from "../modules/storage";
import uuid from "react-native-uuid";
import AddInputBox from "./AddInput";
import { ThemedText } from "./ThemedText";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");

  const fetchTodos = async () => {
    const storedTodos = await getTodos();
    setTodos(storedTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodoText.trim().length === 0) return;
    const newTodo: Todo = {
      id: `${uuid.v4()}`,
      task: newTodoText.trim(),
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoText("");
    await storeTodos(updatedTodos);
  };

  const renderItem = ({ item, index }: { item: Todo; index: number }) => {
    return <ListItem item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Todo List:</ThemedText>
      <AddInputBox
        value={newTodoText}
        onChangeText={setNewTodoText}
        placeholder="Enter new todo"
        onSave={handleAddTodo}
        btnText="Add Task"
        disabled={!newTodoText}
      />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

const keyExtractor = (item: Todo) => item.id;

const ListItem = ({ item, index }: { item: Todo; index: number }) => (
  <View style={styles.task} key={String(index)}>
    <ThemedText style={styles.label}>{item.task}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    fontSize: 18,
  },
  itemtext: {
    fontSize: 12,
  },
  taskButtons: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
});
export default TodoList;
