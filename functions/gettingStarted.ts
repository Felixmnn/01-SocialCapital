export function gettingStartedButtonText(
  currentStep: "one" | "two" | "three",
  yourNameLength: number,
  themNameLength: number,
): string {
  if (currentStep === "one") {
    return yourNameLength > 0 ? "Continue" : "Choose your name";
  } else if (currentStep === "two") {
    return themNameLength > 0 ? "Continue" : "Choose a friend's name";
  } else {
    return "Start";
  }
}

export function gettingStartedButtonDisabled(
  currentStep: "one" | "two" | "three",
  yourNameLength: number,
  themNameLength: number,
): boolean {
  if (currentStep === "one") {
    return yourNameLength === 0;
  } else if (currentStep === "two") {
    return themNameLength === 0;
  } else {
    return false;
  }
}
