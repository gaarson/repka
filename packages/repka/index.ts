import { 
  IRepositoryService, 
  RepositoryService, 
  repositoryCreator,  
  initRepository, 
  initializeState,  
} from './repository';
import { reactProvider, reactProviderType } from 'react-provider';

const repka: IRepositoryService = new RepositoryService() as IRepositoryService;

repka.initRepository = initRepository;
repka.initializeState = initializeState;
repka.actions = initRepository<
  {}, 
  any, 
  () => void //reactProviderType<{}, any>
>({}, { provider: reactProvider });
repka.__call = repositoryCreator;

export { repka, IRepositoryService };
