import React from "react";
import { View } from "react-native";

/**
 * Mock adBanner components
 * Native Google AdMob module removed for emulator screenshot compatibility
 */

export function useRewardedAd(onRewarded: () => void) {
  return {
    loaded: false,
    showAd: () => {
      console.log("AdMob not available in this build");
    },
  };
}

type RewardedAdButtonProps = {
  label?: string;
  loadingLabel?: string;
  onRewarded?: () => void;
};

const RewardedAdButton = ({
  label,
  loadingLabel,
  onRewarded,
}: RewardedAdButtonProps) => {
  return <View />;
};

export default RewardedAdButton;

