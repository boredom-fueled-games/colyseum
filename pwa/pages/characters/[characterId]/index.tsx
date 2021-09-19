import CharacterDetails from 'components/Characters/CharacterDetails';
import PrimaryCharacterStats from 'components/Characters/PrimaryCharacterStats';
import SecondaryCharacterStats from 'components/Characters/SecondaryCharacterStats';
import Layout from 'components/Layout';
import { getServerSideAuth } from 'utils/sessionAuth';

const Character = (): JSX.Element => (
  <Layout title="Character">
    <CharacterDetails />
    <PrimaryCharacterStats/>
    <SecondaryCharacterStats/>
  </Layout>
);

export default Character;

export const getServerSideProps = getServerSideAuth();
