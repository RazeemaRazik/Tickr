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
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from "react-native-alert-notification";

type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "ForgotPassword"
>;

const ForgotPasswordScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const [getEmail, setEmail] = useState("");


    return (
        <AlertNotificationRoot>
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
                        value={getEmail}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity style={styles.button} onPress={async() => {
                                    
                                    let formData = new FormData();
                                    formData.append('email', getEmail);

                                    const response = await fetch('https://2779e16733c2.ngrok-free.app/Tickr/ForgotPassword', {
                                        method: 'POST',
                                        body: formData,
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        }
                                    });

                                    if (response.ok) {
                                        const json = await response.json();
                                        if (json.status) {
                                            console.log(json.message);
                                            Dialog.show({
                                                type: ALERT_TYPE.SUCCESS,
                                                title: 'Success',
                                                textBody: json.message,
                                                button: 'close',
                                            });
                                            navigator.navigate("VerificationCode", { email: getEmail });
                                        } else {
                                            Dialog.show({
                                            type: ALERT_TYPE.DANGER,
                                            title: 'ERROR',
                                            textBody: json.message,
                                            button: 'close',
                                        });
                                        }
                                    } else {
                                        Dialog.show({
                                            type: ALERT_TYPE.DANGER,
                                            title: 'ERROR',
                                            textBody: 'Failed to create account',
                                            button: 'close',
                                        });
                                    }
                                }}>
                        <Text style={styles.buttonText}>Send Code</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
        </AlertNotificationRoot>
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
