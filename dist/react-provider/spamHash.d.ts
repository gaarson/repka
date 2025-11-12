export declare let KNOWN_SPAM_HASH: string | null;
export declare const PENDING_ERRORS: Array<{
    error: Error;
    hash: string;
    component: string;
}>;
export declare const getIsHashReady: () => boolean;
export declare const getKnownSpamHash: () => string;
export declare const __SET_SPAM_HASH_FOR_TESTS__: (hash: string | null) => void;
export declare function getSpamHash(): string;
export declare const store: {
    err: any;
} & import("../core/domain").ICallable<any, never>;
export declare function runServerCheck(): Promise<string | false>;
export declare function runClientCheck(): Promise<void>;
