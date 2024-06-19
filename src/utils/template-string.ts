
export function s(template: TemplateStringsArray, ...parameters: any[]) {
	const compiled = template.map((item, index) => `${item}${parameters[index] ?? ''}`).join('');

	const lines = compiled.split('\n');

	if (lines[0] !== '') {
		return compiled;
	}

	lines.shift();
	lines.pop();

	if (lines.length === 0) {
		return '';
	}

	const progenitor = lines[0];

	const match = /^(\s+)\S.*$/.exec(progenitor);

	if (!match) {
		return lines.join('\n');
	}

	const prefix = match[1];

	return lines
		.map(item => item.startsWith(prefix) ? item.slice(prefix.length) : item)
		.join('\n');
}
