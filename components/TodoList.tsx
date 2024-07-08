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
  const isFocused: boolean = editIndex === index;
  const isCompleted: boolean = item.completed;

  const translateY = useSharedValue(50);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const deleteOpacity = useSharedValue(1);
  const lineThrough = useSharedValue(0);
  const highlight = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  useEffect(() => {
    if (isCompleted) {
      lineThrough.value = withTiming(1, { duration: 500 });
    } else {
      lineThrough.value = withTiming(0, { duration: 500 });
    }
  }, [isCompleted]);

  useEffect(() => {
    if (!isFocused) {
      highlight.value = withTiming(0, { duration: 1000 });
    }
  }, [isFocused]);

  const addAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const deleteAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: deleteOpacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      textDecorationLine: lineThrough.value ? "line-through" : "none",
      color: lineThrough.value ? "grey" : "black",
    };
  });

  const highlightStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: highlight.value === 1 ? "#FCCF98" : "white",
    };
  });

  if (!item.task) return <></>;

  const handleEditPress = () => {
    if (!isCompleted) {
      handleEdit(index);
      highlight.value = withTiming(1, { duration: 50 });
    }
  };

  const handleDeletePress = () => {
    translateX.value = withTiming(-100, { duration: 500 }, () => {
      runOnJS(handleDelete)(item.id);
    });
    deleteOpacity.value = withTiming(0, { duration: 500 });
  };

  const handleCompletePress = () => {
    if (!isCompleted) {
      handleComplete(item.id);
    }
  };

  return (
    <Animated.View
      style={[
        styles.task,
        addAnimatedStyle,
        deleteAnimatedStyle,
        highlightStyle,
      ]}
      key={String(index)}
    >
      <Animated.Text style={[styles.itemtext, textStyle]}>
        {item.task}
      </Animated.Text>
      <View style={styles.taskButtons}>
        <ThemedButton
          textStyle={[styles.editButton, isCompleted ? { color: "grey" } : {}]}
          btnStyle={styles.btnStyle}
          onPress={handleEditPress}
          title={"Edit"}
          disabled={isCompleted}
        />
        <ThemedButton
          textStyle={styles.deleteButton}
          btnStyle={styles.btnStyle}
          onPress={handleDeletePress}
          title={"Delete"}
        />
        <ThemedButton
          textStyle={[
            styles.completeButton,
            isCompleted ? { color: "grey" } : {},
          ]}
          btnStyle={styles.btnStyle}
          onPress={handleCompletePress}
          title={isCompleted ? "Completed" : "Mark Completed"}
          disabled={isCompleted}
        />
      </View>
    </Animated.View>
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
    fontSize: 16,
    marginBottom: 10,
    padding: 16,
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
