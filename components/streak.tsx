import { theme } from "@/constants/theme";
import { WeekEntry } from "@/constants/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";

/** 
 * Test data:
 * const mockWeekPerfect: WeekEntry[] = [
    { date: "2026-04-20T08:00:00Z", completed: false },
    { date: "2026-04-21T08:00:00Z", completed: true },
    { date: "2026-04-22T08:00:00Z", completed: false },
    { date: "2026-04-23T08:00:00Z", completed: false },
    { date: "2026-04-24T08:00:00Z", completed: false },
    { date: "2026-04-25T08:00:00Z", completed: false },
    { date: "2026-04-26T08:00:00Z", completed: false },
  ];
  <Streak weekEntrys={mockWeekPerfect} duration={0} />
 */
const Streak = ({
  weekEntrys,
  duration,
}: {
  weekEntrys: WeekEntry[];
  duration: number;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  const dayLabels = ["S", "M", "D", "M", "D", "F", "S"];
  const today = new Date().getDay();

  const getDayOfMonth = (dateString: string | undefined, index: number) => {
    if (!dateString) {
      const currentDate = new Date();
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - today);

      const fallbackDate = new Date(weekStart);
      fallbackDate.setDate(weekStart.getDate() + index);
      return String(fallbackDate.getDate());
    }

    const datePart = dateString.split("T")[0];
    const parts = datePart.split("-");

    if (parts.length === 3) {
      const day = Number(parts[2]);
      return Number.isNaN(day) ? "" : String(day);
    }

    const parsedDate = new Date(dateString);
    return Number.isNaN(parsedDate.getTime())
      ? ""
      : String(parsedDate.getDate());
  };

  function leftOneIsTrue(index: number, weekEntrys: WeekEntry[]) {
    if (index === 0) return false;
    return weekEntrys[index - 1]?.completed === true;
  }
  function rightOneIsTrue(index: number, weekEntrys: WeekEntry[]) {
    if (index === weekEntrys.length - 1) return false;
    return weekEntrys[index + 1]?.completed === true;
  }

  return (
    <LinearGradient
      colors={[current.purpleGradient[0], current.purpleGradient[1]]}
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: 16,
        borderRadius: 12,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="items-center justify-center w-[60px]">
        <FontAwesome5 name="fire" size={40} color="white" />
        <Text className="text-white text-center font-bold text-l">
          {duration + " Days"}
        </Text>
      </View>
      <View className="flex-row flex-1 justify-between items-center">
        {dayLabels.map((label, index) => (
          <View
            key={index}
            className={`flex-1 items-center justify-center ${
              index == 0 ? "pl-2 " : ""
            } ${index == 6 ? "pr-2 " : ""}`}
          >
            <Text className="text-white">{label}</Text>
            <View className="relative w-full h-8 items-center justify-center">
              {/* Background bar for streaks */}
              <View
                className={`absolute h-full w-full ${
                  weekEntrys[index]?.completed ? "bg-gray-300/50" : "1"
                } 
                ${!leftOneIsTrue(index, weekEntrys) && !rightOneIsTrue(index, weekEntrys) ? "w-8" : ""}
                ${leftOneIsTrue(index, weekEntrys) ? "" : "rounded-l-full"} ${
                  rightOneIsTrue(index, weekEntrys) ? "" : "rounded-r-full"
                }`}
              />
              {/* Circle on top */}
              <View
                className={`w-8 h-8 rounded-full items-center justify-center z-10 
                    ${index == today ? "bg-white" : ""}
                    ${
                      weekEntrys[index]?.completed
                        ? index === today
                          ? "bg-white"
                          : "bg-gray-200/50"
                        : "bg-gray-500/50"
                    }`}
              >
                <Text className="text-gray-300 font-bold">
                  {weekEntrys[index]?.completed
                    ? "✔"
                    : getDayOfMonth(weekEntrys[index]?.date, index)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

export default Streak;
