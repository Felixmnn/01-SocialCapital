import React from "react";
import { Text, View } from "react-native";

const SettingsOption = ({
  iconName,
  title,
  onPress,
}: {
  iconName: string;
  title: string;
  onPress: () => void;
}) => {
  return (
    <View>
      <Text>settingsOption</Text>
    </View>
  );
};

export default SettingsOption;
