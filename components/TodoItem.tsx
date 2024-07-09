import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Todo } from "../modules/storage";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import CustomModal from "./MoreActionModal";

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
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
    handleHide();
    if (!isCompleted) {
      handleEdit(index);
      highlight.value = withTiming(1, { duration: 50 });
    }
  };

  const handleDeletePress = () => {
    handleHide();
    translateX.value = withTiming(-100, { duration: 500 }, () => {
      runOnJS(handleDelete)(item.id);
    });
    deleteOpacity.value = withTiming(0, { duration: 500 });
  };

  const handleCompletePress = () => {
    handleHide();
    if (!isCompleted) {
      handleComplete(item.id);
    }
  };

  const handleShow = () => {
    setIsVisible(true);
  };
  const handleHide = () => {
    setIsVisible(false);
  };

  const Icon = isCompleted
    ? require("./../assets/images/accept.png")
    : require("./../assets/images/circle.png");

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
      <Image source={Icon} resizeMode={"contain"} style={styles.iconStyle} />
      <View style={{ flex: 1 }}>
        <Animated.Text style={[styles.itemtext, textStyle]}>
          {item.task}
        </Animated.Text>
      </View>
      <TouchableOpacity
        onPress={handleShow}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Image
          source={require("./../assets/images/more.png")}
          resizeMode={"contain"}
          style={styles.moreIconStyle}
          tintColor={"#EF6E0B"}
        />
      </TouchableOpacity>
      <CustomModal
        isVisible={isVisible}
        onClose={handleHide}
        handleCompletePress={handleCompletePress}
        handleEditPress={handleEditPress}
        handleDeletePress={handleDeletePress}
        isCompleted={isCompleted}
      />
    </Animated.View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "red",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    padding: 16,
  },
  task: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 4,
    padding: 8,
  },
  itemtext: {
    fontSize: 14,
    width: "90%",
  },

  iconStyle: { height: 14, width: 14, marginRight: 8 },
  moreIconStyle: { height: 16, width: 16 },
});
