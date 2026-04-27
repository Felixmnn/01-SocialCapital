export type Avatar = {
  skinColor: "light" | "medium-light" | "medium" | "medium-dark" | "dark";
  hairColor: "black" | "brown" | "blonde" | "red" | "gray" | "white";
  beardType: "none" | "mustache" | "full";
  beardColor: "black" | "brown" | "blonde" | "red" | "gray" | "white";
  selectedCharacter:
    | "character1"
    | "character2"
    | "character3"
    | "character4"
    | "character5"
    | "character6"
    | "character7";
  backgroundColor: "blue" | "green" | "yellow" | "purple" | "orange";
};

export type Person = {
  name: string;
  avatar: Avatar;
};

export type Points = {
  yourPoints: number;
  theirPoints: number;
};

export type inkValues = {
  trust: number;
  attention: number;
  support: number;
};

export type action = {
  actor: "you" | "them";
  actionID: string;
  date: string; // ISO Datum
};

export type Relationship = {
  distance: number; // 1-4
  strength: number; // 1-4
  person: Person;
  points: Points;
  ink: {
    your: inkValues;
    their: inkValues;
  };
  actions: action[];
};
