import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App"; 

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen () {
  const navigator = useNavigation<NavigationProps>();
  const [activeIndex, setActiveIndex] = useState(0);

  // Wave loader effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3); // cycle between 0 → 1 → 2
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Navigate to SignIn after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      navigator.replace("SignIn");
    }, 9500); // 9.5s splash
    return () => clearTimeout(timer);
  }, [navigator]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2d1406"
          style={{ marginHorizontal: 5 }}
          animating={activeIndex === 0}
        />
        <ActivityIndicator
          size="large"
          color="#80521c"
          style={{ marginHorizontal: 5 }}
          animating={activeIndex === 1}
        />
        <ActivityIndicator
          size="large"
          color="#bd802e"
          style={{ marginHorizontal: 5 }}
          animating={activeIndex === 2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
