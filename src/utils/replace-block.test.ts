/* eslint-disable ava/no-ignored-test-files */
import test from 'ava';
import {buildClosingTag, buildOpeningTag, replaceBlock} from './replace-block.js';

test('build tags with title', t => {
	t.is(buildOpeningTag({title: 'foo'}), '# foo #');
	t.is(buildClosingTag({title: 'foo'}), '# END foo #');
});

test('build tags with title and custom box', t => {
	t.is(buildOpeningTag({title: 'foo', box: '?'}), '? foo ?');
	t.is(buildClosingTag({title: 'foo', box: '?'}), '? END foo ?');
});

test('build tags with subtitle', t => {
	t.is(buildOpeningTag({title: 'foo', subtitle: 'bar'}), '# foo : bar #');
	t.is(buildClosingTag({title: 'foo', subtitle: 'bar'}), '# END foo : bar #');
});

test('replaceBlock appends with no match', t => {
	t.is(
		replaceBlock('foo bar\n', {title: 'FOO'}, 'monkeys'),
		`foo bar

# FOO #
monkeys
# END FOO #
`,
	);
});

test('replaceBlock appends replacing match', t => {
	t.is(
		replaceBlock(`foo bar

# FOO #
monkeys
# END FOO #

bar foo
`, {title: 'FOO'}, 'bing bang bong\nbong bang bing'),
		`foo bar

# FOO #
bing bang bong
bong bang bing
# END FOO #

bar foo
`,
	);
});
