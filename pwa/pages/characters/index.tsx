import CharacterCreation from 'components/CharacterCreation';
import CharacterOverview from 'components/CharacterOverview';
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
