import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AditionalIcon from "./adtionalIcons";

const IconScale = ({
  iconScale,
  title,
  selectedValue,
  onSelect,
}: {
  iconScale: { name: string; value: number }[];
  title: string;
  selectedValue: number;
  onSelect: (value: number) => void;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <View>
      <Text
        style={{
          color: current.text,
          fontSize: 18,
          fontWeight: "bold",
          marginVertical: 20,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <View className="flex-row justify-between w-[300px]">
        {iconScale.map((icon) => (
          <TouchableOpacity
            key={icon.value}
            style={{
              borderRadius: 10,
              height: 60,
              width: 60,
              backgroundColor:
                icon.value === selectedValue
                  ? current.basic
                  : current.background,
              borderColor: current.basic,
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => onSelect(icon.value)}
          >
            {icon.name == "leafs" ||
            icon.name == "small-tree" ||
            icon.name == "big-tree" ? (
              <AditionalIcon
                size={30}
                iconName={icon.name}
                color={
                  icon.value === selectedValue
                    ? current.background
                    : current.basic
                }
              />
            ) : (
              <FontAwesome5
                key={icon.value}
                name={icon.name}
                size={26}
                color={
                  icon.value === selectedValue
                    ? current.background
                    : current.basic
                }
                style={{ margin: 10 }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default IconScale;
