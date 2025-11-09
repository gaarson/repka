import React from 'react';

/**
 * Использует React Internals для получения имени компонента,
 * который сейчас рендерится.
 * Это "черная материя" – хрупко, но необходимо для обогащения ошибок.
 */
export function getRenderingComponentName(): string {
  const fallback = 'UnknownComponent';
  try {
    // @ts-ignore
    const internals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (!internals) return fallback;
    const owner = internals.ReactCurrentOwner?.current;
    if (!owner) return fallback;
    const componentType = owner.type;
    if (!componentType) return fallback;

    // .name для function-компонентов, .displayName для React.memo и т.д.
    return componentType.displayName || componentType.name || fallback;
  } catch (e) {
    // В случае любой ошибки (например, в новой версии React)
    // мы просто вернем fallback, а не упадем.
    return fallback;
  }
}
