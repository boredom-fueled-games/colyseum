import { useAuth } from 'context/AuthContext';
import { useCharacters } from 'hooks/characters';
import { useState } from 'react';
import Link from 'next/link';

const CharacterList = (): JSX.Element => {
  const {loading, characters, create, preload} = useCharacters();
  const {user} = useAuth();
  const [identifier, setIdentifier] = useState<string>('');

  const onSubmit = async (event) => {
    event.preventDefault();
    await create({identifier, user: user['@id']});
    setIdentifier('');
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          Create new character:
          <input type="text" value={identifier} onChange={(event) => setIdentifier(event.target.value)}/>
          <input type="submit"/>
        </label>
      </form>
      {loading
        ? (<div>Loading characters...</div>)
        : (<ul>
          {characters['hydra:member'].map((character) => <li key={character['@id']}>
            <Link href={character['@id']} passHref={true}>
              <span onMouseOver={() => preload(character['@id'])}>
                {character.identifier}
              </span>
            </Link>
          </li>)}
        </ul>)}
    </>
  );
};

export default CharacterList;
