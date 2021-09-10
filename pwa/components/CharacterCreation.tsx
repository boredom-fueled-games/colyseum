import { useAuth } from 'context/AuthContext';
import { useCharacters } from 'hooks/characters';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CharacterCreation = (): JSX.Element => {
  const {create} = useCharacters();
  const {user} = useAuth();
  const [identifier, setIdentifier] = useState<string>('');
  const Router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    const newCharacter = await create({identifier, user: user['@id']});
    setIdentifier('');
    Router.push(newCharacter['@id']);
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

export default CharacterCreation;
