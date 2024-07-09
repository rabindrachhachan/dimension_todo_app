import React from "react";
import { View, StyleSheet, TextStyle } from "react-native";
import ThemedTextInput from "./ThemedInput";

interface CustomInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  textStyle?: TextStyle[] | TextStyle;
}

const AddInputBox = ({
  value,
  onChangeText,
  placeholder,
  textStyle,
}: CustomInputBoxProps) => {
  return (
    <View style={styles.inputContainer}>
      <ThemedTextInput
        style={[styles.input, textStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
    width: "100%",
    minHeight: 48,
    backgroundColor: "white",
  },
});

export default AddInputBox;
