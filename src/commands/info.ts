import { Command, flags } from '@oclif/command';
import { AspenDB } from '@aspen.cloud/aspendb';

export default class Info extends Command {
  static description = 'Get info about your installation';

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [{ name: 'query' }];

  async run() {
    const { args, flags } = this.parse(Info);
    this.log('Path to DB file', AspenDB.localDBPath);
  }
}
