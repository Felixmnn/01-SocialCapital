export type Action = {
  positiv: string;
  quantor: "BED" | "QAN" | "INK" | "BED/QAN" | null;
  startwert: number;
  ink_faktor: number | null;
  ink_kategorie: "Aufmerksamkeit" | "Unterstützung" | "Vertrauen" | null;
  ink_light?: number | null;
};

export const positiveAction: Action[] = [
  {
    positiv: "Erkundigen",
    quantor: "BED/QAN",
    startwert: 6,
    ink_faktor: null,
    ink_kategorie: "Aufmerksamkeit",
    ink_light: 0.01,
  },
  {
    positiv: "Treffen vorschlagen",
    quantor: "BED",
    startwert: 5,
    ink_faktor: null,
    ink_kategorie: "Aufmerksamkeit",
    ink_light: 0.005,
  },
  {
    positiv: "Problem helfen",
    quantor: "INK",
    startwert: 14,
    ink_faktor: 0.014,
    ink_kategorie: "Unterstützung",
    ink_light: null,
  },
  {
    positiv: "Etwas ausgeben",
    quantor: null,
    startwert: 6,
    ink_faktor: null,
    ink_kategorie: "Unterstützung",
    ink_light: 0.004,
  },
  {
    positiv: "Etwas einladen",
    quantor: "QAN",
    startwert: 9,
    ink_faktor: null,
    ink_kategorie: "Unterstützung",
    ink_light: 0.005,
  },
  {
    positiv: "Zusage einhalten",
    quantor: "INK",
    startwert: 15,
    ink_faktor: 0.015,
    ink_kategorie: "Vertrauen",
    ink_light: null,
  },
  {
    positiv: "Zeit nehmen",
    quantor: null,
    startwert: 12,
    ink_faktor: null,
    ink_kategorie: "Aufmerksamkeit",
    ink_light: 0.012,
  },
  {
    positiv: "Sich bedanken",
    quantor: "BED/QAN",
    startwert: 5,
    ink_faktor: null,
    ink_kategorie: "Aufmerksamkeit",
    ink_light: 0.004,
  },
  {
    positiv: "Unterstützung anbieten",
    quantor: null,
    startwert: 7,
    ink_faktor: null,
    ink_kategorie: "Unterstützung",
    ink_light: 0.006,
  },
  {
    positiv: "Ehrliches Kompliment",
    quantor: "QAN",
    startwert: 6,
    ink_faktor: null,
    ink_kategorie: "Aufmerksamkeit",
    ink_light: 0.006,
  },
];

export const negativeAction: Action[] = [
  {
    positiv: "Keine Zeit sagen",
    quantor: "QAN",
    startwert: -6,
    ink_faktor: null,
    ink_kategorie: null,
  },
  {
    positiv: "Spontan absagen",
    quantor: "INK",
    startwert: -9,
    ink_faktor: -0.009,
    ink_kategorie: "Vertrauen",
  },
  {
    positiv: "Unentschuldigt nicht kommen",
    quantor: "INK",
    startwert: -12,
    ink_faktor: -0.012,
    ink_kategorie: "Vertrauen",
  },
  {
    positiv: "Sich stark verspäten",
    quantor: "QAN",
    startwert: -7,
    ink_faktor: null,
    ink_kategorie: null,
  },
  {
    positiv: "Problem nicht helfen",
    quantor: "INK",
    startwert: -15,
    ink_faktor: -0.015,
    ink_kategorie: "Unterstützung",
  },
  {
    positiv: "Nachrichten ignorieren",
    quantor: "INK",
    startwert: -12,
    ink_faktor: -0.012,
    ink_kategorie: "Aufmerksamkeit",
  },
  {
    positiv: "Unfreundlich antworten",
    quantor: "QAN",
    startwert: -8,
    ink_faktor: null,
    ink_kategorie: null,
  },
  {
    positiv: "Hinter Rücken reden",
    quantor: "INK",
    startwert: -18,
    ink_faktor: -0.018,
    ink_kategorie: "Vertrauen",
  },
  {
    positiv: "Desinteressiert sein",
    quantor: "INK",
    startwert: -5,
    ink_faktor: -0.005,
    ink_kategorie: "Aufmerksamkeit",
  },
  {
    positiv: "Versprechen nicht einhalten",
    quantor: "INK",
    startwert: -18,
    ink_faktor: -0.018,
    ink_kategorie: "Vertrauen",
  },
];
