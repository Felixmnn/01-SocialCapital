import { theme } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { TextInput } from "react-native";

const CustomTextInput = ({
  value,
  onChangeText,
  onBlur,
  autoFocus = false,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      autoFocus={autoFocus}
      style={{
        backgroundColor: current.background,
        color: current.text,
        borderRadius: 15,
        borderColor: current.basic,
        borderWidth: 2,
        padding: 10,
        width: 200,
        textAlign: "center",
      }}
    />
  );
};

export default CustomTextInput;
