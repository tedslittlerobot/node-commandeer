/* eslint-disable ava/no-ignored-test-files */
import test from 'ava';
import {s} from './template-string.js';

test('compiles with no substitutions', t => {
	t.is(s`foo`, 'foo');
});

test('compiles with one substitution', t => {
	t.is(s`foo ${'bar'}`, 'foo bar');
	t.is(s`foo ${42}`, 'foo 42');
});

test('compiles with multiple substitution pairs', t => {
	t.is(s`foo ${'bar'} baz ${'monkeys'}`, 'foo bar baz monkeys');
});

test('compiles with multiple substitution pairs and trailing template', t => {
	t.is(s`foo ${'bar'} baz`, 'foo bar baz');
});

test('compiles with multiple substitution pairs and double substitution', t => {
	t.is(s`foo ${'bar'}${'baz'}`, 'foo barbaz');
});

test('multiline compiles with one line and no substitutions', t => {
	t.is(s`
		foo bar
		`, 'foo bar');
});

test('multiline compiles with no substitutions', t => {
	t.is(s`
		foo bar
		baz monkeys
		`, 'foo bar\nbaz monkeys');
});

test('multiline compiles with spaces and no substitutions', t => {
	t.is(s`
    foo bar
    baz monkeys
		`, 'foo bar\nbaz monkeys');
});

test('multiline compiles with no substitutions and invalid indentation', t => {
	t.is(s`
		foo bar
	baz monkeys
		`, 'foo bar\n	baz monkeys');
});

test('multiline compiles with no substitutions and additional indentation', t => {
	t.is(s`
		foo bar
			baz monkeys
		`, 'foo bar\n	baz monkeys');
});
