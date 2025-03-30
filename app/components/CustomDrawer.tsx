import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>

      <View style={styles.menu}>
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate("(tabs)")}
          icon={({ size }) => <Ionicons name="home-outline" size={size} color="white" />}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Favorites"
          onPress={() => props.navigation.navigate("favorites")}
          icon={({ size }) => <Ionicons name="heart-outline" size={size} color="white" />}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Add Item"
          onPress={() => props.navigation.navigate("add-item")}
          icon={({ size }) => <Ionicons name="add-circle-outline" size={size} color="white" />}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Settings"
          onPress={() => props.navigation.navigate("settings")}
          icon={({ size }) => <Ionicons name="settings-outline" size={size} color="white" />}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Logout"
          onPress={() => console.log("Logout pressed")}
          icon={({ size }) => <MaterialIcons name="logout" size={size} color="white" />}
          labelStyle={styles.drawerLabel}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  menu: {
    marginTop: 20,
  },
  drawerLabel: {
    color: "white",
    fontSize: 16,
  },
});
