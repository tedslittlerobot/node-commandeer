export function checkArgumentsForArguments(source: string[], targets: string[]): boolean {
	for (const target of targets) {
		if (source.includes(target)) {
			return true;
		}
	}

	return false;
}
