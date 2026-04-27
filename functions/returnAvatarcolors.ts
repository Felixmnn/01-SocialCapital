import { Avatar } from "@/constants/typesRelationship";

const SKIN_COLOR_MAP: Record<Avatar["skinColor"], string> = {
  light: "#f8d5c2",
  "medium-light": "#e8beac",
  medium: "#d6a184",
  "medium-dark": "#b37a56",
  dark: "#7a4b2e",
};

const HAIR_COLOR_MAP: Record<Avatar["hairColor"], string> = {
  black: "#1b1b1b",
  brown: "#5a3c2e",
  blonde: "#d9b14a",
  red: "#b64b2c",
  gray: "#8a8a8a",
  white: "#f2f2f2",
};

const BACKGROUND_COLOR_MAP: Record<Avatar["backgroundColor"], string> = {
  blue: "#69a0f9",
  green: "#6bbf8e",
  yellow: "#f2c84b",
  purple: "#8f7ad8",
  orange: "#f29a4b",
};

const SKIN_COLOR_SHADOW_MAP: Record<Avatar["skinColor"], string> = {
  light: "#e0b8a0",
  "medium-light": "#d1a18c",
  medium: "#b97a5e",
  "medium-dark": "#9b5c3a",
  dark: "#6b3a1e",
};

export const getSkinColor = (skinColor: Avatar["skinColor"]): string => {
  return SKIN_COLOR_MAP[skinColor];
};

export const getHairColor = (hairColor: Avatar["hairColor"]): string => {
  return HAIR_COLOR_MAP[hairColor];
};

export const getBeardColor = (beardColor: Avatar["beardColor"]): string => {
  return HAIR_COLOR_MAP[beardColor];
};

export const getBackgroundColor = (
  backgroundColor: Avatar["backgroundColor"],
): string => {
  return BACKGROUND_COLOR_MAP[backgroundColor];
};

export const getSkinColorShadow = (skinColor: Avatar["skinColor"]): string => {
  return SKIN_COLOR_SHADOW_MAP[skinColor];
};
