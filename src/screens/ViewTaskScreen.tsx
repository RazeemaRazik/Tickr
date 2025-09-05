import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "ViewTask">;
type RouteProps = RouteProp<RootStackParamList, "ViewTask">;

const ViewTaskScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>();

    const { title, description, dueDate, status } = route.params;

    const handleEdit = () => {
        navigator.navigate("EditTask", { title, description, dueDate, status });
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // Optional: pass back a callback or use global state for deletion
                        Alert.alert("Deleted", "Task has been deleted.");
                        navigator.goBack();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2d1406" />
            <View style={styles.inner}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{description}</Text>
                <Text style={styles.due}>Due Date: {dueDate}</Text>
                <View style={[styles.statusBadge,
                    status === "Completed" ? { backgroundColor: "#28a745" } :
                    status === "In Progress" ? { backgroundColor: "#ffc107" } :
                    { backgroundColor: "#bd802e" }
                ]}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ViewTaskScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2d1406",
        padding: 20,
    },
    inner: {
        flex: 1,
        justifyContent: "flex-start",
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#bd802e",
        marginBottom: 10,
    },
    desc: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 10,
    },
    due: {
        fontSize: 14,
        color: "#ccc",
        marginBottom: 10,
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginBottom: 20,
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editButton: {
        flex: 1,
        backgroundColor: "#bd802e",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#80521c",
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
