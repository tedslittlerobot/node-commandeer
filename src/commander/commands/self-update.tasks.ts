import {stderr} from 'node:process';
import {createWriteStream} from 'node:fs';
import {finished} from 'node:stream/promises';
import {Readable} from 'node:stream';
import {unlink} from 'node:fs/promises';
import chalk from 'chalk';
import {$} from 'execa';
import {type TaskList} from 'src/listr/types.js';
import gloucester from 'gloucester';

type Context = {
	response: Response;
};

type SelfUpdateConfig = {
	name: string;
	tarball: string;
	release: string;
	baseUrl: string;
	credentials: Record<string, string>;
};

export default function selfUpdateTasks(config: SelfUpdateConfig): TaskList<Context> {
	return [
		{
			title: `Downloading Release [${config.release}]`,
			async task(context, task) {
				const uri = `${config.baseUrl}/${config.name}/${config.name}-${config.release}.tgz`;

				if (gloucester.is.gte('verbose')) {
					stderr.write(chalk.yellow(`Downloading ${chalk.cyan(uri)}\n`));
				}

				context.response = await fetch(
					uri,
					{headers: config.credentials},
				);

				if (gloucester.is.gte('verbose')) {
					stderr.write(chalk.yellow(`Status: ${chalk.magenta(`${context.response.status} ${context.response.statusText}`)}\n`));
				}

				if (context.response.status !== 200) {
					throw new Error(`Download Failed: \n\n${chalk.yellow(await context.response.text())}`);
				}
			},
		},
		{
			title: 'Storing Release',
			async task(context) {
				const stream = createWriteStream(config.tarball);
				await finished(Readable.fromWeb(context.response.body!).pipe(stream));

				if (gloucester.is.gte('superVerbose')) {
					stderr.write(chalk.yellow(`Temporarily stored release at: ${chalk.cyan(config.tarball)}\n`));
				}
			},
		},
		{
			title: 'Installing',
			async task(context) {
				if (gloucester.is.gte('superVerbose')) {
					stderr.write(chalk.blueBright(`npm install -g ${config.tarball}\n`));
				}

				await $({
					stdio: gloucester.is.gte('verbose') ? 'inherit' : 'pipe',
				})`npm install -g ${config.tarball}`;
			},
		},
		{
			title: 'Cleaning up installation files',
			async task(context) {
				await unlink(config.tarball);
			},
		},
		{
			title: 'Installing Dependencies',
			skip() {
				return false;
			},
			async task(context) {
				await $({
					stdio: gloucester.is.gte('verbose') ? 'inherit' : 'pipe',
				})`${config.name} install`;
			},
		},
	];
}
