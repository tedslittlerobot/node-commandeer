import omelette, {TreeValue} from 'omelette';
import {checkArgsForArgs} from './helpers';

function factory() {
  return omelette('umenv');
}

const errorMessage =
  'Something odd has happened - the completions source should have been returned';

export default function runCompletions(
  tree: TreeValue,
  args: string[]
): boolean {
  if (checkArgsForArgs(args, ['--completion', '--completion-fish'])) {
    factory();

    throw new Error(errorMessage);
  } else if (checkArgsForArgs(args, ['--compgen'])) {
    factory().tree(tree).init();

    return true;
  } else if (checkArgsForArgs(args, ['--setup-completions'])) {
    factory().setupShellInitFile();

    throw new Error(errorMessage);
  } else if (checkArgsForArgs(args, ['--debug-completion-tree'])) {
    console.info(tree);

    return true;
  }

  return false;
}
