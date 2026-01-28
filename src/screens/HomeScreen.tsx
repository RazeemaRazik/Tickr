import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast, ALERT_TYPE, Dialog } from "react-native-alert-notification";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
}

const HomeScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const isFocused = useIsFocused();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState<string | null>(null);

    // Greeting
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    // Load tasks from AsyncStorage
    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem("tasks");
            const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
            setTasks(parsedTasks);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [isFocused]);

    // Load profile data
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch(
                    "https://2779e16733c2.ngrok-free.app/Tickr/LoadProfileData",
                    { method: "GET", credentials: "include" }
                );
                const data = await response.json();
                if (data.status) {
                    setUserName(data.name || "");
                    setUserImage(data.profilePic || "");
                } else {
                    Alert.alert("Error", data.message);
                }
            } catch (err) {
                Alert.alert("Error", "Unable to load profile");
            }
        };
        loadProfile();
    }, []);

    // Toggle task status
    const toggleTaskStatus = async (id: string) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                let newStatus: Task["status"];
                switch (task.status) {
                    case "Pending":
                        newStatus = "In Progress";
                        break;
                    case "In Progress":
                        newStatus = "Completed";
                        break;
                    case "Completed":
                        newStatus = "Pending";
                        break;
                    default:
                        newStatus = "Pending";
                }
                return { ...task, status: newStatus };
            }
            return task;
        });

        setTasks(updatedTasks);
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };

    // Delete task
    const deleteTask = async (id: string) => {
        const filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks);
        await AsyncStorage.setItem("tasks", JSON.stringify(filteredTasks));
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Deleted",
            textBody: "Task deleted successfully",
            autoClose: 1000,
        });
    };

    // Edit task
    const editTask = (task: Task) => {
        navigator.navigate("EditTask", { task });
    };

    // Dynamic background color based on status
    const getBackgroundColor = (status: Task["status"]) => {
        switch (status) {
            case "Pending":
                return "#8B0000"; // Dark Red
            case "In Progress":
                return "#80521c"; // Brown
            case "Completed":
                return "#2e8b57"; // Green
            default:
                return "#80521c";
        }
    };

    const renderTask = ({ item }: { item: Task }) => (
        <View style={[styles.taskCard, { backgroundColor: getBackgroundColor(item.status) }]}>
            <TouchableOpacity onPress={() => toggleTaskStatus(item.id)}>
                <Ionicons
                    name={item.status === "Completed" ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color="#fff"
                />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                    style={[
                        styles.taskTitle,
                        item.status === "Completed" && { textDecorationLine: "line-through", color: "#aaa" },
                    ]}
                >
                    {item.title}
                </Text>
                <Text style={styles.taskDate}>Due: {item.dueDate}</Text>
                {item.description ? <Text style={styles.taskDesc}>{item.description}</Text> : null}
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity onPress={() => editTask(item)}>
                    <Ionicons name="create-outline" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2d1406" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigator.navigate("Profile")}>
                    {userImage ? (
                        <Image source={{ uri: userImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color="#bd802e" />
                    )}
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tickr</Text>
                <TouchableOpacity
                    onPress={async () => {
                        try {
                            const response = await fetch(
                                "https://2779e16733c2.ngrok-free.app/Tickr/LogOut",
                                { method: "GET", credentials: "include" }
                            );
                            if (response.ok) {
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Success",
                                    textBody: "Logged out successfully",
                                    autoClose: 1000,
                                });
                                navigator.replace("SignIn");
                            } else {
                                Dialog.show({
                                    type: ALERT_TYPE.DANGER,
                                    title: "ERROR",
                                    textBody: "Logout failed",
                                    button: "close",
                                });
                            }
                        } catch (error) {
                            console.error("Error:", error);
                        }
                    }}
                >
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Greeting */}
            <Text style={styles.greeting}>{greeting}, {userName || "User"} 👋</Text>

            {/* Task List */}
            <Text style={styles.sectionTitle}>My Tasks</Text>
            {tasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={80} color="#80521c" />
                    <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTask}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.fab} onPress={() => navigator.navigate("AddTask")}>
                <Ionicons name="add-outline" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#2d1406", padding: 20 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 1 : 1,
    },
    headerTitle: { fontSize: 22, fontWeight: "bold", color: "#bd802e" },
    greeting: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#bd802e", marginBottom: 10 },
    taskCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    taskTitle: { fontSize: 16, color: "#fff", fontWeight: "bold" },
    taskDate: { fontSize: 12, color: "#ccc" },
    taskDesc: { fontSize: 12, color: "#fff" },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#bd802e",
        borderRadius: 50,
        padding: 18,
        elevation: 5,
    },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 100 },
    emptyText: { color: "#fff", fontSize: 16, marginTop: 10 },
});
