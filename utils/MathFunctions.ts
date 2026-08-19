export class MathFunctions {
  roundToTwoDecimals(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  roundUp(value: number): number {
    return Math.ceil(value);
  }

  round(value: number): number {
    return Math.round(value);
  }
}
