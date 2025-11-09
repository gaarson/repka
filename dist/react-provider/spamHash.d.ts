export declare let KNOWN_SPAM_HASH: string | null;
export declare const __SET_SPAM_HASH_FOR_TESTS__: (hash: string | null) => void;
export declare function getSpamHash(): string;
export declare function runServerCheck(): Promise<unknown>;
export declare function runClientCheck(): Promise<void>;
