import CharacterMenu from 'components/Characters/CharacterMenu';
import ItemOverview from 'components/Items/ItemOverview';
import Layout from 'components/Layout';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  return (
    <Layout title="Shop">
      <CharacterMenu/>
      <ItemOverview/>
    </Layout>
  );
};

export default Equipment;

export const getServerSideProps = getServerSideAuth();
