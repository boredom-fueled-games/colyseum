import axios from 'adapters/axios';
import { useAuth } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Character } from 'types/Character';

const CharacterCreation = (): JSX.Element => {
  const {user, characters} = useAuth();
  const [identifier, setIdentifier] = useState<string>('');
  const Router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    const newCharacter = await axios.post<Character>('/api/proxy/characters', {identifier, user: user['@id']});
    setIdentifier('');
    Router.push(newCharacter['@id']);
  };

  return (
    characters && characters['hydra:member'].length < 3 ?
      <form onSubmit={onSubmit}>
        <label>
          Create new character:
          <input type="text" value={identifier} onChange={(event) => setIdentifier(event.target.value)}/>
          <input type="submit"/>
        </label>
      </form>
      : null
  );
};

export default CharacterCreation;
