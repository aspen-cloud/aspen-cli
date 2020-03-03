import * as PouchDB from 'pouchdb';

PouchDB.plugin(require('pouchdb-adapter-node-websql'));
const { getDataHome } = require('platform-folders');
const appDirectory = `${getDataHome()}/aspen/`;

export default class AspenDB {
  app: string;
  static localDBPath = appDirectory + 'aspen_local.db';

  constructor(appName: string) {
    this.db = new PouchDB(AspenDB.localDBPath, { adapter: 'websql' });
    this.app = appName;
  }

  async add(doc: object) {
    return this.db.post({ ...doc, aspen_app: this.app });
  }

  async addAll(docs: Array<object>) {
    return this.db.bulkDocs(
      docs.map(doc => ({ ...docs, aspen_app: this.app }))
    );
  }

  async all(fullDocs = false) {
    const { rows } = await this.db.allDocs({ include_docs: fullDocs });
    return rows;
  }

  async find(query) {
    return this.db.find(query);
  }
}
