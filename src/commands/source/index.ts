import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

export class Source extends Command {
  static description =
    'Fetch and store data from external sources like Gmail, Spotify, etc.';

  static flags = {
    preview: flags.boolean({ required: false, default: false })
  };

  async run() {
    const { flags } = this.parse(Source);

    const subCommands = this.config.topics.filter(({ name }) =>
      name.startsWith(`${this.id}:`)
    );

    const prompt = inquirer.createPromptModule({ output: process.stderr });

    const { source }: any = await prompt([
      {
        name: 'source',
        message: 'Select a data source',
        type: 'list',
        choices: subCommands
          .map(({ name }) => name.split(':')[1])
          .map(src => ({ name: src }))
      }
    ]);

    this.config.runCommand(
      `${this.id}:${source}`,
      flags.preview ? ['--preview'] : []
    );
  }
}
