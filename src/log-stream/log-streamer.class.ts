import {type IOType, type StdioOptions} from 'node:child_process';
import {type Stream} from 'node:stream';
import {
	createWriteStream, existsSync, unlinkSync, writeFileSync,
} from 'node:fs';
import {
	argv,
	env,
	exit,
	stderr,
} from 'node:process';
import type {Result} from 'execa';
import {type Command} from 'commander';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

const logLevels = {
	shout: 4,
	heading: 3,
	info: 2,
	debug: 1,
	trace: 0,
};

type LogMap = typeof logLevels;
export type LogLevel = keyof LogMap;

type LogLevelKeyValuePair = {
	name: LogLevel;
	value: number;
};

export type Writable = {
	write(message: any): void;
};

type Procesor = (m: string) => string;

type Channels = {
	display: Writable | undefined;
	file: Writable | undefined;
};

type ChannelFilterMap = Record<keyof Channels, boolean>;
type ChannelFilter = (level: LogLevelKeyValuePair, message: any) => ChannelFilterMap;

export default class LogStreamer {
	public channels: Channels = {
		display: stderr,
		file: undefined,
	};

	public logFilePath?: string = undefined;

	private channelFilter: ChannelFilter;

	constructor() {
		this.channelFilter = level => ({
			display: level.value >= logLevels.shout,
			file: true,
		});
	}

	filterChannels(callback: ChannelFilter) {
		this.channelFilter = callback;
		return this;
	}

	/**
	 * @deprecated
	 */
	fatal(message: string | any): never {
		this.error(message, true);
		exit(0);
	}

	/**
	 * @deprecated
	 */
	error(message: string | any, newline = true) {
		return this.process(chalk.red(message), 'shout', newline);
	}

	shout(message: string | any, newline = true) {
		return this.process(message, 'shout', newline);
	}

	heading(message: string | any) {
		const banner = chalk.cyan('-'.repeat(80));

		return this.process(
			message,
			'heading',
			false,
			m => `${banner}\n        ${m}\n${banner}\n\n`,
		);
	}

	info(message: string | any, newline = true) {
		return this.process(
			message,
			'info',
			newline,
			m => `${chalk.cyan.bold('[info]')} ${chalk.yellow(m)}`,
		);
	}

	debug(message: string | any, newline = true) {
		return this.process(
			message,
			'debug',
			newline,
			m => `${chalk.cyan('  [debug]')} ${chalk.yellow(m)}`,
		);
	}

	execaResult(result: Result) {
		return this.heading(result.command)
			.debug(result.stdout)
			.trace(result.stderr);
	}

	trace(message: string | any, newline = true) {
		return this.process(
			message,
			'trace',
			newline,
			m => `${chalk.yellow('    [trace]')} ${chalk.greenBright(m)}`,
		);
	}

	resolveChannel(level: LogLevel): Writable | undefined {
		const filter = this.channelFilter({name: level, value: logLevels[level]}, null);

		if (filter.display && this.channels.display) {
			return this.channels.display;
		}

		if (filter.file && this.channels.file) {
			return this.channels.file;
		}

		return undefined;
	}

	execaStreams(level: LogLevel = 'trace') {
		const channel = this.resolveChannel(level) as unknown as Stream;

		return {stdout: channel, stderr: channel};
	}

	stdioOptions(
		level: LogLevel = 'trace',
		inStream: IOType | 'ipc' | Stream | number | undefined = 'ignore',
	): StdioOptions {
		const channel = this.resolveChannel(level) as unknown as Stream;

		return [inStream, channel ?? 'ignore', channel ?? 'ignore'];
	}

	stdioOutOnlyOptions(
		outStream: IOType | 'ipc' | Stream | number | undefined,
		inStream: IOType | 'ipc' | Stream | number | undefined = 'ignore',
		level: LogLevel = 'trace',
	): StdioOptions {
		const channel = this.resolveChannel(level) as unknown as Stream;

		return [inStream, outStream, channel];
	}

	setupCommander(program: Command) {
		program
			.option('--quiet', 'Suppress output')
			.on('option:quiet', () => {
				this.filterChannels(() => ({display: false, file: true}));
			})
			.option('-v, --verbose', 'Verbose Mode (Output debugging information)')
			.on('option:verbose', () => {
				this.filterChannels(level => ({display: level.value >= logLevels.debug, file: true}));
			})
			.option('-vv, --super-verbose', 'Super Verbose Mode (Output lots of debugging information)')
			.on('option:super-verbose', () => {
				this.filterChannels(level => ({display: level.value >= logLevels.trace, file: true}));
			});

		this.setupFileChannel(env.UM_LOG_DIR ?? '/tmp', program.name());

		this.heading('Command Launched');
		this.info(argv);

		return program;
	}

	setupFileChannel(location: string, name: string) {
		this.logFilePath = `${location}/${name.toLowerCase().replace(' ', '-')}.log`;

		if (existsSync(this.logFilePath)) {
			unlinkSync(this.logFilePath);
			writeFileSync(this.logFilePath, '');
		}

		this.channels.file = createWriteStream(this.logFilePath);

		return this;
	}

	private process(
		message: any,
		level: LogLevel,
		newline = true,
		processor: Procesor = i => i,
	) {
		if (typeof message !== 'string') {
			message = JSON.stringify(message, null, 2);
		}

		if (newline) {
			message = `${message}\n`;
		}

		const processed = processor(message as string);

		const filter = this.channelFilter({name: level, value: logLevels[level]}, message);

		this
			.writeToChannel('display', filter, processed)
			.writeToChannel('file', filter, stripAnsi(processed));

		return this;
	}

	private writeToChannel(channel: keyof Channels, filter: ChannelFilterMap, message: string) {
		const writer = this.channels[channel];

		if (writer && filter[channel]) {
			writer.write(message);
		}

		return this;
	}
}
