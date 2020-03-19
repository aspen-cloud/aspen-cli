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
      description: 'Whether to include the full documents',
      default: false
    }),
    app: flags.string({
      char: 'a',
      description: 'ID of the app to query',
      required: true
    }),
    query: flags.string({
      char: 'q',
      description: 'Query your data with Mango syntax',
      required: false
    })
  };

  static args = [{ name: 'query' }];

  async run() {
    const { args, flags } = this.parse(Query);

    const { app, query } = flags;

    const db = new AspenDB().app(app);

    if (query) {
      db.find(JSON.parse(query)).then(result =>
        this.log(JSON.stringify(result))
      );
    } else {
      db.all({ fullDocs: flags.full }).then((docs: {}[]) => {
        this.log(JSON.stringify(docs));
      });
    }
  }
}
