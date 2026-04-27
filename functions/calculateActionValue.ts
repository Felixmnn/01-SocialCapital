export function calculateNewINKValue(
  currentINK: number,
  actionValue: number,
): number {
  const MIN_INK = 0.5;
  const MAX_INK = 2;

  let newINK = currentINK;

  if (actionValue > 0) {
    const distanceToMax = MAX_INK - currentINK;
    newINK += actionValue * distanceToMax;
  } else if (actionValue < 0) {
    const distanceToMin = currentINK - MIN_INK;
    newINK += actionValue * distanceToMin;
  }
  return newINK;
}

export function calculateNewScoreBasedOnINK(
  currentScore: number,
  currentINK: number,
  actionValue: number,
): number {
  let multiplier = 1;

  if (currentINK === 1) {
    multiplier = 1;
  } else if (currentINK > 1) {
    if (actionValue > 0) {
      // positive wird verstärkt
      multiplier = currentINK;
    } else {
      // negative wird abgeschwächt
      multiplier = 1 / currentINK;
    }
  } else {
    // currentINK < 1
    if (actionValue < 0) {
      // negative wird verstärkt
      multiplier = 1 / currentINK;
    } else {
      // positive wird abgeschwächt
      multiplier = currentINK;
    }
  }

  const newScore = currentScore + actionValue * multiplier;

  return newScore;
}

export function calculateNewScoreBasedOnBed(
  currentScore: number,
  lastTimeAction: Date,
  actionValue: number,
): number {
  return actionValue;
}

export function calculateNewScoreBasedOnQAN(
  currentScore: number,
  actionValue: number,
  timeStampsLast30Days: Date[],
): number {
  return actionValue;
}
