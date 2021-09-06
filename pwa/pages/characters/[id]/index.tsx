import { setAuthorization } from 'adapters/axios';
import CharacterDetails from 'components/CharacterDetails';
import { useCharacter } from 'hooks/characters';
import { useRouter } from 'next/router';
import { getServerSideAuth } from 'utils/sessionAuth';

const Character = ({accessToken}) => {
  setAuthorization(accessToken);
  const router = useRouter();
  const {id} = router.query;
  const {character, loading} = useCharacter(`/characters/${id}`);

  return loading ? (<div>Loading...</div>) : <CharacterDetails character={character}/>;
};

export default Character;

export const getServerSideProps = getServerSideAuth(
  {}
);
