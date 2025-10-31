import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { command, positional, string } from '@drizzle-team/brocli';
import { getProjectVersions } from '@modrinth-ts/lib';
import chalk from 'chalk';
import {
    assertHasValue,
    createRequiredFolders,
    DEFAULT_MINECRAFT_FOLDER,
    fileName,
} from '../utils';
import { checkSHA512 } from '../utils/hashing';
import {
    type ChoiceStrict,
    withProject,
    withSearchOptions,
} from '../utils/search';

const DESTINATIONS: Record<Exclude<ChoiceStrict, 'modpack'>, string> = {
    mod: 'mods',
    resourcepack: 'resourcepacks',
    shader: 'shaderpacks',
} as const;

const cmd = command({
    name: fileName(import.meta),
    desc: 'Download a Modrinth project',
    options: {
        'game version': positional()
            .required()
            .desc('Game version to download for'),
        loader: positional().required().desc('Loader to download for'),
        ...withSearchOptions,
        'minecraft-folder': string()
            .alias('m')
            .default(DEFAULT_MINECRAFT_FOLDER)
            .desc('Path to your Minecraft folder'),
    },
    transform: (args) => withProject(args),
    handler: async ({
        project,
        'game version': gameVersion,
        loader,
        'minecraft-folder': mcFolder,
    }) => {
        if (!project) return console.error(chalk.red('Project not found'));

        const { data: versions } = await getProjectVersions({
            path: {
                'id|slug': project.id,
            },
            query: {
                game_versions: `["${gameVersion}"]`,
                loaders: `["${loader}"]`,
            },
        });

        if (!versions || !versions.length)
            return console.error(chalk.red('No versions found for project'));

        const file = versions[0]?.files[0];

        assertHasValue(file);
        assertHasValue(file.hashes.sha512);

        const fileData = await fetch(file.url).then((res) => res.arrayBuffer());
        const isValid = await checkSHA512(fileData, file.hashes.sha512);

        if (!isValid)
            return console.error(chalk.red('Downloaded file is corrupted'));

        if (project.project_type === 'modpack') return; // TODO: handle modpacks

        const filePath = join(
            mcFolder,
            DESTINATIONS[project.project_type],
            file.filename,
        );

        try {
            await createRequiredFolders(filePath);
            await writeFile(filePath, Buffer.from(fileData));
        } catch (error) {
            return console.error(
                chalk.red(
                    'Failed to write file to disk:',
                    (error as Error).message,
                ),
            );
        }

        console.log(
            chalk.green(
                `Successfully downloaded ${chalk.bold.blue(project.title)} to ${chalk.magenta(filePath)}`,
            ),
        );
    },
});

export default cmd;
