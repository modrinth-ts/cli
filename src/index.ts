import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import { type Command, run } from '@drizzle-team/brocli';
import { client } from '@modrinth-ts/lib/client';
import pkg from '../package.json';
import { dev, relativeToMe } from './utils';

const COMMANDS_DIR = relativeToMe(import.meta, 'commands');

client.setConfig({
    throwOnError: true,
    validateStatus: (status) => status < 400,
});

const loadCommands = async () => {
    const commands: Command[] = [];

    for await (const file of glob('**/*.ts', { cwd: COMMANDS_DIR })) {
        const { default: command } = await import(join(COMMANDS_DIR, file));
        if (!command || typeof command !== 'object') continue;
        commands.push(command);
    }

    return commands;
};

loadCommands().then((commands) => {
    if (dev) console.clear();
    run(commands, {
        name: Object.keys(pkg.bin)[0] || 'modrinth',
        version: pkg.version,
        description: pkg.description,
    });
});
