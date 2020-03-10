import { Command, flags } from '@oclif/command';
import AspenDB from '@aspen.cloud/aspendb';

export default class Query extends Command {
  static description = 'Query data from AspenDB';

  static examples = [
    `$ aspen query --app spotify
[all docs in the app spotify]
`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    full: flags.boolean({
      required: false,
      default: false
    }),
    app: flags.string({
      char: 'a',
      description: 'id of the app to associate data with',
      required: true
    })
  };

  static args = [{ name: 'query' }];

  async run() {
    const { args, flags } = this.parse(Query);

    const app = flags.app;

    const db = new AspenDB(app);

    db.all({ fullDocs: flags.full }).then((docs: {}[]) => {
      this.log(JSON.stringify(docs));
    });
  }
}
