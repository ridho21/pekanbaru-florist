import React, { useContext } from "react";
import { initializeApp, getApps } from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { firebaseConfig } from "../firebase/Config"

import { useTheme, themeColor } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
//Screens
import Home from "../screens/Home";
import Details from "../screens/Details";
import Orders from "../screens/Orders";
import About from "../screens/About";
import Profile from "../screens/Profile";
import Booking from "../screens/Booking";
import Loading from "../screens/utils/Loading";
// Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import { AuthContext } from "../provider/AuthProvider";
//Admin Screen
import AddCar from "../screens/admin/AddCar";
import ViewCar from "../screens/admin/ViewCar";
import Transactions from "../screens/admin/Transactions";


// Better put your these secret keys in .env file
// const firebaseConfig = {
//   apiKey: "AIzaSyDsUeWrXemUoRkPEFcdvCBvrvrQXgCXS1U",
//   authDomain: "https://car-rental-39b9e.firebaseapp.com/__/auth/action?mode=action&oobCode=code",
//   databaseURL: "https://car-rental-39b9e-default-rtdb.asia-southeast1.firebasedatabase.app/",
//   projectId: "car-rental-39b9e",
//   storageBucket: "car-rental-39b9e.appspot.com",
//   messagingSenderId: "163939117791",
//   appId: "1:163939117791:android:f94dc42ce6e5b62962176a",
// };

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

const AdminStack = createNativeStackNavigator();
const AdminScreen = () => {
  return (
    <AdminStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AdminStack.Screen name="Admin Home" component={AdminTabs} />
      {/* <AdminStack.Screen name="Details" component={Details} /> */}
    </AdminStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="Details" component={Details} />
      <MainStack.Screen name="Booking" component={Booking} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"home-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Orders" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"car-outline"}/>
          ),
        }}
      />
      <Tabs.Screen
        name="About"
        component={About}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="About" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"alert-circle-outline"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

const adminTabs = createBottomTabNavigator();
const AdminTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <adminTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}
      <adminTabs.Screen
        name="AddCar"
        component={AddCar}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"home-outline"} />
          ),
        }}
      />
      <adminTabs.Screen
        name="View Car"
        component={ViewCar}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="View Car" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"car-outline"} />
          ),
        }}
      />
      <adminTabs.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Transactions" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"receipt-outline"} />
          ),
        }}
      />
    </adminTabs.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  const admin = auth.admin;
  console.log(auth);
  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user == true && <Main />}
      {admin == true && <AdminScreen />}
    </NavigationContainer>
  );
};
