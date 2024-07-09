import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

interface CustomFABProps {
  onPress: () => void;
}

const CustomFAB: React.FC<CustomFABProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#EF6E0B",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  fabText: {
    color: "white",
    fontSize: 28,
    lineHeight: 28,
  },
});

export default CustomFAB;
