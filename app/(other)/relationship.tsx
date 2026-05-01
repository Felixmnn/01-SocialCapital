import AvatarNameEditor from "@/components/avatar/avatarNameEditor";
import AvatarWithStats from "@/components/avatar/avatarWithStats";
import InkBadeCollection from "@/components/badges/inkBadeCollection";
import GradientToBackground from "@/components/gradientToBackground";
import { theme } from "@/constants/theme";
import { useGlobalContext } from "@/context/GlobalProvider";
import { returnScaleIcon } from "@/functions/general";
import { calculateBalance } from "@/functions/relationshipStats";
import { FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

const Relationship = () => {
  const { relationships, yourStats, setRelationships } = useGlobalContext();
  const [selectedStatusTarget, setSelectedStatusTarget] = React.useState<
    "you" | "them" | null
  >(null);
  const [isEditOtherOpen, setIsEditOtherOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = React.useState(false);
  const params = useLocalSearchParams<{ relationshipIndex?: string }>();
  const selectedIndex = Number(params.relationshipIndex ?? -1);
  const relationship =
    Number.isInteger(selectedIndex) && selectedIndex >= 0
      ? relationships[selectedIndex]
      : undefined;
  const [draftName, setDraftName] = React.useState("");
  const [draftAvatar, setDraftAvatar] = React.useState(
    relationship?.person.avatar,
  );
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  React.useEffect(() => {
    if (!relationship) return;
    setDraftName(relationship.person.name);
    setDraftAvatar(relationship.person.avatar);
    setIsEditAvatarOpen(false);
  }, [relationship?.person.name, relationship?.person.avatar]);

  if (!relationship) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: current.background,
        }}
      >
        <Text style={{ color: current.text }}>Relationship not found</Text>
      </View>
    );
  }

  const latestActions = [...relationship.actions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  function getStatusFromPerspective(
    ownPoints: number,
    otherPoints: number,
  ): "positive" | "critical" | "balanced" {
    if (ownPoints > otherPoints * 1.2) {
      return "positive";
    }
    if (otherPoints > ownPoints * 1.2) {
      return "critical";
    }
    return "balanced";
  }

  function getStatusMeta(status: "positive" | "critical" | "balanced") {
    return {
      color:
        status === "positive"
          ? "green"
          : status === "critical"
            ? "red"
            : "blue",
      icon:
        status === "positive"
          ? "smile"
          : status === "critical"
            ? "frown"
            : "smile-wink",
      label:
        status === "positive"
          ? "Geber"
          : status === "critical"
            ? "Nehmer"
            : "Balancierer",
    };
  }

  const yourStatus = getStatusFromPerspective(
    relationship.points.yourPoints,
    relationship.points.theirPoints,
  );
  const theirStatus = getStatusFromPerspective(
    relationship.points.theirPoints,
    relationship.points.yourPoints,
  );
  const yourStatusMeta = getStatusMeta(yourStatus);
  const theirStatusMeta = getStatusMeta(theirStatus);

  function getPersonalizedStatusDescription(
    status: "positive" | "critical" | "balanced",
    targetName: string,
    isYou: boolean,
  ) {
    if (isYou) {
      if (status === "positive") {
        return "Du bist in dieser Beziehung aktuell eher ein Geber: Du investierst mehr in die Beziehung, als du zurueckbekommst.";
      }
      if (status === "critical") {
        return "Du bist in dieser Beziehung aktuell eher ein Nehmer: Du bekommst mehr aus der Beziehung, als du selbst einbringst.";
      }
      return "Du bist in dieser Beziehung aktuell ausgeglichen: Geben und Nehmen sind bei dir ungefaehr gleich verteilt.";
    }

    if (status === "positive") {
      return `${targetName} ist in dieser Beziehung aktuell eher ein Geber: Die Person investiert mehr in die Beziehung, als sie zurueckbekommt.`;
    }
    if (status === "critical") {
      return `${targetName} ist in dieser Beziehung aktuell eher ein Nehmer: Die Person bekommt mehr aus der Beziehung, als sie selbst einbringt.`;
    }
    return `${targetName} ist in dieser Beziehung aktuell ausgeglichen: Geben und Nehmen sind bei der Person ungefaehr gleich verteilt.`;
  }

  const modalStatus = selectedStatusTarget === "you" ? yourStatus : theirStatus;
  const modalMeta = getStatusMeta(modalStatus);
  const modalName =
    selectedStatusTarget === "you"
      ? yourStats?.name || "Du"
      : relationship.person.name;
  const modalDescription =
    selectedStatusTarget === "you"
      ? getPersonalizedStatusDescription(yourStatus, modalName, true)
      : getPersonalizedStatusDescription(
          theirStatus,
          relationship.person.name,
          false,
        );

  function saveOtherChanges() {
    if (!relationship || !draftAvatar) return;

    const trimmedName = draftName.trim();
    if (!trimmedName) return;

    setRelationships((prev) =>
      prev.map((item, index) =>
        index === selectedIndex
          ? {
              ...item,
              person: {
                ...item.person,
                name: trimmedName,
                avatar: draftAvatar,
              },
            }
          : item,
      ),
    );
    setIsEditOtherOpen(false);
    setIsEditAvatarOpen(false);
  }

  function deleteRelationship() {
    if (relationships.length <= 1) return;

    setRelationships((prev) =>
      prev.filter((_, index) => index !== selectedIndex),
    );
    setIsDeleteConfirmOpen(false);
    router.back();
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: current.background,
      }}
    >
      <GradientToBackground
        state={calculateBalance(
          relationship.points.yourPoints,
          relationship.points.theirPoints,
        )}
        visibleComponents="arrowBack"
        onPressArrow={() => router.back()}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => setSelectedStatusTarget("you")}
            style={{ marginRight: 16, position: "relative" }}
          >
            {yourStats && (
              <AvatarWithStats
                avatar={yourStats.avatar}
                name={yourStats?.name || "Du"}
                points={Math.floor(relationship.points.yourPoints)}
              />
            )}
            <View
              style={{
                borderRadius: 999,
                backgroundColor: yourStatusMeta.color,
                padding: 4,
                position: "absolute",
                top: 0,
                right: 8,
              }}
            >
              <FontAwesome5
                name={yourStatusMeta.icon}
                size={20}
                color="white"
                solid
              />
            </View>
          </Pressable>
          <FontAwesome5
            name={returnScaleIcon(
              relationship.points.yourPoints,
              relationship.points.theirPoints,
            )}
            size={24}
            color={current.text}
            style={{ marginRight: 8 }}
          />
          <Pressable
            onPress={() => setSelectedStatusTarget("them")}
            style={{ position: "relative" }}
          >
            <AvatarWithStats
              avatar={relationship.person.avatar}
              name={relationship.person.name}
              points={Math.floor(relationship.points.theirPoints)}
            />
            <View
              style={{
                borderRadius: 999,
                backgroundColor: theirStatusMeta.color,
                padding: 4,
                position: "absolute",
                top: 0,
                right: 8,
              }}
            >
              <FontAwesome5
                name={theirStatusMeta.icon}
                size={20}
                color="white"
                solid
              />
            </View>
          </Pressable>
        </View>

        <Modal
          visible={selectedStatusTarget !== null}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setSelectedStatusTarget(null)}
        >
          <Pressable
            onPress={() => setSelectedStatusTarget(null)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: 6,
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
                  backgroundColor: modalMeta.color,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <FontAwesome5
                  name={modalMeta.icon}
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
                }}
              >
                Status von {modalName}: {modalMeta.label}
              </Text>
              <Text
                style={{
                  color: current.text,
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                {modalDescription}
              </Text>
            </Pressable>
          </Pressable>
        </Modal>
      </GradientToBackground>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View className="flex-row w-full justify-center">
          <View>
            <InkBadeCollection
              trust={relationship.ink.your.trust}
              attention={relationship.ink.your.attention}
              support={relationship.ink.your.support}
              recipent="youThem"
              nameOtherPerson={relationship.person.name + " "}
            />
          </View>
          <View style={{ width: 60, marginLeft: 14 }} />
          <View>
            <InkBadeCollection
              trust={relationship.ink.their.trust}
              attention={relationship.ink.their.attention}
              support={relationship.ink.their.support}
              recipent="themYou"
              nameOtherPerson={relationship.person.name + " "}
            />
          </View>
        </View>
        <View
          className="mt-6 p-4 rounded-xl"
          style={{ borderWidth: 1, borderColor: current.basic }}
        >
          <Text
            style={{ color: current.text, fontWeight: "700", marginBottom: 10 }}
          >
            Letzte Aktionen
          </Text>
          {latestActions.length === 0 ? (
            <Text style={{ color: current.text }}>
              Noch keine Aktionen vorhanden.
            </Text>
          ) : (
            latestActions.map((entry, index) => {
              const actorLabel =
                entry.actor === "you" ? "Du" : relationship.person.name;
              return (
                <View
                  key={`${entry.actionID}-${entry.date}-${index}`}
                  style={{ marginBottom: 8 }}
                >
                  <Text style={{ color: current.text }}>
                    {actorLabel}: {entry.actionID}
                  </Text>
                  <Text
                    style={{ color: current.text, opacity: 0.7, fontSize: 12 }}
                  >
                    {new Date(entry.date).toLocaleDateString("de-DE")}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View
          className="mt-6 p-4 rounded-xl"
          style={{ borderWidth: 1, borderColor: current.basic }}
        >
          <Text
            style={{ color: current.text, fontWeight: "700", marginBottom: 10 }}
          >
            Relationship verwalten
          </Text>

          <Pressable
            onPress={() => setIsEditOtherOpen(true)}
            style={{
              borderWidth: 1,
              borderColor: current.basic,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 12,
              marginBottom: relationships.length > 1 ? 10 : 0,
            }}
          >
            <Text
              style={{
                color: current.basic,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Other bearbeiten
            </Text>
          </Pressable>

          {relationships.length > 1 && (
            <Pressable
              onPress={() => setIsDeleteConfirmOpen(true)}
              style={{
                borderWidth: 1,
                borderColor: "#dc2626",
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  color: "#dc2626",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Relationship beenden
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isEditOtherOpen}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => {
          setIsEditOtherOpen(false);
          setIsEditAvatarOpen(false);
        }}
      >
        <Pressable
          onPress={() => {
            setIsEditOtherOpen(false);
            setIsEditAvatarOpen(false);
          }}
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
              maxWidth: 360,
              borderRadius: 16,
              padding: 18,
              backgroundColor: current.background,
            }}
          >
            <Text
              style={{
                color: current.text,
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Other bearbeiten
            </Text>

            {draftAvatar && (
              <AvatarNameEditor
                you={{ name: draftName, avatar: draftAvatar }}
                setYou={(value) => {
                  setDraftName(value.name);
                  setDraftAvatar(value.avatar);
                }}
                editAvatar={isEditAvatarOpen}
                setEditAvatar={setIsEditAvatarOpen}
                avatar={draftAvatar}
                setAvatar={setDraftAvatar}
                text={draftName}
                setText={setDraftName}
                showTextWhenNotEditing
              />
            )}

            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Pressable
                onPress={() => {
                  setIsEditOtherOpen(false);
                  setIsEditAvatarOpen(false);
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: current.basic,
                  borderRadius: 10,
                  paddingVertical: 10,
                  marginRight: 6,
                }}
              >
                <Text
                  style={{
                    color: current.basic,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Abbrechen
                </Text>
              </Pressable>
              <Pressable
                onPress={saveOtherChanges}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  paddingVertical: 10,
                  marginLeft: 6,
                  backgroundColor: current.basic,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Speichern
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={isDeleteConfirmOpen}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setIsDeleteConfirmOpen(false)}
      >
        <Pressable
          onPress={() => setIsDeleteConfirmOpen(false)}
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
            }}
          >
            <Text
              style={{
                color: current.text,
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Relationship beenden?
            </Text>
            <Text
              style={{
                color: current.text,
                textAlign: "center",
                opacity: 0.8,
                marginBottom: 14,
                lineHeight: 20,
              }}
            >
              Diese Relationship wird dauerhaft geloescht.
            </Text>

            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => setIsDeleteConfirmOpen(false)}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: current.basic,
                  borderRadius: 10,
                  paddingVertical: 10,
                  marginRight: 6,
                }}
              >
                <Text
                  style={{
                    color: current.basic,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Abbrechen
                </Text>
              </Pressable>
              <Pressable
                onPress={deleteRelationship}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  paddingVertical: 10,
                  marginLeft: 6,
                  backgroundColor: "#dc2626",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Loeschen
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Relationship;
