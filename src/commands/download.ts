import { command, string } from '@drizzle-team/brocli';
import chalk from 'chalk';
import { DEFAULT_MINECRAFT_FOLDER, fileName } from '../utils';
import { withProject, withSearchOptions } from '../utils/search';

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
    transform: (args) => withProject(args),
    handler: async ({ project, 'minecraft-folder': minecraftFolder }) => {
        if (!project) return console.error(chalk.red('Project not found'));
    },
});

export default cmd;
