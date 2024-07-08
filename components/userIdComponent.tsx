import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { storeUserId, getUserId, removeUserId } from "../modules/storage";
import { ThemedText } from "./ThemedText";
import AddInputBox from "./AddInput";
import ThemedButton from "./ThemedButton";

const UserIdComponent: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [tempUserId, setTempUserId] = useState<string>("");
  const [isEditing, setEditing] = useState<boolean>(false);

  const fetchUserId = async () => {
    const storedUserId = await getUserId();
    setUserId(storedUserId ?? "");
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const handleSave = async () => {
    await storeUserId(tempUserId);
    setTempUserId("");
    setEditing(false);
    fetchUserId();
  };

  const handleEdit = () => {
    setTempUserId(userId);
    setEditing(true);
  };

  const handleDelete = async () => {
    await removeUserId();
    fetchUserId();
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>User ID:</ThemedText>
      <AddInputBox
        value={tempUserId}
        onChangeText={setTempUserId}
        placeholder="Enter User ID"
        onSave={handleSave}
        btnText={isEditing ? "Update User" : "Save User"}
      />
      {userId ? (
        <Item
          userId={userId}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

const Item = ({
  userId,
  handleDelete,
  handleEdit,
}: {
  userId: string;
  handleDelete: () => void;
  handleEdit: () => void;
}) => (
  <View style={styles.task}>
    <Text style={styles.itemList}>{userId}</Text>
    <View style={styles.taskButtons}>
      <ThemedButton
        textStyle={styles.editButton}
        btnStyle={styles.btnStyle}
        onPress={handleEdit}
        title={"Edit"}
      />
      <ThemedButton
        textStyle={styles.deleteButton}
        btnStyle={styles.btnStyle}
        onPress={handleDelete}
        title={"Delete"}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  },
  itemList: {
    fontSize: 19,
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

export default UserIdComponent;
