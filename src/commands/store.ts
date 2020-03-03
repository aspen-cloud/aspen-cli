import { Command, flags } from '@oclif/command';
import * as readline from 'readline';
import AspenDB from '../lib/db';
import { Observable } from 'rxjs';

export default class Store extends Command {
  static description = 'Store JSON data from a file or stdin into an AspenDB';

  static examples = [
    `$ cat my_songs.json | aspen store --app "music"
Succesfully added 450 items
`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    app: flags.string({
      char: 'a',
      description: 'id of the app to associate data with',
      required: true
    })
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Store);

    const app = flags.app;

    const db = new AspenDB(app);

    readJSONFromStdIn().subscribe(resp => {
      if (Array.isArray(resp)) {
        console.error(`Added ${resp.length} documents`);
        db.addAll(resp);
      } else {
        console.error('Added document');
        db.add(resp);
      }
    });
  }
}

function readJSONFromStdIn(): Observable<object | object[]> {
  const rl = readline.createInterface({
    input: process.stdin
  });
  let input = '';
  rl.on('line', (line: string) => {
    input += line;
  });
  return new Observable(subscriber => {
    rl.on('pause', () => {
      subscriber.next(JSON.parse(input));
    });
    rl.on('close', () => {
      subscriber.complete();
    });
  });
}
