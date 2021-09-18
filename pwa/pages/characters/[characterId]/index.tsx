import CharacterMenu from 'components/Characters/CharacterMenu';
import PrimaryCharacterStats from 'components/Characters/PrimaryCharacterStats';
import SecondaryCharacterStats from 'components/Characters/SecondaryCharacterStats';
import Layout from 'components/Layout';
import { getServerSideAuth } from 'utils/sessionAuth';

const Character = (): JSX.Element => (
  <Layout title="Character">
    <CharacterMenu/>
    <PrimaryCharacterStats/>
    <SecondaryCharacterStats/>
  </Layout>
);

export default Character;

export const getServerSideProps = getServerSideAuth();
