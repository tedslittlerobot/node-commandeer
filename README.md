Commandeer
==========

A wrapper around CommanderJS with a few common utilities.

## Installation

```bash
npm i @tedslittlerobot/commandeer
```

## Usage

### TSConfig

There is a base tsconfig.json which can be used as follows. Note that you must still provide all paths, as paths within an extended config are relative to where the config is extended from.

```json
{
  "extends": "./node_modules/@tedslittlerobot/commandeer/tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "baseUrl": "./",
    "outDir": "build",
    "paths": {
      "src/*": ["./src/*"]
    },
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Writing CLI Apps

Commandeer introduces a convention for registering commands and groups in commander.

```bash
src
├── commands
│   ├── users # This is a sub-command / command group
│   │   ├── index.ts # This should export the Group definition
│   │   ├── details.ts # This should export the Command definition for a command
│   │   └── create.ts # This should export the Command definition for a command
│   └── index.ts # This should export an array of all commands
├── helpers # A directory for generic helpers
│   ├── my-api.ts
│   └── wordart.ts
├── index.ts # The root index.ts should define the program
└── tasks # A directory of Listr2 Task Lists
    ├── user-details.ts # This should export the task list
    ├── user-details.evaluate.ts # More complex individual tasks may have their own file
    ├── user-details.evaluate.study-services.test.ts # And their own tests
    ├── user-details.evaluate.study.test.ts # And their own tests
    ├── user-details.io.ts # ... more complex task file
    └── user-details.types.ts # And potentially some specific type definitions
```

#### Root index.ts

Firstly, your main/root index.ts / entry point should be:

```typescript
#! /usr/bin/env node
import {env} from 'node:process';
import commands from 'src/commands/index.js';
import {runProgram} from '@tedslittlerobot/commandeer/lib/commander';

runProgram(
	'my-command-name',
	env.COMMANDER_VERSION ?? 'vx.x.x',
	'A vulnerability scan checker for trialmotif',
	commands,
);
```

#### Commands Index File `commands/index.ts`

The commands index file should export an array of all groups and top level commands.

```typescript
import users from './users/index.js';

const commands = [users];
export default commands;
```

#### Command Group Definition `commands/users/index.ts`

A Command Group contains some configuration options and some sub commands:

```typescript
import type {CommandGroup} from '@tedslittlerobot/commandeer';
import create from './create.js';
import details from './details.js';

const group: CommandGroup = {
	type: 'group',
	name: 'users',
	description: 'Some commands to peform user actions',
	commands: [create, details],
};

export default group;
```

#### Command Definition `commands/users/index.ts`

A Command Group contains some configuration options and some sub commands:

```typescript
import type {CommandRegistrar} from '@tedslittlerobot/commandeer/lib/commander';
import {type Command} from 'commander';

type Options = {
	output?: string;
};

const command: CommandRegistrar = {
	type: 'command',
	name: 'details',
	description: 'Get some user details',
	config(command) {
		command
      .argument('<userId>', 'The user ID')
			.option('-o, --output <file>', 'Optional location to store manifest file');
	},
	async action(
    userId: string,
		options: Options,
		command: Command,
	) {
		console.info(`User details for ${userId}`);
	},
	completions() {
		return [];
	},
};

export default command;
```

#### Command Definition With Listr2 `commands/users/index.ts`

A Command Group contains some configuration options and some sub commands:

```typescript
import type {CommandRegistrar} from '@tedslittlerobot/commandeer/lib/commander';
import {runTasks} from '@tedslittlerobot/commandeer/lib/listr';
import {type Command} from 'commander';
import tasks, {summarise} from 'src/tasks/user-details.js';

type Options = {
	output?: string;
};

const command: CommandRegistrar = {
	type: 'command',
	name: 'details',
	description: 'Get some user details',
	config(command) {
		command
      .argument('<userId>', 'The user ID')
			.option('-o, --output <file>', 'Optional location to store output file');
	},
	async action(
    userId: string,
		options: Options,
		command: Command,
	) {
		summarise( // A summarise method to handle final output
			await runTasks(tasks(options.output)), // And an async run of the relevant tasks
		);
	},
	completions() {
		return [];
	},
};

export default command;
```

#### Task List File `tasks/user-details/index.ts`

```typescript
import {stderr, stdout} from 'node:process';
import {type ListrTask} from 'listr2';
import chalk, {type ChalkInstance} from 'chalk';
import apiCall from './user-details.api.js';

type MvmTaskContext = {
  payload: Record<string, string>;
	name: string;
};

export default function mvmTasks(
  userId: string,
  outputFile?: string,
  format: ChalkInstance = chalk.cyan.bold,
): Array<ListrTask<MvmTaskContext>> {
  return [
		{
			title: format('Getting user details from API'),
			async task(context, task) {
				context.payload = await apiCall(
          userId,
          ['config option 1', 'config option 1']
				);

        task.title = 'Details retrieved from API';
			},
		},
    {
			title: format('Parsing API Payload'),
			async task(context) {
				context.name = context.payload.name;
			},
		},
  ];
}

export function summarise(({payload, name}): MvmTaskContext) {
  const table = new CliTable3();
  table.push(payload);
  strerr.write(table.toString()); // For user friendly output to stderr

  stdout.write(JSON.stringify({name})); // eg. for piping to stdout
}
```
