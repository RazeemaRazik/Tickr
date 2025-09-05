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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "ResetPassword"
>;

const ResetPasswordScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleReset = () => {
        if (!password || !confirmPassword) {
            Alert.alert("Error", "Please fill in both fields");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        Alert.alert("Success", "Password reset successfully!");
        navigator.replace("SignIn");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#2d1406" }}>
            <StatusBar barStyle="light-content" backgroundColor="#2d1406" translucent />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>Enter your new password</Text>

                    {/* Password */}
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor="#fff"
                            style={styles.passwordInput}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={22}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="#fff"
                            style={styles.passwordInput}
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={22}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleReset}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;

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
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#80521c",
        borderRadius: 10,
        marginBottom: 16,
        paddingRight: 10,
    },
    passwordInput: {
        flex: 1,
        color: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    eyeIcon: { padding: 5 },
    button: {
        backgroundColor: "#bd802e",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
