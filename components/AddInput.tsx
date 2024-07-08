import React from "react";
import { View, Button, StyleSheet } from "react-native";
import ThemedTextInput from "./ThemedInput";
import ThemedButton from "./ThemedButton";

interface CustomInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  placeholder?: string;
  btnText?: string;
}

const AddInputBox: React.FC<CustomInputBoxProps> = ({
  value,
  onChangeText,
  onSave,
  placeholder,
  btnText = "Save",
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <ThemedTextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
      </View>

      <ThemedButton title={btnText} onPress={onSave} />
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
    width: "100%",
    minHeight: 40,
  },
});

export default AddInputBox;
