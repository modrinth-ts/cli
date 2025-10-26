import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';
import pkg from '../package.json';
import { relativeToMe } from './utils';

const program = new Command();
const COMMANDS_DIR = relativeToMe(import.meta, 'commands');

program
    .name(Object.keys(pkg.bin)[0] || 'modrinth')
    .description(pkg.description)
    .version(pkg.version);

const loadCommands = async () => {
    for await (const file of glob('**/*.ts', { cwd: COMMANDS_DIR })) {
        const { default: command } = await import(join(COMMANDS_DIR, file));
        if (!command || !(command instanceof Command)) continue;
        program.addCommand(command);
    }
};

loadCommands().then(() => program.parseAsync(process.argv));
