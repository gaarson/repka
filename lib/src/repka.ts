import { repositoryCreator } from './repository';
import { watcherCreator } from './watcher';
import { reactProvider } from './react-provider';

export const repka = repositoryCreator(watcherCreator, reactProvider);
