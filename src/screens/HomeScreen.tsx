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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

interface Task {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
}

const HomeScreen = () => {
    const navigator = useNavigation<NavigationProps>();
    const [getTasks, setTasks] = useState<Task[]>([]);
    const [getGreeting, setGreeting] = useState("");
    const [getUserName, setUserName] = useState("");
    const [getUserImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        (async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUserName(parsed.name);
                setUserImage(parsed.image);
            }
        })();

    }, []);

    const toggleTaskCompletion = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const renderTask = ({ item }: { item: Task }) => (
        <View style={styles.taskCard}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
                <Ionicons
                    name={item.completed ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color="#bd802e"
                />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                    style={[
                        styles.taskTitle,
                        item.completed && { textDecorationLine: "line-through", color: "#aaa" },
                    ]}
                >
                    {item.title}
                </Text>
                <Text style={styles.taskDate}>Due: {item.dueDate}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2d1406" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigator.navigate("Profile")}>
                    {getUserImage ? (
                        <Image
                            source={{ uri: `https://2779e16733c2.ngrok-free.app/Tickr/profile_image/${getUserImage}` }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color="#bd802e" />
                    )}
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tickr</Text>
                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem("user"); // logout
                    navigator.replace("SignIn");
                }}>
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>
            </View>


            {/* Greeting */}
            <Text style={styles.greeting}>{getGreeting}, {getUserName || "User"} 👋</Text>

            {/* Task List */}
            <Text style={styles.sectionTitle}>My Tasks</Text>
            {getTasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={80} color="#80521c" />
                    <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
                </View>
            ) : (
                <FlatList
                    data={getTasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTask}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigator.navigate("AddTask")}
            >
                <Ionicons name="add-outline" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2d1406",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 1 : 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#bd802e",
    },
    greeting: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#bd802e",
        marginBottom: 10,
    },
    taskCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#80521c",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    taskTitle: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    taskDate: {
        fontSize: 12,
        color: "#ccc",
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#bd802e",
        borderRadius: 50,
        padding: 18,
        elevation: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
    },
    emptyText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 10,
    },
});
