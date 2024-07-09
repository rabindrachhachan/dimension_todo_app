import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, Dimensions } from "react-native";

import ThemedButton from "./ThemedButton";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  handleCompletePress: () => void;
  handleEditPress: () => void;
  handleDeletePress: () => void;
  isCompleted: boolean;
}

const CustomModal = ({
  isVisible,
  onClose,
  handleCompletePress,
  handleEditPress,
  handleDeletePress,
  isCompleted,
}: CustomModalProps) => {
  return (
    <Modal visible={isVisible} transparent onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.taskButtons}>
          <ThemedButton
            textStyle={[
              styles.editButton,
              isCompleted ? { color: "grey" } : {},
            ]}
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
            title={isCompleted ? "Done" : "Mark Done"}
            disabled={isCompleted}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    position: "absolute",
    bottom: 300,
    width: Dimensions.get("screen").width / 2,
    right: 0,
  },
  taskButtons: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  editButton: {
    color: "#0087BD",
    fontWeight: "bold",
    fontSize: 18,
    height: 24,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
    height: 24,
  },
  completeButton: {
    color: "#00A86B",
    fontWeight: "bold",
    fontSize: 18,
    height: 24,
  },
  btnStyle: { marginLeft: 8, backgroundColor: "transparent" },
});

export default CustomModal;
