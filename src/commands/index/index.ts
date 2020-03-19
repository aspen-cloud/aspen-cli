import { Command, flags } from '@oclif/command';
import AspenDB from '@aspen.cloud/aspendb';

export default class Index extends Command {
  static description = 'Index data in AspenDB';

  static examples = [
    `$ aspen index --app spotify '{"fields": ["type"]}'
[all docs in the app spotify]
`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.string({
      char: 'a',
      description: 'ID of the app to query',
      required: true
    })
  };

  static args = [{ name: 'index', required: true }];

  async run() {
    const { args, flags } = this.parse(Index);

    const { app } = flags;

    const { index } = args;

    const db = new AspenDB().app(app);

    db.putIndex(JSON.parse(index)).then(result =>
      this.log(JSON.stringify(result))
    );
  }
}
