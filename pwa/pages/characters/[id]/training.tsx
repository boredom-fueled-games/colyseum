import CharacterDetails from 'components/CharacterDetails';
import CharacterTabs from 'components/CharacterTabs';
import CombatOverview from 'components/CombatOverview';
import Layout from 'components/Layout';
import { useAuth } from 'context/AuthContext';
import { useCharacter, useCharacters } from 'hooks/characters';
import { useRouter } from 'next/router';

const Training = (): JSX.Element => {
  const {activeCharacter} = useAuth();
  const {characters, loading} = useCharacters(true);
  const router = useRouter();
  const {id} = router.query;
  const {character} = useCharacter(id ? `/characters/${id}` : null);

  return (
    <Layout title="Character" headerContent={<CharacterDetails character={character}/>}>
      <CharacterTabs character={character}/>
      <CombatOverview activeCharacter={activeCharacter} validTargets={!characters ? [] : characters['hydra:member']}
                      loading={loading} training/>
    </Layout>
  );
};

export default Training;
