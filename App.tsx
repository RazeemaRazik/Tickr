import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import VerificationCodeScreen from "./src/screens/VerificationCodeScreen";
import AddTaskScreen from "./src/screens/AddTaskScreen";
import ViewTaskScreen from "./src/screens/ViewTaskScreen";
import EditTaskScreen from "./src/screens/EditTaskScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

// Define navigation param types
export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  ForgotPassword: undefined;
  VerificationCode: undefined;
  ResetPassword: undefined;
  AddTask: undefined;
  EditTask: { title : string, dueDate: string, description: string, status: string  };
  ViewTask: { title : string, dueDate: string, description: string, status: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }} // Hide headers for clean UI
      >
        <Stack.Screen name="Splash" component={SplashScreen}/>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} />
        <Stack.Screen name="ViewTask" component={ViewTaskScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

