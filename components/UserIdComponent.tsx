import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { storeUserId, getUserId, removeUserId } from "../modules/storage";
import { ThemedText } from "./ThemedText";
import AddInputBox from "./AddInput";
import ThemedButton from "./ThemedButton";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const UserIdComponent: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [tempUserId, setTempUserId] = useState<string>("");
  const [isEditing, setEditing] = useState<boolean>(false);

  const disabled = !tempUserId;

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
      />
      <ThemedButton
        disabled={disabled}
        btnStyle={[disabled ? { backgroundColor: "#E5E5E5" } : {}]}
        onPress={handleSave}
        title={isEditing ? "Update User" : "Save User"}
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
}) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

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

  const addAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.task, addAnimatedStyle]}>
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
    </Animated.View>
  );
};

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
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "white",
    borderRadius: 4,
  },
  itemList: {
    fontSize: 16,

    paddingHorizontal: 16,
  },
  taskButtons: {
    flexDirection: "row",
    paddingTop: 12,
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
  btnStyle: { marginLeft: 8, backgroundColor: "transparent" },
});

export default UserIdComponent;
