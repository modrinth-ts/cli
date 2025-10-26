import { search } from '@inquirer/prompts';
import {
    facets,
    getProject,
    getProjectTeamMembers,
    searchProjects,
} from '@modrinth-ts/lib';
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
        const projectID = await search({
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
                    value: project.project_id,
                    description: project.description,
                }));
            },
        });

        const { data: project } = await getProject({
            path: { 'id|slug': projectID },
        });
        const { data: teamMembers } = await getProjectTeamMembers({
            path: { 'id|slug': projectID },
        });

        if (!project || !teamMembers || !teamMembers.length)
            throw new Error('It should not be possible to reach this point');

        const license = project.license?.id
            ? project.license.id.startsWith('LicenseRef-')
                ? project.license.id.slice(11).replaceAll('-', ' ')
                : project.license.id.replaceAll('-', ' ')
            : 'Unknown';

        console.log(
            `
${chalk.bold.blue(project.title || project.id)}, by ${teamMembers.map((member) => chalk.underline.blue(member.user.username)).join(', ')}
${chalk.dim('Last updated:')} ${chalk.dim.magenta(new Date(project.updated).toLocaleDateString())}
${project.description ? `\n${chalk.italic(project.description)}` : ''}
${project.loaders?.length ? `\nFor ${project.loaders.map((loader) => chalk.bold.yellow(loader)).join(', ')}` : ''}

${pointer} ${chalk.green('ID')}: ${project.id}
${pointer} ${chalk.green('Type')}: ${project.project_type}
${pointer} ${chalk.green('Downloads')}: ${project.downloads.toLocaleString()}
${pointer} ${chalk.green('License')}: ${license}

${chalk.underline.blue(`https://modrinth.com/project/${project.id}`)}
`.trim(),
        );
    });

export default command;
