import {readFileSync, writeFileSync} from 'node:fs';

export type MarkerTarget = {
	title: string;
	subtitle?: string;
	box?: string;
};

export function replaceBlockInFile(file: string, target: MarkerTarget, replaceWith: string) {
	const input = readFileSync(file, 'utf8');

	const output = replaceBlock(input, target, replaceWith);

	writeFileSync(file, output, 'utf8');
}

export function replaceBlock(input: string, target: MarkerTarget, replaceWith: string): string {
	const openingTag = buildOpeningTag(target);
	const closingTag = buildClosingTag(target);
	const content = `${buildOpeningTag(target)}
${replaceWith}
${buildClosingTag(target)}`;

	const match = new RegExp(`${openingTag}.*${closingTag}`, 'gs');

	if (match.test(input)) {
		return input.replace(match, content);
	}

	input += `\n${content}\n`;

	return input;
}

export function buildOpeningTag({title, subtitle, box}: MarkerTarget): string {
	return `${box ?? '#'} ${title}${subtitle ? ` : ${subtitle}` : ''} ${box ?? '#'}`;
}

export function buildClosingTag({title, subtitle, box}: MarkerTarget): string {
	return `${box ?? '#'} END ${title}${subtitle ? ` : ${subtitle}` : ''} ${box ?? '#'}`;
}
