import type {ListrTask} from 'listr2';

export type TaskList<Context> = Array<ListrTask<Context> | undefined>;
export type AsyncTaskList<Context> = Promise<TaskList<Context>>;
