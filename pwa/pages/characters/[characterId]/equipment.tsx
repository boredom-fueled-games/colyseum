import CharacterDetails from 'components/Characters/CharacterDetails';
import CharacterTabs from 'components/Characters/CharacterTabs';
import CombatOverview from 'components/Combat/CombatOverview';
import Layout from 'components/Layout';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useCharacters } from 'hooks/characters';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();
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
