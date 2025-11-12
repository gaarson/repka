function _simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return String(hash);
}

export const hashUtils = {
  simpleHash: _simpleHash,
};
