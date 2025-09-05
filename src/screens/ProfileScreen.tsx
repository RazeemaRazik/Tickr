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
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

const ProfileScreen = () => {
  const navigator = useNavigation<NavigationProps>();

  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

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

  const handleSaveChanges = () => {
    if (!fullName || !email) {
      Alert.alert("Error", "Full Name and Email are required.");
      return;
    }
    if (password && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    Alert.alert("Success", "Profile updated!");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => navigator.replace("SignIn") },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2d1406" }}>
      <StatusBar barStyle="light-content"
                backgroundColor="#2d1406"
                translucent={true}/>
      <KeyboardAvoidingView
        style={styles.container}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={imageUri ? { uri: imageUri } : require("../../assets/default-avatar.png")}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.imageAction}
              onPress={imageUri ? handleRemoveImage : handlePickImage}
            >
              <Ionicons
                name={imageUri ? "trash-outline" : "pencil-outline"}
                size={24}
                color="#bd802e"
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
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#fff"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#fff"
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#fff"
              style={styles.passwordInput}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
  imageContainer: {
    position: "relative",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#80521c",
  },
  imageAction: {
    position: "absolute",
    right: -5,
    bottom: -5,
    backgroundColor: "#2d1406",
    borderRadius: 20,
    padding: 5,
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
  saveButton: {
    backgroundColor: "#bd802e",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "#80521c",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
