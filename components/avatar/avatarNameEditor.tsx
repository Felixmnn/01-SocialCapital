import { theme } from "@/constants/theme";
import { Avatar } from "@/constants/typesRelationship";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
  showTextWhenNotEditing = false,
}: {
  you: { name: string; avatar: Avatar };
  setYou: (you: { name: string; avatar: Avatar }) => void;
  editAvatar: boolean;
  setEditAvatar: (editAvatar: boolean) => void;
  avatar: Avatar;
  setAvatar: (avatar: Avatar) => void;
  text: string;
  setText: (text: string) => void;
  showTextWhenNotEditing?: boolean;
}) => {
  const [isEditingName, setIsEditingName] = React.useState(
    !showTextWhenNotEditing,
  );

  React.useEffect(() => {
    if (!showTextWhenNotEditing) {
      setIsEditingName(true);
    }
  }, [showTextWhenNotEditing]);

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
      {showTextWhenNotEditing && !isEditingName ? (
        <TouchableOpacity onPress={() => setIsEditingName(true)}>
          <Text
            style={{
              color: current.text,
              fontSize: 20,
              fontWeight: "700",
              textAlign: "center",
              minWidth: 200,
              marginTop: 8,
            }}
          >
            {text || "Name eingeben"}
          </Text>
        </TouchableOpacity>
      ) : (
        <CustomTextInput
          value={text}
          onChangeText={setText}
          autoFocus={showTextWhenNotEditing}
          onBlur={() => {
            if (showTextWhenNotEditing) {
              setIsEditingName(false);
            }
          }}
        />
      )}
      {editAvatar && <AvatarEditor avatar={avatar} setAvatar={setAvatar} />}
    </View>
  );
};

export default AvatarNameEditor;
