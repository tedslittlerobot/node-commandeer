import chalk from 'chalk';
import {IOType, StdioOptions} from 'child_process';
import {Command} from 'commander';
import {createWriteStream, existsSync, unlinkSync, writeFileSync} from 'fs';
import { exit } from 'process';
import {Stream} from 'stream';
import stripAnsi from 'strip-ansi';

const logLevels = {
  shout: 3,
  info: 2,
  debug: 1,
  trace: 0,
};

type LogMap = typeof logLevels;
export type LogLevel = keyof LogMap;

interface Writable {
  write(message: any): void;
}

type Procesor = (m: string) => string;

export default class LogStreamer {
  public displayLevel: LogLevel = 'info';
  public displayLevelValue: number = logLevels['info'];

  public aboveThresholdStream?: Writable = process.stderr as Writable;
  public belowThresholdStream?: Writable = undefined;

  streamUnderThresholdToFile(path: string) {
    if (existsSync(path)) {
      unlinkSync(path);
      writeFileSync(path, '');
    }

    this.belowThresholdStream = createWriteStream(path) as Writable;

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
    processor: Procesor = i => i
  ) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message, null, 2);
    }

    if (newline) {
      message = `${message}\n`;
    }

    if (this.shouldDisplayLevelInForeground(level)) {
      this.aboveThresholdStream?.write(processor(message));
    }

    this.belowThresholdStream?.write(stripAnsi(message));

    return this;
  }

  fatal(message: any): never {
    this.error(message, true);
    exit(0);
  }

  error(message: any, newline = true) {
    return this.process(chalk.red(message), 'shout', newline);
  }
  shout(message: any, newline = true) {
    return this.process(message, 'shout', newline);
  }
  info(message: any, newline = true) {
    return this.process(message, 'info', newline);
  }
  debug(message: any, newline = true) {
    return this.process(
      message,
      'debug',
      newline,
      m => `${chalk.cyan('[debug]')} ${chalk.yellow(m)}`
    );
  }
  trace(message: any, newline = true) {
    return this.process(
      message,
      'trace',
      newline,
      m => `${chalk.yellow(' [trace]')} ${chalk.greenBright(m)}`
    );
  }

  stdioOptions(
    level: LogLevel = 'trace',
    inStream: IOType | 'ipc' | Stream | number | null | undefined = 'ignore'
  ): StdioOptions {
    const stream =
      ((this.shouldDisplayLevelInForeground(level)
        ? this.aboveThresholdStream
        : this.belowThresholdStream) as unknown as Stream | null) || 'ignore';

    return [inStream, stream, stream];
  }

  stdioOutOnlyOptions(
    level: LogLevel = 'trace',
    outStream: IOType | 'ipc' | Stream | number | null | undefined,
    inStream: IOType | 'ipc' | Stream | number | null | undefined = 'ignore'
  ): StdioOptions {
    const stream =
      ((this.shouldDisplayLevelInForeground(level)
        ? this.aboveThresholdStream
        : this.belowThresholdStream) as unknown as Stream | null) || 'ignore';

    return [inStream, outStream, stream];
  }

  setupCommander(program: Command) {
    program
      .option('--quiet', 'Suppress output')
      .on('option:quiet', () => this.setDisplayLevel('shout'))
      .option('-v, --verbose', 'Verbose Mode (Output debugging information)')
      .on('option:verbose', () => this.setDisplayLevel('debug'))
      .option('-vv, --super-verbose', 'Super Verbose Mode (Output lots of debugging information)')
      .on('option:super-verbose', () => this.setDisplayLevel('trace'));

    this.streamUnderThresholdToFile(
      `/tmp/${program.name().toLowerCase().replace(' ', '-')}.log`
    );

    this.trace(process.argv);

    return this;
  }
}
