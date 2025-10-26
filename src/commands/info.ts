import { getProjectTeamMembers } from '@modrinth-ts/lib';
import chalk from 'chalk';
import moment from 'moment';
import { assertHasValue, commandFromFileName, pointer } from '../utils';
import { type Choice, searchArgument, searchProject } from '../utils/search';

const command = commandFromFileName(import.meta);

command.addArgument(searchArgument).action(async (what?: Choice) => {
    const project = await searchProject(what);

    if (!project) return console.error(chalk.red('Project not found'));

    const { data: teamMembers } = await getProjectTeamMembers({
        path: { 'id|slug': project.id },
    });

    assertHasValue(teamMembers);

    const license = project.license?.id
        ? project.license.id.startsWith('LicenseRef-')
            ? project.license.id.slice(11).replaceAll('-', ' ')
            : project.license.id.replaceAll('-', ' ')
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
});

export default command;
