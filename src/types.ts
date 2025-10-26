declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APPDATA: string;
            HOME: string;
        }
    }
}

export {};