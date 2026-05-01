import Selectable from "@/components/selectable";
import { Action } from "@/constants/constants";
import { theme } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";

interface ActionListProps {
  title: string;
  actions: Action[];
  onPress: (action: Action) => void;
}

const ActionList: React.FC<ActionListProps> = ({ title, actions, onPress }) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <View>
      <Text
        className="text-lg mt-4 font-bold text-white"
        style={{
          color: current.text,
        }}
      >
        {title}
      </Text>
      <View className="flex-row flex-wrap">
        {actions.map((action, index) => (
          <Selectable
            key={index}
            iconName="check"
            onPress={() => onPress(action)}
            title={action.actionId}
            gradientType={action.startwert > 0 ? "positive" : "negative"}
          />
        ))}
      </View>
    </View>
  );
};

export default ActionList;
