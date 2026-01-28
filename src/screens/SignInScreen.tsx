import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { ALERT_TYPE, AlertNotificationRoot, Dialog, Toast } from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "SignIn">;

const SignInScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const [getEmail, setEmail] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getShowPassword, setShowPassword] = useState(false);

    return (
        <AlertNotificationRoot>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#2d1406" }}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#2d1406"
                    translucent={true}
                />
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Image source={require("../../assets/logo.png")} style={styles.logo} />
                        </View>

                        {/* Inputs */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#fff"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={getEmail}
                                onChangeText={setEmail}
                            />

                            {/* Password with eye toggle */}
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="#fff"
                                    style={styles.passwordInput}
                                    secureTextEntry={!getShowPassword}
                                    value={getPassword}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!getShowPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={getShowPassword ? "eye-off" : "eye"}
                                        size={22}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot password */}
                        <TouchableOpacity onPress={() => navigator.navigate("ForgotPassword")}>
                            <Text style={styles.forgotText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>


                        {/* Sign In Button */}
                        <TouchableOpacity style={styles.button} onPress={async () => {
                            console.log("Email:", getEmail);
                            console.log("Password:", getPassword);
                            let formData = new FormData();
                            formData.append('email', getEmail);
                            formData.append('password', getPassword);

                            const response = await fetch('https://2779e16733c2.ngrok-free.app/Tickr/SignIn', {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                }
                            });

                            if (response.ok) {
                                const json = await response.json();
                                if (json.status) {

                                    // Save user data in AsyncStorage
                                    await AsyncStorage.setItem("user", JSON.stringify({
                                        name: json.name,
                                        image: json.image
                                    }));

                                    Toast.show({
                                        type: ALERT_TYPE.SUCCESS,
                                        title: 'Success',
                                        textBody: json.message,
                                        onHide: () => {
                                            navigator.reset({
                                                index: 0,
                                                routes: [{ name: "Home" }],
                                            });
                                        }
                                    });
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
                                    textBody: 'Failed to Sign In',
                                    button: 'close',
                                });
                            }
                        }}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <View style={styles.signUpContainer}>
                            <Text style={{ color: "#fff" }}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigator.navigate("SignUp")}>
                                <Text style={{ color: "#bd802e", fontWeight: "bold" }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AlertNotificationRoot>

    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2d1406",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        paddingBottom: 10,
    },
    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 80,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: "contain",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 16,
    },
    input: {
        backgroundColor: "#80521c",
        color: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 16,
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
    eyeIcon: {
        padding: 5,
    },
    forgotText: {
        alignSelf: "flex-end",
        color: "#bd802e",
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#bd802e",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    signUpContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
