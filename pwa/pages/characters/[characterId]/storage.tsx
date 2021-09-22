import ItemOverview from 'components/Items/ItemOverview';
import Layout from 'components/Layout';
import { useOwnedItems } from 'hooks/OwnedItems';
import Item from 'types/Item';
import { getServerSideAuth } from 'utils/sessionAuth';

const Storage = (): JSX.Element => {
  const {ownedItems} = useOwnedItems();

  const storedItems: Item[] = ownedItems && ownedItems['hydra:member']
    ? ownedItems['hydra:member'].filter((ownedItem) => !ownedItem.character)
      .map((ownedItem): Item => ({
    ...ownedItem.item,
    '@id': ownedItem['@id']
  })) : [];

  return (
    <Layout title="Storage">
      <ItemOverview items={storedItems} itemActions={['sell','equip','unequip']}/>
    </Layout>
  );
};

export default Storage;

export const getServerSideProps = getServerSideAuth();
