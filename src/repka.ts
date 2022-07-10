import { RepositoryService } from './repository';
import { watcherCreator } from './watcher';
import { reactProvider } from './react-provider';

export const repka = new RepositoryService(watcherCreator, reactProvider);
