import { normalize, resolve } from 'node:path';

export const relativeToMe = (me: ImportMeta, ...paths: string[]) =>
    normalize(
        resolve(new URL('.', me.url).href.replace('file:///', ''), ...paths),
    );
