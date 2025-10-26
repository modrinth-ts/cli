import { command, string } from '@drizzle-team/brocli';
import chalk from 'chalk';
import { DEFAULT_MINECRAFT_FOLDER, fileName } from '../utils';
import { searchProject, withSearchOptions } from '../utils/search';

const cmd = command({
    name: fileName(import.meta),
    desc: 'Download a Modrinth project',
    options: {
        ...withSearchOptions,
        'minecraft-folder': string()
            .alias('m')
            .default(DEFAULT_MINECRAFT_FOLDER)
            .desc('Path to your Minecraft folder'),
    },
    handler: async ({ what, exact, 'minecraft-folder': minecraftFolder }) => {
        const project = await searchProject(exact || what);

        if (!project) return console.error(chalk.red('Project not found'));
    },
});

export default cmd;
