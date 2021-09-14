import CharacterDetails from 'components/CharacterDetails';
import CharacterTabs from 'components/CharacterTabs';
import CombatOverview from 'components/CombatOverview';
import Layout from 'components/Layout';
import { useAuth } from 'context/AuthContext';
import { useCharacters } from 'hooks/characters';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  const {activeCharacter} = useAuth();
  const {characters, loading} = useCharacters();

  return (
    <Layout title="Equipment" headerContent={<CharacterDetails character={activeCharacter}/>}>
      <CharacterTabs character={activeCharacter}/>
      <CombatOverview
        activeCharacter={activeCharacter}
        validTargets={!characters ? [] : characters['hydra:member']}
        loading={loading}
      />
    </Layout>
  );
};

export default Equipment;

export const getServerSideProps = getServerSideAuth();
