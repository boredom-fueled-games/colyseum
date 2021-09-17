import CharacterDetails from 'components/Characters/CharacterDetails';
import CharacterTabs from 'components/Characters/CharacterTabs';
import CombatOverview from 'components/Combat/CombatOverview';
import Layout from 'components/Layout';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useCharacter, useCharacters } from 'hooks/characters';
import { useRouter } from 'next/router';
import { getServerSideAuth } from 'utils/sessionAuth';

const Training = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();
  const {characters, loading} = useCharacters({training: true});
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
