import { Tabs } from "expo-router";
import {
  Home as HomeIcon,
  User,
  ShoppingCart,
  Heart,
  Plus,
} from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          left: 20,
          right: 20,
          backgroundColor: "#fff",
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          height: 60,
          borderTopWidth: 0, // Removes default border
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                position: "absolute",
                bottom: 15,
                backgroundColor: "#000",
                padding: 15,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Plus size={size} color={"#fff"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
