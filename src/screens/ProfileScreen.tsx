import React, { useEffect, useState } from "react";
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
import { Dialog, ALERT_TYPE, Toast } from "react-native-alert-notification";
import { RefreshControl } from "react-native-gesture-handler";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

const ProfileScreen = () => {
  const navigator = useNavigation<NavigationProps>();

  const [getName, setName] = useState("");
  const [getEmail, setEmail] = useState("");
  const [getPhone, setPhone] = useState("");
  const [getImageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("https://2779e16733c2.ngrok-free.app/Tickr/LoadProfileData", {
          method: "GET",
          credentials: "include" // important for session cookies
        });
        const data = await response.json();
        if (data.status) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setImageUri(data.profilePic || null);
          console.log("Profile data loaded:", data);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (err) {
        Alert.alert("Error", "Unable to load profile");
      }
    };

    loadProfile();
  }, []);


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



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2d1406" }}>
      <StatusBar barStyle="light-content"
        backgroundColor="#2d1406"
        translucent={true} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={getImageUri ? { uri: getImageUri } : require("../../assets/default-avatar.png")}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.imageAction}
              onPress={getImageUri ? handleRemoveImage : handlePickImage}
            >
              <Ionicons
                name={getImageUri ? "trash-outline" : "pencil-outline"}
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
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#fff"
            style={styles.input}
            keyboardType="phone-pad"
            value={getPhone}
            onChangeText={setPhone}
          />

          {/* Save Changes Button */}
          <TouchableOpacity style={styles.saveButton} onPress={async () => {

            let formData = new FormData();
            formData.append('name', getName);
            formData.append('email', getEmail);
            formData.append('phone', getPhone);

            if (getImageUri) {
              formData.append('profileImage', {
                uri: getImageUri,
                name: 'profile.jpg',
                type: 'image/jpeg',
              } as any);
            }

            const response = await fetch('https://2779e16733c2.ngrok-free.app/Tickr/UpdateProfile', {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            });

            if (response.ok) {
              const json = await response.json();
              if (json.status) {
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Success',
                  textBody: json.message,
                  onHide: () => { navigator.replace("Profile"); }
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
                textBody: 'Failed to update account',
                button: 'close',
              });
            }
          }}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={async () => {
            try {
              console.log("Logging out...");
              const response = await fetch("https://2779e16733c2.ngrok-free.app/Tickr/LogOut", {
                method: "GET",
                credentials: 'include',
              });

              if (response.ok) {
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Success',
                  textBody: "Logged out successfully",
                  autoClose: 1000

                });
                navigator.replace("SignIn");
              } else {
                Dialog.show({
                  type: ALERT_TYPE.DANGER,
                  title: 'ERROR',
                  textBody: 'logout failed',
                  button: 'close',
                });
              }
            } catch (error) {
              console.error("Error:", error);
            }
          }}
          >
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
