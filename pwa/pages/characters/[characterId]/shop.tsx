import CharacterDetails from 'components/Characters/CharacterDetails';
import CharacterTabs from 'components/Characters/CharacterTabs';
import ItemOverview from 'components/Items/ItemOverview';
import Layout from 'components/Layout';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();

  return (
    <Layout title="Shop" headerContent={<CharacterDetails character={activeCharacter}/>}>
      <CharacterTabs character={activeCharacter}/>
      <ItemOverview />
    </Layout>
  );
};

export default Equipment;

export const getServerSideProps = getServerSideAuth();
