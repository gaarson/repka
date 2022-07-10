# Repka
кайнда стейт мнджр

```tsx
import { repka } from 'repka';

const Repo = repka<
  { field: string, anotherField?: string }, 
  { doSmth: () => void }
>(
  { field: '' },
  {
    doSmth() {
      Repo.field = (Repo.field || '') + 'BUBA|';
    }
  }
);

const doSmth = () => {
  Repo.field = '';
};

const RepositoryTestComponent = () => {
  const [
    data, // { field: string, anotherField?: string }
    methods // { doSmth: () => void }
  ] = Repo();

  const doAnother = () => {
    Repo.anotherField = 'NEW VALUE';
  };

  return (
    <div>
      <button value={'field'} onClick={methods.doSmth} />
      <button value={'anotherField'} onClick={doAnother} />
      <p>{data.field}</p>
      <p>{data.anotherField}</p>
    </div>
  );
};
```
