import { command, positional, string } from '@drizzle-team/brocli';
import chalk from 'chalk';
import { DEFAULT_MINECRAFT_FOLDER, fileName } from '../utils';
import { choices, searchProject } from '../utils/search';

const cmd = command({
    name: fileName(import.meta),
    desc: 'Download a Modrinth project',
    options: {
        what: positional()
            .enum(...choices)
            .desc('What to search for'),
        exact: string().alias('e').desc('Project ID or slug'),
        minecraftFolder: string()
            .alias('m')
            .default(DEFAULT_MINECRAFT_FOLDER)
            .desc('Path to your Minecraft folder'),
    },
    handler: async ({ what, exact, minecraftFolder }) => {
        const project = await searchProject(exact || what);

        if (!project) return console.error(chalk.red('Project not found'));
    },
});

export default cmd;
