import { Action, negativeAction, positiveAction } from "@/constants/constants";
import { Relationship } from "@/constants/typesRelationship";
import {
    calculateNewINKValue,
    calculateNewScoreBasedOnBed,
    calculateNewScoreBasedOnINK,
    calculateNewScoreBasedOnQAN,
} from "@/functions/calculateActionValue";

function isSameDayLocal(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function calculateUpdatedRelationshipsAfterDailyTimers(
  relationships: Relationship[],
): Relationship[] {
  return relationships.map((relationship) => {
    const today = new Date();
    const actionPool: Action[] = [...positiveAction, ...negativeAction];

    let newYourPoints = relationship.points.yourPoints;
    let newTheirPoints = relationship.points.theirPoints;
    let newYourInk = { ...relationship.ink.your };
    let newTheirInk = { ...relationship.ink.their };

    const todayActions = relationship.actions
      .filter((entry) => isSameDayLocal(new Date(entry.date), today))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 1) Erst alle Punkte berechnen.
    todayActions.forEach((entry) => {
      const actionDetails = actionPool.find(
        (a) => a.actionId === entry.actionID,
      );
      if (!actionDetails) return;
      //Bestimmen der neuen Punkte
      if (actionDetails.quantor === "INK") {
        if (entry.actor === "you") {
          newYourPoints = calculateNewScoreBasedOnINK(
            newYourPoints,
            newYourInk[
              actionDetails.ink_kategorie as "trust" | "attention" | "support"
            ],
            actionDetails.startwert,
          );
        } else {
          newTheirPoints = calculateNewScoreBasedOnINK(
            newTheirPoints,
            newTheirInk[
              actionDetails.ink_kategorie as "trust" | "attention" | "support"
            ],
            actionDetails.startwert,
          );
        }
      } else if (actionDetails.quantor === "BED") {
        if (entry.actor === "you") {
          const lastAction = relationship.actions
            .filter(
              (a) =>
                a.actor === entry.actor &&
                a.actionID === entry.actionID &&
                new Date(a.date).getTime() < new Date(entry.date).getTime(),
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )[0];
          const lastDate = lastAction
            ? new Date(lastAction.date)
            : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          newYourPoints = calculateNewScoreBasedOnBed(
            newYourPoints,
            lastDate,
            actionDetails.startwert,
          );
        } else {
          const lastAction = relationship.actions
            .filter(
              (a) =>
                a.actor === entry.actor &&
                a.actionID === entry.actionID &&
                new Date(a.date).getTime() < new Date(entry.date).getTime(),
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )[0];
          const lastDate = lastAction
            ? new Date(lastAction.date)
            : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          newTheirPoints = calculateNewScoreBasedOnBed(
            newTheirPoints,
            lastDate,
            actionDetails.startwert,
          );
        }
      } else if (
        actionDetails.quantor === "QAN" ||
        actionDetails.quantor === "BED/QAN"
      ) {
        if (entry.actor === "you") {
          const thirtyDaysAgo = new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000,
          );
          const last30Days = relationship.actions
            .filter(
              (a) =>
                a.actor === entry.actor &&
                a.actionID === entry.actionID &&
                new Date(a.date) >= thirtyDaysAgo,
            )
            .map((a) => new Date(a.date));
          newYourPoints = calculateNewScoreBasedOnQAN(
            newYourPoints,
            actionDetails.startwert,
            last30Days,
          );
        } else {
          const thirtyDaysAgo = new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000,
          );
          const last30Days = relationship.actions
            .filter(
              (a) =>
                a.actor === entry.actor &&
                a.actionID === entry.actionID &&
                new Date(a.date) >= thirtyDaysAgo,
            )
            .map((a) => new Date(a.date));
          newTheirPoints = calculateNewScoreBasedOnQAN(
            newTheirPoints,
            actionDetails.startwert,
            last30Days,
          );
        }
      } else {
        // quantor === null
        if (entry.actor === "you") {
          newYourPoints += actionDetails.startwert;
        } else {
          newTheirPoints += actionDetails.startwert;
        }
      }
    });

    // 2) Danach alle INK Werte berechnen.
    todayActions.forEach((entry) => {
      const actionDetails = actionPool.find(
        (a) => a.actionId === entry.actionID,
      );
      if (!actionDetails) return;

      if (actionDetails.ink_faktor != null && entry.actor === "you") {
        if (actionDetails.ink_kategorie == "support") {
          newYourInk.support = calculateNewINKValue(
            newYourInk.support,
            actionDetails.ink_faktor,
          );
        } else if (actionDetails.ink_kategorie == "attention") {
          newYourInk.attention = calculateNewINKValue(
            newYourInk.attention,
            actionDetails.ink_faktor,
          );
        } else if (actionDetails.ink_kategorie == "trust") {
          newYourInk.trust = calculateNewINKValue(
            newYourInk.trust,
            actionDetails.ink_faktor,
          );
        }
      } else if (actionDetails.ink_faktor != null && entry.actor === "them") {
        if (actionDetails.ink_kategorie == "support") {
          newTheirInk.support = calculateNewINKValue(
            newTheirInk.support,
            actionDetails.ink_faktor,
          );
        } else if (actionDetails.ink_kategorie == "attention") {
          newTheirInk.attention = calculateNewINKValue(
            newTheirInk.attention,
            actionDetails.ink_faktor,
          );
        } else if (actionDetails.ink_kategorie == "trust") {
          newTheirInk.trust = calculateNewINKValue(
            newTheirInk.trust,
            actionDetails.ink_faktor,
          );
        }
      }
    });

    return {
      ...relationship,
      points: { yourPoints: newYourPoints, theirPoints: newTheirPoints },
      ink: { your: newYourInk, their: newTheirInk },
    };
  });
}
