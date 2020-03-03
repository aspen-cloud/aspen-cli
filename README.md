aspen
=====

Backup and fetch all of your data from Gmail, Spotify, and more into a single database

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/aspen.svg)](https://npmjs.org/package/aspen)
[![Downloads/week](https://img.shields.io/npm/dw/aspen.svg)](https://npmjs.org/package/aspen)
[![License](https://img.shields.io/npm/l/aspen.svg)](https://github.com/matlin/aspen-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g aspen
$ aspen COMMAND
running command...
$ aspen (-v|--version|version)
aspen/0.1.0 darwin-x64 node-v11.11.0
$ aspen --help [COMMAND]
USAGE
  $ aspen COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`aspen help [COMMAND]`](#aspen-help-command)
* [`aspen query [QUERY]`](#aspen-query-query)
* [`aspen source:spotify`](#aspen-sourcespotify)

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

## `aspen query [QUERY]`

Query data from AspenDB

```
USAGE
  $ aspen query [QUERY]

OPTIONS
  -a, --app=app  id of the app to associate data with
  -h, --help     show CLI help
  --full

EXAMPLES
  $ aspen query --app spotify
  [all docs in the app spotify]

  $ aspen query --app spotify "{selector: {artist: {$eq: 'Chance the Rapper'}}}"
  [all docs from 'chance the rapper' in the app spotify ]
```

_See code: [src/commands/query.ts](https://github.com/matlin/aspen-cli/blob/v0.1.0/src/commands/query.ts)_

## `aspen source:spotify`

Download spotify data.

```
USAGE
  $ aspen source:spotify

OPTIONS
  -p, --preview  Lets you preview the data for the resource.
```

_See code: [src/commands/source/spotify.ts](https://github.com/matlin/aspen-cli/blob/v0.1.0/src/commands/source/spotify.ts)_
<!-- commandsstop -->
