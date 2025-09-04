import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type SignInNavProp = StackNavigationProp<RootStackParamList, "SignIn">;

const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign In Screen</Text>
      <Button title="Go to Sign Up" onPress={() => navigation.navigate("SignUp")} />
      <Button title="Continue to Home" onPress={() => navigation.replace("Home")} />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
