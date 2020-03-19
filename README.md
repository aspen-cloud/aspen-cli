# Aspen CLI

Fetch and query all of your data from Gmail, Spotify, and more into a single database

- Build your own sources/connections and publish on NPM
- Query your data by source
- Exchange queries via plugins

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/aspen.svg)](https://npmjs.com/package/@aspen.cloud/aspen-cli)
[![Downloads/week](https://img.shields.io/npm/dw/aspen.svg)](https://npmjs.com/package/@aspen.cloud/aspen-cli)
[![License](https://img.shields.io/npm/l/aspen.svg)](https://github.com/matlin/aspen-cli/blob/master/package.json)

<!-- toc -->

- [Aspen CLI](#aspen-cli)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Plugins](#plugins)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @aspen.cloud/aspen-cli
$ aspen COMMAND
running command...
$ aspen (-v|--version|version)
@aspen.cloud/aspen-cli/0.1.6 darwin-x64 node-v11.11.0
$ aspen --help [COMMAND]
USAGE
  $ aspen COMMAND
...
```

<!-- usagestop -->

# Roadmap

- [x] CLI access to [AspenDB](https://www.github.com/aspen-cloud/aspendb)
- [x] Plugin support for different datasources
- [x] Spotify plugin
- [x] Query support with [Mango Queries](https://docs.couchdb.org/en/2.2.0/api/database/find.html#selector-syntax)
- [ ] Gmail plugin
- [ ] Sync data to Aspen Cloud for multi-device support and web access
- [ ] Auto-discovery schema for app
- [ ] Add option to automatically build index for query
- [ ] Google Takeout importer
- [ ] Facebook download importer

# Plugins

- [@aspen.cloud/plugin-spotify](https://npmjs.com/package/@aspen.cloud/plugin-spotify) Download your saved tracks, playlists, albums

# Commands

<!-- commands -->

- [`aspen help [COMMAND]`](#aspen-help-command)
- [`aspen index INDEX`](#aspen-index-index)
- [`aspen info [QUERY]`](#aspen-info-query)
- [`aspen plugins`](#aspen-plugins)
- [`aspen plugins:install PLUGIN...`](#aspen-pluginsinstall-plugin)
- [`aspen plugins:link PLUGIN`](#aspen-pluginslink-plugin)
- [`aspen plugins:uninstall PLUGIN...`](#aspen-pluginsuninstall-plugin)
- [`aspen plugins:update`](#aspen-pluginsupdate)
- [`aspen query [QUERY]`](#aspen-query-query)
- [`aspen source`](#aspen-source)
- [`aspen store [FILE]`](#aspen-store-file)

## `aspen help [COMMAND]`

display help for aspen

```
USAGE
  $ aspen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `aspen index INDEX`

Index data in AspenDB

```
USAGE
  $ aspen index INDEX

OPTIONS
  -a, --app=app  (required) ID of the app to query
  -h, --help     show CLI help

EXAMPLE
  $ aspen index --app spotify '{"fields": ["type"]}'
  [all docs in the app spotify]
```

_See code: [src/commands/index/index.ts](https://github.com/aspen-cloud/aspen-cli/blob/v0.1.6/src/commands/index/index.ts)_

## `aspen info [QUERY]`

Get info about your installation

```
USAGE
  $ aspen info [QUERY]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/info.ts](https://github.com/aspen-cloud/aspen-cli/blob/v0.1.6/src/commands/info.ts)_

## `aspen plugins`

list installed plugins

```
USAGE
  $ aspen plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ aspen plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.9/src/commands/plugins/index.ts)_

## `aspen plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ aspen plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ aspen plugins:add

EXAMPLES
  $ aspen plugins:install myplugin
  $ aspen plugins:install https://github.com/someuser/someplugin
  $ aspen plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.9/src/commands/plugins/install.ts)_

## `aspen plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ aspen plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ aspen plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.9/src/commands/plugins/link.ts)_

## `aspen plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ aspen plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ aspen plugins:unlink
  $ aspen plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.9/src/commands/plugins/uninstall.ts)_

## `aspen plugins:update`

update installed plugins

```
USAGE
  $ aspen plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.9/src/commands/plugins/update.ts)_

## `aspen query [QUERY]`

Query data from AspenDB

```
USAGE
  $ aspen query [QUERY]

OPTIONS
  -a, --app=app      (required) ID of the app to query
  -h, --help         show CLI help
  -q, --query=query  Query your data with Mango syntax
  --full             Whether to include the full documents

EXAMPLE
  $ aspen query --app spotify
  [all docs in the app spotify]
```

_See code: [src/commands/query.ts](https://github.com/aspen-cloud/aspen-cli/blob/v0.1.6/src/commands/query.ts)_

## `aspen source`

Fetch and store data from external sources like Gmail, Spotify, etc.

```
USAGE
  $ aspen source

OPTIONS
  --preview
```

_See code: [src/commands/source/index.ts](https://github.com/aspen-cloud/aspen-cli/blob/v0.1.6/src/commands/source/index.ts)_

## `aspen store [FILE]`

Store JSON data from a file or stdin into an AspenDB

```
USAGE
  $ aspen store [FILE]

OPTIONS
  -a, --app=app  (required) id of the app to associate data with
  -h, --help     show CLI help

EXAMPLE
  $ cat my_songs.json | aspen store --app "music"
  Succesfully added 450 items
```

_See code: [src/commands/store.ts](https://github.com/aspen-cloud/aspen-cli/blob/v0.1.6/src/commands/store.ts)_

<!-- commandsstop -->
