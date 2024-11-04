export function percentageCorrector(value: number): number {
  if (value > 100) {
    return 100;
  } else if (value < 0) {
    return 0;
  }
  return value;
}
