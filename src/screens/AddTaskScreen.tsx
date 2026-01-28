import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "AddTask">;

const AddTaskScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const [getTitle, setTitle] = useState("");
    const [getDescription, setDescription] = useState("");
    const [getDueDate, setDueDate] = useState<Date | null>(null);
    const [getShowDatePicker, setShowDatePicker] = useState(false);

    const handleSaveTask = async () => {
        if (!getTitle || !getDueDate) {
            Alert.alert("Error", "Please enter a task title and due date.");
            return;
        }

        try {
            const newTask = {
                id: Date.now().toString(), // unique id
                title: getTitle,
                description: getDescription,
                dueDate: getDueDate.toDateString(),
                status: "pending", // default status
            };

            // get existing tasks
            const storedTasks = await AsyncStorage.getItem("tasks");
            const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];

            // add new task
            parsedTasks.push(newTask);

            // save back
            await AsyncStorage.setItem("tasks", JSON.stringify(parsedTasks));

            Alert.alert("Success", "Task added!");
            navigator.goBack();
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2d1406" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.inner}>
                    <Text style={styles.heading}>Add New Task</Text>

                    {/* Task Title */}
                    <TextInput
                        placeholder="Task Title"
                        placeholderTextColor="#fff"
                        style={styles.input}
                        value={getTitle}
                        onChangeText={setTitle}
                    />

                    {/* Task Description */}
                    <TextInput
                        placeholder="Task Description"
                        placeholderTextColor="#fff"
                        style={[styles.input, { height: 100 }]}
                        value={getDescription}
                        onChangeText={setDescription}
                        multiline
                    />

                    {/* Due Date */}
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: getDueDate ? "#fff" : "#ccc" }}>
                            {getDueDate
                                ? getDueDate.toDateString()
                                : "Select Due Date"}
                        </Text>
                    </TouchableOpacity>

                    {getShowDatePicker && (
                        <DateTimePicker
                            value={getDueDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDueDate(selectedDate);
                            }}
                        />
                    )}

                    {/* Save Button */}
                    <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
                        <Text style={styles.buttonText}>Save Task</Text>
                    </TouchableOpacity>

                    {/* Cancel */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#80521c" }]}
                        onPress={() => navigator.goBack()}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2d1406",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#bd802e",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        backgroundColor: "#80521c",
        color: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#bd802e",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
