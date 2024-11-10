import { 
  IRepositoryService, 
  RepositoryService, 
  repositoryCreator,  
  initRepository, 
  initializeState,  
} from './repository';

export const createRepository = <T>(provider: T) => {
  const repka: IRepositoryService = new RepositoryService() as IRepositoryService;

  repka.initRepository = initRepository;
  repka.initializeState = initializeState;
  repka.actions = initRepository<unknown, unknown, T>({}, { provider });
  repka.__call = repositoryCreator;

  return repka
}
