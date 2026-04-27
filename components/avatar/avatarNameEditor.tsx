import { theme } from "@/constants/theme";
import { Avatar } from "@/constants/typesRelationship";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import CustomTextInput from "../customTextInput";
import RenderAvatar from "./avatar";
import AvatarEditor from "./avatarEditor";

const AvatarNameEditor = ({
  you,
  setYou,
  editAvatar,
  setEditAvatar,
  avatar,
  setAvatar,
  text,
  setText,
}: {
  you: { name: string; avatar: Avatar };
  setYou: (you: { name: string; avatar: Avatar }) => void;
  editAvatar: boolean;
  setEditAvatar: (editAvatar: boolean) => void;
  avatar: Avatar;
  setAvatar: (avatar: Avatar) => void;
  text: string;
  setText: (text: string) => void;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <View className="items-center justify-center">
      <View className="items-center justify-center relative">
        <RenderAvatar avatar={you.avatar} selected={false} />
        <TouchableOpacity
          className="absolute top-0 right-0"
          style={{
            backgroundColor: current.basic,
            borderRadius: 20,
            padding: 6,
          }}
          onPress={() => setEditAvatar(!editAvatar)}
        >
          <FontAwesome5
            name="pencil-alt"
            size={20}
            color={current.background}
          />
        </TouchableOpacity>
      </View>
      <CustomTextInput value={text} onChangeText={setText} />
      {editAvatar && <AvatarEditor avatar={avatar} setAvatar={setAvatar} />}
    </View>
  );
};

export default AvatarNameEditor;
