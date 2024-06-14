import {readFile, writeFile} from 'node:fs/promises';
import lanterman from 'margaret-lanterman';

export type MarkerTarget = {
	title: string;
	subtitle?: string;
	box?: string;
};

export async function replaceBlockInFile(file: string, target: MarkerTarget, replaceWith: string) {
	await lanterman.write(file, 'replace-block:file');
	const input = await readFile(file, 'utf8');

	const output = await replaceBlock(input, target, replaceWith);

	await writeFile(file, output, 'utf8');
}

export async function replaceBlock(input: string, target: MarkerTarget, replaceWith: string): Promise<string> {
	const openingTag = buildOpeningTag(target);
	const closingTag = buildClosingTag(target);
	await lanterman.write(`${openingTag} - ${closingTag}`, 'replace-block:tags');
	const content = `${buildOpeningTag(target)}
${replaceWith}
${buildClosingTag(target)}`;

	const match = new RegExp(`${openingTag}.*${closingTag}`, 'gs');

	if (match.test(input)) {
		if (replaceWith === '') {
			await lanterman.write('Removing block', 'replace-block:result');
			return input.replace(match, '');
		}

		await lanterman.write('Replacing', 'replace-block:result');
		return input.replace(match, content);
	}

	await lanterman.write('Appending', 'replace-block:result');

	input += `\n${content}\n`;

	return input;
}

export function buildOpeningTag({title, subtitle, box}: MarkerTarget): string {
	return `${box ?? '#'} ${title}${subtitle ? ` : ${subtitle}` : ''} ${box ?? '#'}`;
}

export function buildClosingTag({title, subtitle, box}: MarkerTarget): string {
	return `${box ?? '#'} END ${title}${subtitle ? ` : ${subtitle}` : ''} ${box ?? '#'}`;
}
