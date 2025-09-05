import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    Alert,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "ForgotPassword"
>;

const ForgotPasswordScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const [email, setEmail] = useState("");

    const handleSendCode = () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        // In real app → API call here
        Alert.alert("Success", "Verification code sent to your email");
        navigator.navigate("VerificationCode");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#2d1406" }}>
            <StatusBar barStyle="light-content" backgroundColor="#2d1406" translucent />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Enter your registered email to reset password
                    </Text>

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#fff"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                        <Text style={styles.buttonText}>Send Code</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#2d1406" },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#bd802e",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        width: "100%",
        backgroundColor: "#80521c",
        color: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#bd802e",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
