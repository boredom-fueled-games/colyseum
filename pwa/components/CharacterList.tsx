import { useAuth } from 'context/AuthContext';
import { useCharacters } from 'hooks/characters';
import { useState } from 'react';

const CharacterList = (): JSX.Element => {
  const {create} = useCharacters();
  const {user} = useAuth();
  const [identifier, setIdentifier] = useState<string>('');

  const onSubmit = async (event) => {
    event.preventDefault();
    await create({identifier, user: user['@id']});
    setIdentifier('');
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Create new character:
        <input type="text" value={identifier} onChange={(event) => setIdentifier(event.target.value)}/>
        <input type="submit"/>
      </label>
    </form>
  );
};

export default CharacterList;
