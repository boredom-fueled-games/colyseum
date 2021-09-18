import ItemOverview from 'components/Items/ItemOverview';
import Layout from 'components/Layout';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => (
  <Layout title="Shop">
    <ItemOverview/>
  </Layout>
);

export default Equipment;

export const getServerSideProps = getServerSideAuth();
