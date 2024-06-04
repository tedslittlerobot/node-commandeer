/* eslint-disable ava/no-ignored-test-files */
import test from 'ava';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';
import LogStreamer, {type Writable} from './log-streamer.class.js';

class MockWriter implements Writable {
	messages: any[] = [];

	constructor(public name: string) {
		this.name = name;
	}

	write(message: any): void {
		this.messages.push(message);
	}
}

test('instantiates', t => {
	const ls = new LogStreamer();
	t.pass();
});

test('does not fail when no channels applied', t => {
	const ls = new LogStreamer();

	ls.channels.display = undefined;
	ls.channels.file = undefined;
	ls.info('foo');

	t.pass();
});

test('basic writes', t => {
	const ls = new LogStreamer();
	const display = new MockWriter('display');
	const file = new MockWriter('file');

	ls.channels.display = display;
	ls.channels.file = file;
	ls.shout(chalk.blue('foo'), false);

	t.is(display.messages.length, 1);
	t.is(stripAnsi(display.messages[0] as string), 'foo', 'Display streamer should have value');
	t.deepEqual(file.messages, ['foo'], 'File streamer should have value');
});

test('does not write to display stream when display stream is disabled', t => {
	const ls = new LogStreamer();
	const display = new MockWriter('display');
	const file = new MockWriter('file');

	ls.filterChannels(() => ({display: false, file: true}));

	ls.channels.display = display;
	ls.channels.file = file;
	ls.shout(chalk.blue('foo'), false);

	t.deepEqual(display.messages, [], 'Display streamer should be empty');
	t.deepEqual(file.messages, ['foo'], 'File streamer should have value');
});
