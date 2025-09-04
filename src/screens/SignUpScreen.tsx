import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type SignUpNavProp = StackNavigationProp<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign Up Screen</Text>
      <Button title="Back to Sign In" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
