export class DataFormatter {
  formatNumber(value: number, locale = "en-US"): string {
    return value.toLocaleString(locale);
  }
}
