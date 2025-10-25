import { search } from '@inquirer/prompts';
import { facets, searchProjects } from '@modrinth-ts/lib';
import chalk from 'chalk';
import { Argument, Command } from 'commander';
import { pointer } from '../utils';

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

                const { data: results } = await searchProjects({
                    query: {
                        query: input,
                        facets: what
                            ? facets(`project_type:${what}`)
                            : undefined,
                    },
                    signal,
                });

                if (!results) return [];

                return results.hits.map((project) => ({
                    name: project.title,
                    value: project,
                    description: project.description,
                }));
            },
        });

        if (!project) throw new Error('It should not be possible to get here');

        console.log(
            `
${chalk.bold.blue(project.title)}, by ${chalk.underline.blue(project.author)}
${chalk.dim('Last updated:')} ${chalk.dim.magenta(new Date(project.date_modified).toLocaleDateString())}

${project.description}

${pointer} ${chalk.green('Slug')}: ${project.slug}
${pointer} ${chalk.green('Type')}: ${project.project_type}
${pointer} ${chalk.green('Downloads')}: ${project.downloads.toLocaleString()}
${pointer} ${chalk.green('Categories')}: ${project.display_categories ? project.display_categories.join(', ') : 'none'}
${pointer} ${chalk.green('License')}: ${project.license}
`.trim(),
        );
    });

export default command;
