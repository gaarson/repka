import { repositoryCreator, IRepositoryService } from './repository';
import { watcherCreator } from './watcher';

export function createRepository(provider): IRepositoryService {
  return repositoryCreator(watcherCreator, provider);
}
