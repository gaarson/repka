export function createRepkaError(
  originalError: unknown,
  componentName: string,
  spamHash: string | null,
  errorHash: string
): Error {
  const isError = originalError instanceof Error;
  const message = isError ? originalError.message : String(originalError);

  const repkaError = new Error(
    `[Repka CRITICAL ERROR in <${componentName}>] \n\n` +
    `Repka's magic getter (store.prop) caught an UNKNOWN React error. \n` +
    `This is NOT the expected 'Invalid hook call' spam. \n` +
    `(Known Spam Hash: ${spamHash}, This Error Hash: ${errorHash}) \n\n` +
    `This is likely a CRITICAL React error (e.g., 'Rendered more hooks...'). \n` +
    `Repka is crashing LOUDLY to prevent a "zombie component". \n\n` +
    `Original error: \n` +
    `> ${message}`
  );

  // @ts-ignore
  repkaError.cause = originalError;
  return repkaError;
}

