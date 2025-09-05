import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    SafeAreaView,
    StatusBar,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "SignUp">;

const SignUpScreen = () => {
    const navigator = useNavigation<NavigationProps>();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission denied", "Please allow access to gallery.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            quality: 1,
        });


        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRemoveImage = () => {
        setImageUri(null);
    };

    const validateAndSignUp = () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert("Error", "Please enter a valid email.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        console.log("Sign Up Data:", { fullName, email, password, imageUri });
        Alert.alert("Success", "Account created!");
        navigator.replace("Home");
    };

    return (
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
                    {/* Profile Image with Floating Icon */}
                    <View style={styles.imageWrapper}>
                        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.profileImage} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={150} color="#bd802e" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.floatingIcon}
                            onPress={imageUri ? handleRemoveImage : handlePickImage}
                        >
                            <Ionicons
                                name={imageUri ? "close-circle" : "pencil"}
                                size={28}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Input Fields */}
                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor="#fff"
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#fff"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password Input */}
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Password"
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

                    {/* Confirm Password Input */}
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

                    {/* Sign Up Button */}
                    <TouchableOpacity style={styles.button} onPress={validateAndSignUp}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <View style={styles.signInContainer}>
                        <Text style={{ color: "#fff" }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigator.navigate("SignIn")}>
                            <Text style={{ color: "#bd802e", fontWeight: "bold" }}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpScreen;

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
    imageWrapper: {
        position: "relative",
        marginBottom: 30,
    },
    imagePicker: {
        alignItems: "center",
        justifyContent: "center",
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    floatingIcon: {
        position: "absolute",
        bottom: 0,
        right: 10,
        backgroundColor: "#80521c",
        borderRadius: 20,
        padding: 4,
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
    button: {
        backgroundColor: "#bd802e",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    signInContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
