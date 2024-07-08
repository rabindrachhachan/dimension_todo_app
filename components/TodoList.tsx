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

  const renderItem = ({ item, index }: { item: Todo; index: number }) => {
    return (
      <ListItem
        item={item}
        index={index}
        handleEdit={handleEditTodo}
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
}: {
  item: Todo;
  index: number;
  editIndex: number;
  handleEdit: (index: number) => void;
}) => {
  if (!item.task) return <></>;

  const handleEditPress = () => {
    handleEdit(index);
  };

  const focused = editIndex === index;

  return (
    <View
      style={[styles.task, focused && { borderBottomColor: "#FCCF98" }]}
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
      </View>
    </View>
  );
};

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
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
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
  btnStyle: { marginLeft: 8, backgroundColor: "transparent" },
});
export default TodoList;
