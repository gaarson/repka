import React from 'react';
import { FIELDS_PREFIX } from 'core/domain';

export function simpleReactProvider<T>(prop: keyof T): T {
  // Уровень 1 (Быстрый): Проверка !ReactCurrentDispatcher.current
  // Если мы не в фазе рендера, возвращаем сырые данные
  if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  // Получаем хук. Если его нет (старый React), вернем сырые данные.
  const useSync = React.useSyncExternalStore;
  if (!useSync) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  // Уровень 2 (Надежный): Блок try...catch
  // Ловит "Invalid hook call" (например, в Server Components)
  try {
    const state = useSync(
      // 1. subscribe (notify)
      (notify) => {
        // 'notify' теперь наш уникальный ключ
        const currentProp = prop; // 'prop' из замыкания

        // Подписываем 'notify' на 'currentProp'
        if (
          this[`${FIELDS_PREFIX}listeners`][currentProp] &&
          typeof this[`${FIELDS_PREFIX}listeners`][currentProp] !== 'function'
        ) {
          this[`${FIELDS_PREFIX}listeners`][currentProp].set(notify, notify);
        }

        // Записываем, от какого поля зависит этот 'notify'
        // Это нужно для функции отписки
        this[`${FIELDS_PREFIX}criticalFields`].set(notify, [currentProp]);

        // Помечаем, что хук "активен"
        this[`${FIELDS_PREFIX}muppet`].set(notify, true);

        // 2. unsubscribe (возвращаем функцию "атомарной" очистки)
        return () => {
          // 'notify' все еще в замыкании
          
          // Помечаем как неактивный (для 'set' хэндлера)
          this[`${FIELDS_PREFIX}muppet`].set(notify, false);

          // Отписываем 'notify' из 'listeners'
          const fields = this[`${FIELDS_PREFIX}criticalFields`].get(notify);
          if (fields) {
            fields.forEach(p => { // 'p' - это 'currentProp'
              if (
                this[`${FIELDS_PREFIX}listeners`][p] &&
                typeof this[`${FIELDS_PREFIX}listeners`][p] !== 'function'
              ) {
                this[`${FIELDS_PREFIX}listeners`][p].delete(notify);
              }
            });
          }

          // Полностью удаляем все записи об этом 'notify'
          this[`${FIELDS_PREFIX}criticalFields`].delete(notify);
          this[`${FIELDS_PREFIX}muppet`].delete(notify);
        };
      },
      // 3. getSnapshot
      () => {
        return this[`${FIELDS_PREFIX}data`];
      }
    );

    // React.useEffect(...) ПОЛНОСТЬЮ УДАЛЕН

    // Возвращаем запрошенное свойство из актуального 'state'
    return state[prop];

  } catch (error) {
    // Безопасный фолбэк: возвращаем сырые данные
    return this[`${FIELDS_PREFIX}data`][prop];
  }
}
