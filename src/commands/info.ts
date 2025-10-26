import { command } from '@drizzle-team/brocli';
import { getProjectTeamMembers } from '@modrinth-ts/lib';
import chalk from 'chalk';
import moment from 'moment';
import { assertHasValue, fileName, pointer } from '../utils';
import { withProject, withSearchOptions } from '../utils/search';

const cmd = command({
    name: fileName(import.meta),
    desc: 'Get information about a Modrinth project',
    options: withSearchOptions,
    transform: withProject,
    handler: async ({ project }) => {
        if (!project) return console.error(chalk.red('Project not found'));

        const { data: teamMembers } = await getProjectTeamMembers({
            path: { 'id|slug': project.id },
        });

        assertHasValue(teamMembers);

        const license = project.license?.id
            ? (project.license.id.startsWith('LicenseRef-')
                  ? project.license.id.slice(11)
                  : project.license.id
              ).replaceAll('-', ' ')
            : 'Unknown';

        console.log(
            `
${chalk.bold.blue(project.title || project.id)}, by ${teamMembers.map((member) => chalk.underline.blue(member.user.username)).join(', ')}
${chalk.dim('Last updated:')} ${chalk.dim.magenta(moment(project.updated).fromNow())}
${project.description ? `\n${chalk.italic(project.description)}` : ''}
${project.loaders?.length ? `\nFor ${project.loaders.map((loader) => chalk.bold.yellow(loader)).join(', ')}` : ''}

${pointer} ${chalk.green('ID')}: ${project.id}
${pointer} ${chalk.green('Type')}: ${project.project_type}
${pointer} ${chalk.green('Downloads')}: ${project.downloads.toLocaleString()}
${pointer} ${chalk.green('License')}: ${license}

${chalk.underline.blue(`https://modrinth.com/project/${project.id}`)}
`.trim(),
        );
    },
});

export default cmd;
