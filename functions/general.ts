export function returnScaleIcon(
  yourPoints: number,
  theirPoints: number,
): "balance-scale" | "balance-scale-left" | "balance-scale-right" {
  //Wenn die pubkte sich maximal 20% unterscheiden, dann balanced
  if (
    Math.abs(yourPoints - theirPoints) <=
    Math.max(yourPoints, theirPoints) * 0.2
  ) {
    return "balance-scale";
  } else if (yourPoints > theirPoints) {
    return "balance-scale-left";
  } else {
    return "balance-scale-right";
  }
}
