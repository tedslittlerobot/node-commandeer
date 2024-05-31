import omelette, {type TreeValue} from 'omelette';
import {checkArgumentsForArguments} from './helpers.js';

function factory() {
	return omelette('umenv');
}

const errorMessage
  = 'Something odd has happened - the completions source should have been returned';

export default function runCompletions(
	tree: TreeValue,
	arguments_: string[],
): boolean {
	if (checkArgumentsForArguments(arguments_, ['--completion', '--completion-fish'])) {
		factory();

		throw new Error(errorMessage);
	} else if (checkArgumentsForArguments(arguments_, ['--compgen'])) {
		factory().tree(tree).init();

		return true;
	} else if (checkArgumentsForArguments(arguments_, ['--setup-completions'])) {
		factory().setupShellInitFile();

		throw new Error(errorMessage);
	} else if (checkArgumentsForArguments(arguments_, ['--debug-completion-tree'])) {
		console.info(tree);

		return true;
	}

	return false;
}
