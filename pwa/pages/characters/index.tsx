import CharacterCreation from 'components/CharacterCreation';
import CharacterOverview from 'components/CharacterOverview';
import Layout from 'components/Layout';

const CharactersIndex = (): JSX.Element => (
  <Layout title="Characters">
    <CharacterCreation/>
    <CharacterOverview/>
  </Layout>
);

export default CharactersIndex;
