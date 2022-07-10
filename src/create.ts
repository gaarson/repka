import { RepositoryService } from './repository';
import { watcherCreator } from './watcher';

export const createRepository = (provider) => new RepositoryService(watcherCreator, provider);
