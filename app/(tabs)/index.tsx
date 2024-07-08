import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import UserIdComponent from "../../components/userIdComponent";

const Home: React.FC = () => {
  return (
    <SafeAreaView>
      <View>
        <UserIdComponent />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default Home;
