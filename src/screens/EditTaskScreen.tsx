import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../App";

type EditTaskRouteProp = RouteProp<RootStackParamList, "EditTask">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, "EditTask">;

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "Pending" | "Completed" | "In progress";
}

const EditTaskScreen = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<EditTaskRouteProp>();
    const { task } = route.params as { task: Task };

    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [dueDate, setDueDate] = useState<Date>(task?.dueDate ? new Date(task.dueDate) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [status, setStatus] = useState<Task["status"]>(task?.status || "pending");

    const statusOptions: Task["status"][] = ["Pending", "In progress", "Completed"];

    // Save the edited task
    const handleSave = async () => {
        if (!title || !dueDate) {
            Alert.alert("Error", "Task title and due date cannot be empty");
            return;
        }

        try {
            const storedTasks = await AsyncStorage.getItem("tasks");
            const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

            // Replace the edited task
            const updatedTasks = parsedTasks.map((t) =>
                t.id === task.id
                    ? { ...t, title, description, dueDate: dueDate.toDateString(), status }
                    : t
            );

            await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

            Alert.alert("Success", "Task updated!");
            navigation.goBack();
        } catch (error) {
            console.error("Error updating task:", error);
            Alert.alert("Error", "Failed to update task");
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
                    <Text style={styles.heading}>Edit Task</Text>

                    {/* Task Title */}
                    <TextInput
                        placeholder="Task Title"
                        placeholderTextColor="#fff"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Task Description */}
                    <TextInput
                        placeholder="Task Description"
                        placeholderTextColor="#fff"
                        style={[styles.input, { height: 100 }]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    {/* Due Date */}
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: dueDate ? "#fff" : "#ccc" }}>
                            {dueDate ? dueDate.toDateString() : "Select Due Date"}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dueDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDueDate(selectedDate);
                            }}
                        />
                    )}

                    {/* Status Toggle */}
                    <View style={styles.statusContainer}>
                        {statusOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.statusOption,
                                    status === option && styles.statusSelected,
                                ]}
                                onPress={() => setStatus(option)}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        status === option && { color: "#2d1406", fontWeight: "bold" },
                                    ]}
                                >
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: "#80521c" }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2d1406",
        padding: 20,
    },
    inner: {
        flex: 1,
        justifyContent: "center",
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
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    statusOption: {
        flex: 1,
        backgroundColor: "#80521c",
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: "center",
    },
    statusSelected: {
        backgroundColor: "#bd802e",
    },
    statusText: {
        color: "#fff",
        fontWeight: "normal",
    },
    saveButton: {
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
