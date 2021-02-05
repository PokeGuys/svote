/**
 * Normalize the HKID input by:
 * 1. Removing unwanted characters like '(', ')', '-', '/', ' '.
 * 2. Capitalizing input value.
 *
 * @param value HKID in string
 * @returns normalized value
 */
function normalize(value: string): string {
  let normalized = value.toUpperCase().replace(/[-\/\s]/g, '');
  // Contained any parenthesis in the check digit.
  if (/\([A-Z0-9]\)/.test(normalized)) {
    normalized = normalized.replace(/[\(\)]/g, '');
  }
  return normalized;
}

/**
 * Convert HKID identifier to number.
 *
 * @param input HKID in string
 * @returns
 */
function getCharValue(input: string): number {
  const codePoint = input.charCodeAt(0);
  // Is number
  if (codePoint >= 0x30 && codePoint <= 0x39) {
    return parseInt(input, 10);
  }
  // A in CodePoint: 65
  // A in HKID: 10
  return codePoint - 55;
}

/**
 * isValid indicate that the input value is a valid HKID.
 *
 * @param input HKID in string.
 * @returns
 */
export function isValid(input: string): boolean {
  // FIXME: Stop using magic number.
  const normalizedValue = normalize(input);
  // Validating input format.
  if (!/^[A-NP-Z]{1,2}[0-9]{6}[0-9A]$/.test(normalizedValue)) {
    return false;
  }
  let weight = normalizedValue.length;
  const identifier = normalizedValue.slice(0, -1);
  const suffix = normalizedValue.slice(-1);
  const checkDigit = suffix === 'A' ? 10 : parseInt(suffix);
  // initial weighted sum is 324 when ID is 8 character.
  let weightedSum = weight === 8 ? 324 : 0;
  for (const c of identifier) {
    weightedSum += getCharValue(c) * weight;
    weight--;
  }
  return (weightedSum + checkDigit) % 11 === 0;
}
