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
