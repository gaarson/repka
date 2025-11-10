/**
 * Использует React Internals для получения имени компонента,
 * который сейчас рендерится.
 * Это "черная материя" – хрупко, но необходимо для обогащения ошибок.
 */
export declare function getRenderingComponentName(): string;
