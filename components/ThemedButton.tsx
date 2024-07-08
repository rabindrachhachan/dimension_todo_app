import {
  Text,
  type ButtonProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

export type ThemedButtonProps = ButtonProps & {
  title: string;
  btnStyle?: ViewStyle;
  textStyle?: TextStyle;
};

function ThemedButton({
  btnStyle,
  textStyle,
  title,
  ...rest
}: ThemedButtonProps) {
  return (
    <TouchableOpacity style={[styles.addButton, btnStyle]} {...rest}>
      <ThemedText style={[styles.addButtonText, textStyle]}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

export default ThemedButton;
const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#EF6E0B",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});
