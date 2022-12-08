import { repositoryCreator } from './repository';
import { watcherCreator } from './watcher';

export const createRepository = (provider) => repositoryCreator(watcherCreator, provider);
