import CharacterDetails from 'components/CharacterDetails';
import CharacterTabs from 'components/CharacterTabs';
import CombatOverview from 'components/CombatOverview';
import Layout from 'components/Layout';
import { useAuth } from 'context/AuthContext';
import { useCharacter, useCharacters } from 'hooks/characters';
import { useRouter } from 'next/router';
import { getServerSideAuth } from 'utils/sessionAuth';

const Training = (): JSX.Element => {
  const {activeCharacter} = useAuth();
  const {characters, loading} = useCharacters(true);
  const router = useRouter();
  const {characterId} = router.query;
  const {character} = useCharacter(characterId ? `/characters/${characterId}` : null);

  return (
    <Layout title="Character" headerContent={<CharacterDetails character={character}/>}>
      <CharacterTabs character={character}/>
      <CombatOverview activeCharacter={activeCharacter} validTargets={!characters ? [] : characters['hydra:member']}
                      loading={loading} training/>
    </Layout>
  );
};

export default Training;

export const getServerSideProps = getServerSideAuth();
