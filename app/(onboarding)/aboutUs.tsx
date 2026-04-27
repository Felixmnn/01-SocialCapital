import CustomButton from "@/components/customButton";
import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AboutUs = () => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: current.background,
      }}
    >
      <View></View>
      <View className="items-center justify-center ">
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text
          style={{
            color: current.basic,
            fontSize: 24,
            marginTop: -20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Social Capital
        </Text>
        <Text
          style={{
            color: current.text,
            fontSize: 20,
            textAlign: "center",
            fontWeight: "bold",
            width: 200,
          }}
        >
          Because money isn't everything
        </Text>
      </View>
      <CustomButton
        title="Get Started"
        onPress={() => router.push("/(onboarding)/gettingStarted")}
      />
    </SafeAreaView>
  );
};

export default AboutUs;
