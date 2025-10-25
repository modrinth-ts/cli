import { glob } from 'node:fs/promises';
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
    for await (const file of glob('*.ts', { cwd: COMMANDS_DIR })) {
        const { default: command } = await import(file);
        program.addCommand(command);
    }
};

const main = async () => {
    await program.parseAsync(process.argv);
    const options = program.opts();
    console.clear();
};

loadCommands().then(main);
