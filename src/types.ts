declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APPDATA: string;
            HOME: string;
            DEV?: 'true' | 'false';
        }
    }
}

export type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;
