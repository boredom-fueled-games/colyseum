import CharacterDetails from 'components/CharacterDetails';
import CharacterTabs from 'components/CharacterTabs';
import ItemOverview from 'components/ItemOverview';
import Layout from 'components/Layout';
import { useAuth } from 'context/AuthContext';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  const {activeCharacter} = useAuth();

  return (
    <Layout title="Shop" headerContent={<CharacterDetails character={activeCharacter}/>}>
      <CharacterTabs character={activeCharacter}/>
      <ItemOverview />
    </Layout>
  );
};

export default Equipment;

export const getServerSideProps = getServerSideAuth();
