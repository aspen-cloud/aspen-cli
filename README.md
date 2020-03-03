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
aspen/0.0.0 darwin-x64 node-v11.11.0
$ aspen --help [COMMAND]
USAGE
  $ aspen COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`aspen hello [FILE]`](#aspen-hello-file)
* [`aspen help [COMMAND]`](#aspen-help-command)

## `aspen hello [FILE]`

describe the command here

```
USAGE
  $ aspen hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ aspen hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/matlin/aspen-cli/blob/v0.0.0/src/commands/hello.ts)_

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
<!-- commandsstop -->
