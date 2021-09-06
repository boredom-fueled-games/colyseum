import CharacterDetails from 'components/CharacterDetails';
import { useCharacter } from 'hooks/characters';
import { useRouter } from 'next/router';

const Character = (): JSX.Element => {
  const router = useRouter();
  const {id} = router.query;
  const {character, loading} = useCharacter(`/characters/${id}`);

  return loading ? (<div>Loading...</div>) : <CharacterDetails character={character}/>;
};

export default Character;
