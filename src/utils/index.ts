import { normalize, resolve } from 'node:path';
import chalk from 'chalk';
import { Command } from 'commander';

export const relativeToMe = (me: ImportMeta, ...paths: string[]) =>
    normalize(
        resolve(new URL('.', me.url).href.replace('file:///', ''), ...paths),
    );

export const pointer = chalk.dim.magenta('>');

export const commandFromFileName = (me: ImportMeta) =>
    new Command(me.file.trim().replace('.ts', ''));

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
