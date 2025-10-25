import { search } from '@inquirer/prompts';
import { facets, searchProjects } from '@modrinth-ts/lib';
import { Argument, Command } from 'commander';

const command = new Command('search');

const choices = ['mod', 'modpack', 'resourcepack', 'shader'] as const;

command
    .addArgument(
        new Argument('what', 'What to search for')
            .choices(choices)
            .argOptional(),
    )
    .action(async (what?: (typeof choices)[number]) => {
        const project = await search({
            message: `Selected ${what ? what : 'project'}:`,
            source: async (input, { signal }) => {
                if (!input) return [];

                const response = await searchProjects({
                    query: {
                        query: input,
                        facets: what
                            ? facets(`project_type:${what}`)
                            : undefined,
                    },
                    signal,
                });

                if (!response.data) return [];

                return response.data.hits.map((project) => ({
                    name: project.title,
                    value: project,
                    description: project.description,
                }));
            },
        });
    });

export default command;
