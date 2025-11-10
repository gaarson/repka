import React from 'react';

export function getRenderingComponentName(): string {
  const fallback = 'UnknownComponent';
  try {
    const internals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (!internals) return fallback;
    const owner = internals.ReactCurrentOwner?.current;
    if (!owner) return fallback;
    const componentType = owner.type;
    if (!componentType) return fallback;

    return componentType.displayName || componentType.name || fallback;
  } catch (e) {
    return fallback;
  }
}
