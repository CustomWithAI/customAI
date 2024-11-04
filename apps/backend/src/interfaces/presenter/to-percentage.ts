export function formatToPercentage(input: number, decimalPlaces = 2): string {
  if (Number.isNaN(input)) {
    return "Invalid percentage";
  }
  return `${(input * 100).toFixed(decimalPlaces)}%`;
}
