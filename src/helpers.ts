export function checkArgsForArgs(args: string[], targets: string[]): boolean {
  for (let index = 0; index < targets.length; index++) {
    const target = targets[index];

    if (~args.indexOf(target)) {
      return true;
    }
  }

  return false;
}
