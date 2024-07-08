import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import UserIdComponent from "../../components/UserIdComponent";
import TodoList from "@/components/TodoList";

const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <UserIdComponent />
      <TodoList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default Home;
