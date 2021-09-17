import CharacterCreation from 'components/Characters/CharacterCreation';
import CharacterOverview from 'components/Characters/CharacterOverview';
import Layout from 'components/Layout';
import { getServerSideAuth } from 'utils/sessionAuth';

const CharactersIndex = (): JSX.Element => (
  <Layout title="Characters">
    <CharacterCreation/>
    <CharacterOverview/>
  </Layout>
);

export default CharactersIndex;

export const getServerSideProps = getServerSideAuth();
