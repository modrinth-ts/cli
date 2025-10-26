import { normalize, resolve } from 'node:path';
import chalk from 'chalk';

export const relativeToMe = (me: ImportMeta, ...paths: string[]) =>
    normalize(
        resolve(new URL('.', me.url).href.replace('file:///', ''), ...paths),
    );

export const pointer = chalk.dim.magenta('>');

export const fileName = (me: ImportMeta) => me.file.trim().replace('.ts', '');

export const assertHasValue: <T>(
    value: T | null | undefined,
    message?: string,
) => asserts value is NonNullable<T> = (
    value,
    message = 'Expected value to be defined',
) => {
    if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
    )
        throw new Error(message);
};

export const DEFAULT_MINECRAFT_FOLDER = normalize(
    process.platform === 'win32'
        ? resolve(process.env.APPDATA, '.minecraft')
        : process.platform === 'darwin'
          ? resolve(
                process.env.HOME,
                'Library',
                'Application Support',
                'minecraft',
            )
          : resolve(process.env.HOME, '.minecraft'),
);
