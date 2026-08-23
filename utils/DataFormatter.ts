import { TestConfiguration } from "../configuration/test-configuration";
export class DataFormatter {
  formatNumber(
    value: number,
    locale = TestConfiguration.localePl ?? "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  ): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping: true,
    }).format(value);
  }
}
