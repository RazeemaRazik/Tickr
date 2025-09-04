import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
    Splash: undefined;
    SignIn: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Splash"
>;

const SplashScreen: React.FC = () => {
    const navigation = useNavigation<SplashScreenNavigationProp>();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 3); // cycle between 0 → 1 → 2
        }, 500); // change every 0.5s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("SignIn"); // go to SignIn after 2.5s
        }, 9500);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.appName}>Tick it. Flick it. Done with Tickr!</Text>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2d1406" style={{ marginHorizontal: 5 }} animating={activeIndex === 0}/>
                <ActivityIndicator size="large" color="#80521c" style={{ marginHorizontal: 5 }} animating={activeIndex === 1}/> 
                <ActivityIndicator size="large" color="#bd802e" style={{ marginHorizontal: 5 }} animating={activeIndex === 2}/>
            </View>

        </View>
    );
};

export default SplashScreen;

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
    appName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#80521c",
        letterSpacing: 1,
    },
    loadingContainer: {
        flexDirection: "row", // side by side
        justifyContent: "center", // center horizontally
        alignItems: "center", // align vertically
        marginTop: 20,
    },
});
