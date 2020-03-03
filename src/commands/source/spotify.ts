import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';
import {
  resources,
  startAuth,
  getResource,
  getTracksGenerator,
  iResource
} from '../../lib/spotify';
import Listr from 'listr';
import { map, tap } from 'rxjs/operators';
import * as path from 'path';
import AspenDB from '../../lib/db';
import { from } from 'rxjs';

/**
 * Steps
 * 1) List resources as checkboxes
 * 2) Authorize user with appropriate scopes (save token)
 * 3) Start downloading resources (use smart queue and appropriate limits)
 * 4) Either save to database, preview interactively (paging), or output to stdout [default: save]
 */

export class Spotify extends Command {
  static description = 'Download spotify data.';

  static flags = {
    preview: flags.boolean({
      char: 'p',
      description: 'Lets you preview the data for the resource.',
      default: false
    })
  };

  async run() {
    const { args, flags } = this.parse(Spotify);

    const db = new AspenDB('spotify');

    const prompt = inquirer.createPromptModule({ output: process.stderr });
    const choice = await prompt([
      {
        name: 'resources',
        message: 'Select which resources to download',
        type: 'checkbox',
        choices: Object.entries(resources).map(([key, resource]) => ({
          name: resource.name,
          value: key
        }))
      }
    ]);

    const tokenPath = path.join(this.config.cacheDir, 'spotify_token.json');

    if (flags.preview) {
      const { authURL, waitForAuth } = await startAuth(tokenPath);
      if (authURL) {
        cli.open(authURL);
      }
      await waitForAuth;

      const output = process.stdout;
      const getter = getTracksGenerator();
      let { value: tracks, done } = await getter.next();
      output.write(JSON.stringify(tracks));
      output.end();
      while ((await cli.prompt('More?')) === 'y' && !done) {
        ({ value: tracks, done } = await getter.next());
        output.write(JSON.stringify(tracks));
        output.end();
      }
      output.end();
      return;
    }

    function getTaskForResource(resource: iResource): Listr.ListrTask {
      return {
        title: `Downloading ${resource.label}`,
        task: async (ctx, task) => {
          let numDownloaded = 0;
          return resource.get().pipe(
            tap(({ items, total }: { items: any[]; total: number }) => {
              return from(db.addAll(items));
            }),
            map(({ items, total }: { items: any[]; total: number }) => {
              numDownloaded += items.length;
              return `Downloaded ${numDownloaded}/${total}`;
            })
          );
        }
      };
    }

    const tasks: Listr.ListrTask[] = choice.resources
      .map((resourceName: string) => getResource(resourceName))
      .map((resource: iResource) => getTaskForResource(resource));

    const taskRunner = new Listr(
      [
        {
          title: 'Authorizing with Spotify',
          task: async (ctx, task) => {
            const { authURL, waitForAuth } = await startAuth(tokenPath);
            if (authURL) {
              task.output = 'Please go to ' + authURL;
              cli.open(authURL);
            }
            return waitForAuth;
          }
        },
        {
          title: 'Downloading data',
          task: () => new Listr(tasks, { concurrent: true })
        }
      ],
      { concurrent: false }
    );

    taskRunner
      .run()
      .then(async () => {
        const docs = await db.all(true);
        console.log(docs);
      })
      .catch(err => {
        console.error(err);
      });
  }
}
