import { Relationship } from "@/constants/typesRelationship";

export function calculateYourPoints(relationships: Relationship[]): number {
  return relationships.reduce((total, relationship) => {
    return total + relationship.points.yourPoints;
  }, 0);
}

export function calculateTheirPoints(relationships: Relationship[]): number {
  return relationships.reduce((total, relationship) => {
    return total + relationship.points.theirPoints;
  }, 0);
}

export function calculateAverageTrust(relationships: Relationship[]): number {
  if (relationships.length === 0) return 0;
  const totalTrust = relationships.reduce((total, relationship) => {
    return total + relationship.ink.your.trust;
  }, 0);
  return totalTrust / relationships.length;
}

export function calculateAverageAttention(
  relationships: Relationship[],
): number {
  if (relationships.length === 0) return 0;
  const totalAttention = relationships.reduce((total, relationship) => {
    return total + relationship.ink.your.attention;
  }, 0);
  return totalAttention / relationships.length;
}

export function calculateAverageSupport(relationships: Relationship[]): number {
  if (relationships.length === 0) return 0;
  const totalSupport = relationships.reduce((total, relationship) => {
    return total + relationship.ink.your.support;
  }, 0);
  return totalSupport / relationships.length;
}

export function calculateBalance(
  yourPoints: number,
  theirPoints: number,
): "positive" | "critical" | "balanced" {
  const ratio = yourPoints / (theirPoints || 1); // Avoid division by zero
  if (ratio > 1.2) return "positive";
  if (ratio < 0.8) return "critical";
  return "balanced";
}
