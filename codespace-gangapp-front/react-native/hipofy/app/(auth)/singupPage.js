import { StyleSheet, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import SignUp from "../../components/Signup/Signup";

export default function SingupPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Página de registro",
          headerStyle: { backgroundColor: "#22C990" },
          headerTitleStyle: { color: "#FFF", fontSize: 20 },
        }}
      />
      <SignUp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#22C990",
  },
});
