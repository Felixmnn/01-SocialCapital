import React from "react";
import {
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from "react-native-google-mobile-ads";

const PROD_UNIT_ID = "ca-app-pub-9834411851111627/4978218870";
const AD_UNIT_ID = __DEV__ ? TestIds.REWARDED : PROD_UNIT_ID;

export function useRewardedAd(onRewarded: () => void) {
  const [loaded, setLoaded] = React.useState(false);
  const adRef = React.useRef<RewardedAd | null>(null);

  const loadAd = React.useCallback(() => {
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
    const unsubClosed = ad.addAdEventListener("closed" as any, () => {
      setLoaded(false);
      loadAd();
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubEarned();
      unsubClosed();
    };
  }, [onRewarded]);

  React.useEffect(() => {
    const unsub = loadAd();
    return unsub;
  }, []);

  const showAd = React.useCallback(() => {
    if (loaded && adRef.current) {
      adRef.current.show();
    }
  }, [loaded]);

  return { loaded, showAd };
}
