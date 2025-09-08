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
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "VerificationCode"
>;

const VerificationCodeScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const route = useRoute<any>();
    const [code, setCode] = useState("");

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

                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            let formData = new FormData();
                            formData.append("email", route.params.email);
                            formData.append("code", code);

                            const response = await fetch(
                                "https://2779e16733c2.ngrok-free.app/Tickr/VerifyCode",
                                {
                                    method: "POST",
                                    body: formData,
                                }
                            );

                            const json = await response.json();

                            if (json.status) {
                                navigator.navigate("ResetPassword", {
                                    email: route.params.email,
                                });
                            } else {
                                Alert.alert("Error", json.message);
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Verify Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={async () => {
                            let formData = new FormData();
                            formData.append("email", route.params.email);

                            try {
                                const response = await fetch(
                                    "https://2779e16733c2.ngrok-free.app/Tickr/ForgotPassword",
                                    {
                                        method: "POST",
                                        body: formData,
                                    }
                                );

                                const json = await response.json();
                                if (json.status) {
                                    Alert.alert("Success", "New verification code sent to your email!");
                                } else {
                                    Alert.alert("Error", json.message);
                                }
                            } catch (err) {
                                Alert.alert("Error", "Something went wrong while resending code.");
                            }
                        }}
                    >
                        <Text style={styles.resendText}>
                            Didn’t get the code? Resend
                        </Text>
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
