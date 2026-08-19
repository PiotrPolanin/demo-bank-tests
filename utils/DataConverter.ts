export class DataConverter {
  convertToNumber(value: string): number {
    return parseFloat(value.trim().replaceAll(" ", "").replaceAll(",", "."));
  }

  convertToNumberString(value: number, delimiter: string = ","): string {
    return value.toString().replace(".", delimiter);
  }
}
