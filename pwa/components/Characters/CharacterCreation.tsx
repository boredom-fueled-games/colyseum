import axios from 'adapters/axios';
import { useAuth } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Character } from 'types/Character';

const CharacterCreation = (): JSX.Element | null => {
  const {user, characters} = useAuth();
  const [identifier, setIdentifier] = useState<string>('');
  const Router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    const {data: newCharacter} = await axios.post<Character>('/api/proxy/characters', {identifier, user: user['@id']});
    setIdentifier('');

    if (!newCharacter['@id']) {
      return;
    }
    Router.push(newCharacter['@id']);
  };

  return (
    characters && characters['hydra:member'] && characters['hydra:member'].length < 3 ?
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
