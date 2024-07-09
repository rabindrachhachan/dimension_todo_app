import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Button, Text, Modal } from "react-native";
import AddInputBox from "./AddInput";
import ThemedButton from "./ThemedButton";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  handleAddTodo: (text: string) => void;
  editIndex: number;
  newTodoText: string;
}

const CustomModal = ({
  isVisible,
  onClose,
  handleAddTodo,
  editIndex,
  newTodoText = "",
}: CustomModalProps) => {
  const [inputText, setInputText] = useState(newTodoText);

  useEffect(() => {
    setInputText(newTodoText);
  }, [newTodoText]);

  const handleSave = () => {
    handleAddTodo(inputText);
    setInputText("");
  };

  const handleClose = () => {
    onClose();
    setInputText("");
  };

  const disabled = !inputText;

  return (
    <Modal visible={isVisible} transparent onRequestClose={handleClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Create Todo List Item</Text>
        <AddInputBox
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter new todo"
        />
        <View style={styles.buttonContainer}>
          <ThemedButton onPress={handleClose} title={"Close"} />
          <ThemedButton
            disabled={disabled}
            btnStyle={[disabled ? { backgroundColor: "#E5E5E5" } : {}]}
            onPress={handleSave}
            title={editIndex !== -1 ? "Update Task" : "Add Task"}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTitle: {
    fontSize: 14,
    marginBottom: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CustomModal;
