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
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export default function SignUpScreen() {
    const navigator = useNavigation<NavigationProps>();

    const [getName, setName] = useState("");
    const [getEmail, setEmail] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getConfirmPassword, setConfirmPassword] = useState("");
    const [getImageUri, setImageUri] = useState<string | null>(null);

    const [getShowPassword, setShowPassword] = useState(false);
    const [getShowConfirmPassword, setShowConfirmPassword] = useState(false);

    const pickImage = async () => {
  console.log("Picking Image...");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ fix
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setImageUri(uri);
    console.log("Image URI:", uri); // ✅ log the actual selected image
  }
};


    const handleRemoveImage = () => {
        setImageUri(null);
    };

    

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
                        {/* Profile Image with Floating Icon */}
                        <View style={styles.imageWrapper}>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {getImageUri ? (
                                    <Image source={{ uri: getImageUri }} style={styles.profileImage} />
                                ) : (
                                    <Ionicons name="person-circle-outline" size={150} color="#bd802e" />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.floatingIcon}
                                onPress={getImageUri ? handleRemoveImage : pickImage}
                            >
                                <Ionicons
                                    name={getImageUri ? "close-circle" : "pencil"}
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
                            value={getName}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#fff"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={getEmail}
                            onChangeText={setEmail}
                        />

                        {/* Password Input */}
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

                        {/* Confirm Password Input */}
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="#fff"
                                style={styles.passwordInput}
                                secureTextEntry={!getShowConfirmPassword}
                                value={getConfirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!getShowConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={getShowConfirmPassword ? "eye-off" : "eye"}
                                    size={22}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity style={styles.button} onPress={async() => {
                                    
                                    let formData = new FormData();
                                    formData.append('name', getName);
                                    formData.append('email', getEmail);
                                    formData.append('password', getPassword);
                                    formData.append('confirmPassword', getConfirmPassword);

                                    if (getImageUri) {
                                        formData.append('profileImage', {
                                            uri: getImageUri,
                                            name: 'profile.jpg',
                                            type: 'image/jpeg',
                                        } as any);
                                    }

                                    const response = await fetch('https://2779e16733c2.ngrok-free.app/Tickr/SignUp', {
                                        method: 'POST',
                                        body: formData,
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        }
                                    });

                                    if (response.ok) {
                                        const json = await response.json();
                                        if (json.status) {
                                            Dialog.show({
                                                type: ALERT_TYPE.SUCCESS,
                                                title: 'Success',
                                                textBody: json.message,
                                                button: 'close',
                                                onHide: () => {
                                                    navigator.navigate("SignIn");
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
                                            textBody: 'Failed to create account',
                                            button: 'close',
                                        });
                                    }
                                }}>
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
        </AlertNotificationRoot>

    );
};

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
