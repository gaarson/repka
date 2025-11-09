export function simpleHash(str: string): string {
  let hash = 5381; // Стартовое "магическое" число
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
  }
  return String(hash);
}
