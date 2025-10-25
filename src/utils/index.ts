import { normalize, resolve } from 'node:path';
import chalk from 'chalk';

export const relativeToMe = (me: ImportMeta, ...paths: string[]) =>
    normalize(
        resolve(new URL('.', me.url).href.replace('file:///', ''), ...paths),
    );

export const pointer = chalk.dim.magenta('>');
