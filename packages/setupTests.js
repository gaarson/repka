
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import '@testing-library/jest-dom';

import { __SET_SPAM_HASH_FOR_TESTS__ } from './react-provider/spamHash';
  
const TEST_SPAM_HASH = '-4039604535';

// Вызываем сеттер, который изменит 'let' внутри своего модуля
__SET_SPAM_HASH_FOR_TESTS__(TEST_SPAM_HASH);
