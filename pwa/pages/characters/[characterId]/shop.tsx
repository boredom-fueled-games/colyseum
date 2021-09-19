import ItemOverview from 'components/Items/ItemOverview';
import Layout from 'components/Layout';
import { useItems } from 'hooks/items';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  const {items} = useItems();
  return (
    <Layout title="Shop">
      <ItemOverview items={items && items['hydra:member'] ? items['hydra:member'] : []}/>
    </Layout>
  );
};

export default Equipment;

export const getServerSideProps = getServerSideAuth();
