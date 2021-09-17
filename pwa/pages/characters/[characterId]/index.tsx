import CharacterDetails from 'components/Characters/CharacterDetails';
import PrimaryCharacterStats from 'components/Characters/PrimaryCharacterStats';
import CharacterTabs from 'components/Characters/CharacterTabs';
import SecondaryCharacterStats from 'components/Characters/SecondaryCharacterStats';
import Layout from 'components/Layout';
import { useCharacter } from 'hooks/characters';
import { useRouter } from 'next/router';
import { getServerSideAuth } from 'utils/sessionAuth';

const Character = (): JSX.Element => {
  const router = useRouter();
  const {characterId} = router.query;
  const {character} = useCharacter(characterId ? `/characters/${characterId}` : null);

  return (
    <Layout title="Character" headerContent={<CharacterDetails character={character}/>}>
      <CharacterTabs character={character}/>
      <PrimaryCharacterStats/>
      <SecondaryCharacterStats/>
    </Layout>
  );
};

export default Character;

export const getServerSideProps = getServerSideAuth();
