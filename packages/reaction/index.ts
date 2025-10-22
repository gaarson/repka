import { Reaction } from './reaction'; // Мы его сейчас создадим

// Стек, который отслеживает, какой HOC рендерится прямо сейчас
export const REACTION_STACK: Reaction[] = [];
