import React from "react";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { AuthProvider } from "@/contexts/AuthContext";
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import CustomDrawer from "./components/CustomDrawer";


export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Drawer
        screenOptions={{
          headerShown: true, // ✅ Show header
          headerTintColor: "white",// ✅ Remove "(tabs)" text
          headerTransparent: true, // ✅ Make it clear
          headerStyle: {
            backgroundColor: "transparent", // ✅ Ensure transparency
            elevation: 0, // Remove shadow (Android)
            shadowOpacity: 0, // Remove shadow (iOS)
            
          },
          title: "", 
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Stack screenOptions={{ headerShown: false ,  title: "",  }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false,    title: "",   }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false,  title: "",  }} />
          <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        </Stack>
      </Drawer>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
