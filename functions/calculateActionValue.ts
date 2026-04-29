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
  console.log("✅", newScore);
  return newScore;
}

export function calculateNewScoreBasedOnBed(
  currentScore: number,
  lastTimeAction: Date,
  actionValue: number,
): number {
  const MAX_BED = 1.75;
  const GROWTH = 0.25;
  const THRESHOLD_DAYS = 2;

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;

  const daysSince = Math.max(
    0,
    Math.floor((now.getTime() - lastTimeAction.getTime()) / msPerDay),
  );

  // Erst nach Threshold wächst es
  const effectiveDays = Math.max(0, daysSince - THRESHOLD_DAYS);

  let bedFactor = 1 + GROWTH * Math.log(1 + effectiveDays);
  bedFactor = Math.min(MAX_BED, bedFactor);

  return currentScore + actionValue * bedFactor;
}

export function calculateNewScoreBasedOnQAN(
  currentScore: number,
  actionValue: number,
  timeStampsLast30Days: Date[],
): number {
  const k = 0.4; // wie stark Abnahme ist
  const MIN_QAN = 0.4; // Minimum

  const count = timeStampsLast30Days.length;

  // klassische Abnahmefunktion
  let qanFactor = 1 / (1 + k * Math.max(0, count - 1));

  qanFactor = Math.max(MIN_QAN, qanFactor);

  return currentScore + actionValue * qanFactor;
}
