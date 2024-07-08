import React from "react";
import { View, Button, StyleSheet, ViewStyle } from "react-native";
import ThemedTextInput from "./ThemedInput";
import ThemedButton from "./ThemedButton";

interface CustomInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  placeholder?: string;
  btnText?: string;
  disabled?: boolean;
  btnStyle?: ViewStyle[] | ViewStyle;
}

const AddInputBox: React.FC<CustomInputBoxProps> = ({
  value,
  onChangeText,
  onSave,
  placeholder,
  btnText = "Save",
  disabled,
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

      <ThemedButton
        title={btnText}
        onPress={onSave}
        disabled={disabled}
        btnStyle={[disabled ? { backgroundColor: "#E5E5E5" } : {}]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 18,
    width: "100%",
    minHeight: 48,
    backgroundColor: "white",
  },
});

export default AddInputBox;
