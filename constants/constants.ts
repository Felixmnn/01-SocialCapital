export type Action = {
  actionId: string;
  quantor: "BED" | "QAN" | "INK" | "BED/QAN" | null;
  startwert: number;
  ink_faktor: number | null;
  ink_kategorie: "attention" | "support" | "trust" | null;
  ink_light?: number | null;
};

export const positiveAction: Action[] = [
  {
    actionId: "Erkundigen",
    quantor: "BED/QAN",
    startwert: 6,
    ink_faktor: 0.1,
    ink_kategorie: "attention",
  },
  {
    actionId: "Treffen vorschlagen",
    quantor: "BED",
    startwert: 5,
    ink_faktor: 0.05,
    ink_kategorie: "attention",
  },
  {
    actionId: "Problem helfen",
    quantor: "INK",
    startwert: 14,
    ink_faktor: 0.14,
    ink_kategorie: "support",
  },
  {
    actionId: "Etwas ausgeben",
    quantor: null,
    startwert: 6,
    ink_faktor: 0.04,
    ink_kategorie: "support",
  },
  {
    actionId: "Etwas einladen",
    quantor: "QAN",
    startwert: 9,
    ink_faktor: 0.05,
    ink_kategorie: "support",
  },
  {
    actionId: "Zusage einhalten",
    quantor: "INK",
    startwert: 15,
    ink_faktor: 0.15,
    ink_kategorie: "trust",
  },
  {
    actionId: "Zeit nehmen",
    quantor: null,
    startwert: 12,
    ink_faktor: 0.12,
    ink_kategorie: "attention",
  },
  {
    actionId: "Sich bedanken",
    quantor: "BED/QAN",
    startwert: 5,
    ink_faktor: 0.04,
    ink_kategorie: "attention",
  },
  {
    actionId: "support anbieten",
    quantor: null,
    startwert: 7,
    ink_faktor: 0.06,
    ink_kategorie: "support",
  },
  {
    actionId: "Ehrliches Kompliment",
    quantor: "QAN",
    startwert: 6,
    ink_faktor: 0.06,
    ink_kategorie: "attention",
  },
];

export const negativeAction: Action[] = [
  {
    actionId: "Keine Zeit sagen",
    quantor: "QAN",
    startwert: -6,
    ink_faktor: -0.06,
    ink_kategorie: "attention",
  },
  {
    actionId: "Spontan absagen",
    quantor: "INK",
    startwert: -9,
    ink_faktor: -0.09,
    ink_kategorie: "trust",
  },
  {
    actionId: "Unentschuldigt nicht kommen",
    quantor: "INK",
    startwert: -12,
    ink_faktor: -0.12,
    ink_kategorie: "trust",
  },
  {
    actionId: "Sich stark verspäten",
    quantor: "QAN",
    startwert: -7,
    ink_faktor: -0.07,
    ink_kategorie: "trust",
  },
  {
    actionId: "Problem nicht helfen",
    quantor: "INK",
    startwert: -15,
    ink_faktor: -0.15,
    ink_kategorie: "support",
  },
  {
    actionId: "Nachrichten ignorieren",
    quantor: "INK",
    startwert: -12,
    ink_faktor: -0.12,
    ink_kategorie: "attention",
  },
  {
    actionId: "Unfreundlich antworten",
    quantor: "QAN",
    startwert: -8,
    ink_faktor: -0.08,
    ink_kategorie: "support",
  },
  {
    actionId: "Hinter Rücken reden",
    quantor: "INK",
    startwert: -18,
    ink_faktor: -0.18,
    ink_kategorie: "trust",
  },
  {
    actionId: "Desinteressiert sein",
    quantor: "INK",
    startwert: -5,
    ink_faktor: -0.05,
    ink_kategorie: "attention",
  },
  {
    actionId: "Versprechen nicht einhalten",
    quantor: "INK",
    startwert: -18,
    ink_faktor: -0.18,
    ink_kategorie: "trust",
  },
];

export const recoveryFactorsDaily = {
  trust: 0.02,
  attention: 0.03,
  support: 0.025,
  relationshipPoints: -1,
};

export function calculateNewINKValue(
  currentValue: number,
  lastUpdateDate: Date,
  category: "trust" | "attention" | "support" = "trust",
) {
  //Anzahl der Tage seit dem letzten Update berechnen
  const today = new Date();
  const timeDiff = today.getTime() - lastUpdateDate.getTime();
  const amountOfDays = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (amountOfDays <= 0) {
    return currentValue;
  }
  const recoveryFactor = recoveryFactorsDaily[category];

  if (currentValue > 1) {
    return Math.max(1, currentValue - amountOfDays * recoveryFactor);
  } else if (currentValue < 1) {
    return Math.min(1, currentValue + amountOfDays * recoveryFactor);
  } else {
    return currentValue;
  }
}

export function calculateNewPoints(
  currentPoints: number,
  lastUpdateDate: Date,
) {
  const today = new Date();
  const timeDiff = today.getTime() - lastUpdateDate.getTime();
  const amountOfDays = Math.floor(timeDiff / (1000 * 3600 * 24));
  if (amountOfDays <= 0) {
    return currentPoints;
  }
  const nextPoints =
    currentPoints + amountOfDays * recoveryFactorsDaily.relationshipPoints;
  return Math.min(currentPoints, nextPoints);
}
