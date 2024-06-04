import {type IOType, type StdioOptions} from 'node:child_process';
import {
	createWriteStream, existsSync, unlinkSync, writeFileSync,
} from 'node:fs';
import {
	argv,
	env,
	exit,
	stderr,
} from 'node:process';
import {type Stream} from 'node:stream';
import {type Command} from 'commander';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

const logLevels = {
	shout: 3,
	info: 2,
	debug: 1,
	trace: 0,
};

type LogMap = typeof logLevels;
export type LogLevel = keyof LogMap;

type Writable = {
	write(message: any): void;
};

type Procesor = (m: string) => string;

export default class LogStreamer {
	public displayLevel: LogLevel = 'info';
	public displayLevelValue: number = logLevels.info;

	public aboveThresholdStream?: Writable = stderr as Writable;
	public belowThresholdStream?: Writable = undefined;

	public logFilePath?: string = undefined;

	streamUnderThresholdToFile(location: string, name: string) {
		this.logFilePath = `${location}/${name.toLowerCase().replace(' ', '-')}.log`;

		if (existsSync(this.logFilePath)) {
			unlinkSync(this.logFilePath);
			writeFileSync(this.logFilePath, '');
		}

		this.belowThresholdStream = createWriteStream(this.logFilePath) as Writable;

		return this;
	}

	setDisplayLevel(level: LogLevel) {
		this.displayLevel = level;
		this.displayLevelValue = logLevels[level];
	}

	shouldDisplayLevelInForeground(level: LogLevel) {
		return logLevels[level] >= this.displayLevelValue;
	}

	process(
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

		if (this.shouldDisplayLevelInForeground(level)) {
			this.aboveThresholdStream?.write(processor(message as string));
		}

		this.belowThresholdStream?.write(stripAnsi(message as string));

		return this;
	}

	fatal(message: string | any): never {
		this.error(message, true);
		exit(0);
	}

	error(message: string | any, newline = true) {
		return this.process(chalk.red(message), 'shout', newline);
	}

	shout(message: string | any, newline = true) {
		return this.process(message, 'shout', newline);
	}

	info(message: string | any, newline = true) {
		return this.process(message, 'info', newline);
	}

	debug(message: string | any, newline = true) {
		return this.process(
			message,
			'debug',
			newline,
			m => `${chalk.cyan('[debug]')} ${chalk.yellow(m)}`,
		);
	}

	trace(message: string | any, newline = true) {
		return this.process(
			message,
			'trace',
			newline,
			m => `${chalk.yellow(' [trace]')} ${chalk.greenBright(m)}`,
		);
	}

	stdioOptions(
		level: LogLevel = 'trace',
		inStream: IOType | 'ipc' | Stream | number | undefined = 'ignore',
	): StdioOptions {
		const stream = ((this.shouldDisplayLevelInForeground(level) ? this.aboveThresholdStream : this.belowThresholdStream) as unknown as Stream | undefined) ?? 'ignore';

		return [inStream, stream, stream];
	}

	stdioOutOnlyOptions(
		outStream: IOType | 'ipc' | Stream | number | undefined,
		inStream: IOType | 'ipc' | Stream | number | undefined = 'ignore',
		level: LogLevel = 'trace',
	): StdioOptions {
		const stream = ((this.shouldDisplayLevelInForeground(level) ? this.aboveThresholdStream : this.belowThresholdStream) as unknown as Stream | undefined) ?? 'ignore';

		return [inStream, outStream, stream];
	}

	setupCommander(program: Command) {
		program
			.option('--quiet', 'Suppress output')
			.on('option:quiet', () => {
				this.setDisplayLevel('shout');
			})
			.option('-v, --verbose', 'Verbose Mode (Output debugging information)')
			.on('option:verbose', () => {
				this.setDisplayLevel('debug');
			})
			.option('-vv, --super-verbose', 'Super Verbose Mode (Output lots of debugging information)')
			.on('option:super-verbose', () => {
				this.setDisplayLevel('trace');
			});

		this.streamUnderThresholdToFile(env.UM_LOG_DIR ?? '/tmp', program.name());

		this.trace(argv);

		return program;
	}
}
