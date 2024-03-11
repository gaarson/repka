import { 
  IRepositoryService, 
  RepositoryService, 
  repositoryCreator,  
  initRepository, 
  initializeState,  
} from './repository';

import { reactProvider } from 'react-provider';
const repka: IRepositoryService = new RepositoryService() as IRepositoryService;

repka.initRepository = initRepository;
repka.initializeState = initializeState;
repka.actions = initRepository({}, { provider: reactProvider });
repka.__call = repositoryCreator;

export { repka, IRepositoryService };
