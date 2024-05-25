import { Separator, input, password, select } from "@inquirer/prompts";
import { exit } from "process";
import { ls } from "./logstream";

export async function ask(
  question: string,
  defaultChoice?: string,
  validate?: (value: string) => boolean | string | Promise<string | boolean>,
) {
  return input({
    message: question,
    validate,
    default: defaultChoice,
  }, { output: process.stderr })
}

export async function askForSecret(
  question: string,
  defaultChoice?: string,
  validate?: (value: string) => boolean | string | Promise<string | boolean>,
) {
  return password({
    message: question,
    mask: '*',
    validate,
  }, { output: process.stderr })
}

type SelectChoice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
  type?: never;
};

export async function choose<T>(question: string, choices: readonly (Separator | SelectChoice<T>)[]): Promise<T> {
  try {
    return await select({
      message: question,
      pageSize: 15,
      loop: true,
      choices: choices,
    }, { output: process.stderr });
  } catch (error) {
    ls.fatal('Cancelled');
  }

  exit(1);
}
