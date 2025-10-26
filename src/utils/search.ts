import { search } from '@inquirer/prompts';
import { facets, getProject, searchProjects } from '@modrinth-ts/lib';

export const choices = ['mod', 'modpack', 'resourcepack', 'shader'] as const;

export type ChoiceStrict = (typeof choices)[number];
export type Choice = ChoiceStrict | (string & {});

export const isStrictChoice = (value?: Choice): value is ChoiceStrict =>
    typeof value === 'string' && choices.includes(value as ChoiceStrict);

export const searchProject = async (what?: Choice) => {
    const projectID =
        what && !isStrictChoice(what)
            ? what
            : await search({
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

    return project;
};
