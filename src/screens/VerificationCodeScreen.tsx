import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "VerificationCode"
>;

const VerificationCodeScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const [code, setCode] = useState("");

    const handleVerify = () => {
        if (code === "1234") {
            navigator.navigate("ResetPassword");
        } else {
            Alert.alert("Invalid Code", "Please try again");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#2d1406" }}>
            <StatusBar barStyle="light-content" backgroundColor="#2d1406" translucent />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Verification Code</Text>
                    <Text style={styles.subtitle}>
                        Enter the code we sent to your email
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Code"
                        placeholderTextColor="#fff"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={code}
                        onChangeText={setCode}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleVerify}>
                        <Text style={styles.buttonText}>Verify Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Alert.alert("Resend", "Code resent!")}>
                        <Text style={styles.resendText}>Didn’t get the code? Resend</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VerificationCodeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#2d1406" },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: { fontSize: 26, fontWeight: "bold", color: "#bd802e", marginBottom: 10 },
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
        textAlign: "center",
        fontSize: 20,
        letterSpacing: 8,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#bd802e",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    resendText: { color: "#bd802e", marginTop: 10 },
});
