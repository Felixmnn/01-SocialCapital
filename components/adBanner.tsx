import { theme } from "@/constants/theme";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import {
    AdEventType,
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from "react-native-google-mobile-ads";

const PROD_UNIT_ID = "ca-app-pub-9834411851111627/4978218870";
const AD_UNIT_ID = __DEV__ ? TestIds.REWARDED : PROD_UNIT_ID;

export function useRewardedAd(onRewarded: () => void) {
  const [loaded, setLoaded] = React.useState(false);
  const adRef = React.useRef<RewardedAd | null>(null);
  const cleanupRef = React.useRef<(() => void) | null>(null);

  const loadAd = React.useCallback(() => {
    cleanupRef.current?.();

    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () =>
      setLoaded(true),
    );
    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => onRewarded(),
    );
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      loadAd();
    });

    ad.load();

    const cleanup = () => {
      unsubLoaded();
      unsubEarned();
      unsubClosed();
    };
    cleanupRef.current = cleanup;

    return cleanup;
  }, [onRewarded]);

  React.useEffect(() => {
    loadAd();

    return () => {
      cleanupRef.current?.();
    };
  }, [loadAd]);

  const showAd = React.useCallback(() => {
    if (loaded && adRef.current) {
      adRef.current.show();
    }
  }, [loaded]);

  return { loaded, showAd };
}

type RewardedAdButtonProps = {
  label?: string;
  loadingLabel?: string;
  onRewarded?: () => void;
};

type AppRelationshipState = "critical" | "balanced" | "veryPositive";

function getAdCountInLastDays(addsWatchedAt: string[], days: number): number {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(now.getDate() - days);

  return addsWatchedAt.reduce((count, value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return count;
    if (date >= windowStart && date <= now) return count + 1;
    return count;
  }, 0);
}

function getRelationshipState(
  adCountInLast7Days: number,
): AppRelationshipState {
  if (adCountInLast7Days > 1) return "veryPositive";
  if (adCountInLast7Days === 1) return "balanced";
  return "critical";
}

function getRelationshipLabel(state: AppRelationshipState): string {
  if (state === "critical") return "Kritisch";
  if (state === "balanced") return "Neutral";
  return "Sehr gut";
}

function getRelationshipIcon(state: AppRelationshipState): string {
  if (state === "critical") return "frown";
  if (state === "balanced") return "meh";
  return "smile";
}

const RewardedAdButton = ({
  label = "App durch Ad unterstützen",
  loadingLabel = "Ad lädt...",
  onRewarded,
}: RewardedAdButtonProps) => {
  const { generalSettings, setGeneralSettings } = useGlobalContext();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const [infoVisible, setInfoVisible] = React.useState(false);

  const adsInLast7Days = React.useMemo(
    () => getAdCountInLastDays(generalSettings.addsWatchedAt, 7),
    [generalSettings.addsWatchedAt],
  );
  const relationshipState = React.useMemo(
    () => getRelationshipState(adsInLast7Days),
    [adsInLast7Days],
  );
  const relationshipLabel = React.useMemo(
    () => getRelationshipLabel(relationshipState),
    [relationshipState],
  );
  const relationshipIcon = React.useMemo(
    () => getRelationshipIcon(relationshipState),
    [relationshipState],
  );

  const { loaded, showAd } = useRewardedAd(
    React.useCallback(() => {
      setGeneralSettings((prev) => ({
        ...prev,
        addsWatchedAt: [...prev.addsWatchedAt, new Date().toISOString()],
      }));
      onRewarded?.();
    }, [onRewarded, setGeneralSettings]),
  );

  return (
    <LinearGradient
      colors={current[relationshipState] as [string, string]}
      style={{
        width: "100%",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => setInfoVisible(true)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.22)",
              marginRight: 8,
            }}
          >
            <FontAwesome5
              name={relationshipIcon as any}
              size={12}
              color="#ffffff"
              solid
            />
          </View>
          <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 12 }}>
            {relationshipLabel}
          </Text>
        </Pressable>
        <Pressable
          onPress={showAd}
          disabled={!loaded}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: loaded
              ? "rgba(255,255,255,0.22)"
              : "rgba(0,0,0,0.18)",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 12 }}>
            {loaded ? label : loadingLabel}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setInfoVisible(false)}
      >
        <Pressable
          onPress={() => setInfoVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 24,
          }}
        >
          <Pressable
            onPress={() => undefined}
            style={{
              width: "100%",
              maxWidth: 340,
              borderRadius: 16,
              padding: 18,
              backgroundColor: current.background,
              alignItems: "center",
            }}
          >
            <View
              style={{
                borderRadius: 999,
                backgroundColor: current[relationshipState][0],
                padding: 10,
                marginBottom: 10,
              }}
            >
              <FontAwesome5
                name={relationshipIcon as any}
                size={22}
                color="white"
                solid
              />
            </View>
            <Text
              style={{
                color: current.text,
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              App-Unterstützung
            </Text>
            <Text
              style={{
                color: current.text,
                lineHeight: 22,
                textAlign: "center",
              }}
            >
              Sieh dir Ads an, um die App zu unterstützen.
            </Text>
            <Pressable
              onPress={() => setInfoVisible(false)}
              style={{
                marginTop: 14,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: current.basic,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Schliessen
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

export default RewardedAdButton;
