import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Todo, storeTodos, getTodos } from "../modules/storage";
import uuid from "react-native-uuid";
import AddInputBox from "./AddInput";
import { ThemedText } from "./ThemedText";
import ThemedButton from "./ThemedButton";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number>(-1);

  const fetchTodos = async () => {
    const storedTodos = await getTodos();
    setTodos(storedTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodoText.trim().length === 0) return;
    let newTodo: Todo = {
      id: `${uuid.v4()}`,
      task: newTodoText.trim(),
      completed: false,
    };
    let updatedTodos = [...todos];

    if (editIndex !== -1) {
      newTodo = {
        ...(todos[editIndex] ?? {}),
        task: newTodoText.trim(),
      };
      updatedTodos[editIndex] = newTodo;
      setEditIndex(-1);
    } else {
      updatedTodos = [...todos, newTodo];
    }

    setTodos(updatedTodos);
    setNewTodoText("");
    await storeTodos(updatedTodos);
  };

  const handleEditTodo = (index: number) => {
    const taskToEdit = todos[index]?.task;
    setNewTodoText(taskToEdit);
    setEditIndex(index);
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
      <AddInputBox
        value={newTodoText}
        onChangeText={setNewTodoText}
        placeholder="Enter new todo"
        onSave={handleAddTodo}
        btnText={editIndex !== -1 ? "Update Task" : "Add Task"}
        disabled={!newTodoText}
      />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const keyExtractor = (item: Todo) => item.id;

const ListItem = ({
  item,
  index,
  editIndex,
  handleEdit,
  handleDelete,
  handleComplete,
}: {
  item: Todo;
  index: number;
  editIndex: number;
  handleEdit: (index: number) => void;
  handleDelete: (id: string) => void;
  handleComplete: (id: string) => void;
}) => {
  if (!item.task) return <></>;

  const handleEditPress = () => {
    handleEdit(index);
  };

  const handleDeletePress = () => {
    handleDelete(item.id);
  };

  const handleCompletePress = () => {
    handleComplete(item.id);
  };

  const focused: boolean = editIndex === index;
  const completed: boolean = item.completed;

  return (
    <View
      style={[
        styles.task,
        focused && { borderBottomColor: "#FCCF98" },
        completed && { backgroundColor: "#04756C" },
      ]}
      key={String(index)}
    >
      <ThemedText style={styles.label}>{item.task}</ThemedText>
      <View style={styles.taskButtons}>
        <ThemedButton
          textStyle={styles.editButton}
          btnStyle={styles.btnStyle}
          onPress={handleEditPress}
          title={"Edit"}
        />
        <ThemedButton
          textStyle={styles.deleteButton}
          btnStyle={styles.btnStyle}
          onPress={handleDeletePress}
          title={"Delete"}
        />
        <ThemedButton
          textStyle={styles.completeButton}
          btnStyle={styles.btnStyle}
          onPress={handleCompletePress}
          title={completed ? "Completed" : "Mark Completed"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    padding: 16,
  },
  task: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 4,
  },
  itemtext: {
    fontSize: 12,
  },
  taskButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    marginRight: 10,
    color: "#0087BD",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  completeButton: {
    marginRight: 10,
    color: "#00A86B",
    fontWeight: "bold",
    fontSize: 18,
  },
  btnStyle: { marginLeft: 8, backgroundColor: "transparent" },
});
export default TodoList;
