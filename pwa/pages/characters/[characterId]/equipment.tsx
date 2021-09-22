import ItemOverview from 'components/Items/ItemOverview';
import Layout from 'components/Layout';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import Item from 'types/Item';
import { ItemTypes } from 'types/ItemType';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  const {activeCharacter, equippedItems} = useActiveCharacter();

  const sortedEquippedItems: Item[] = ItemTypes.map((itemType): Item => {
    const matchingItems = equippedItems.filter((equippedItem) => equippedItem.type === itemType);
    if (matchingItems.length > 0) {
      return {
        ...matchingItems[0],
        equipped: true
      };
    }

    return {type: itemType, identifier: 'Empty'} as Item;
  });

  return (
    <Layout title="Equipment">
      {activeCharacter ? <ItemOverview
        items={sortedEquippedItems}
        itemActions={['unequip', 'equip', 'sell']}
        disableFilter
        disablePagination
        showItemType
      /> : null}
    </Layout>
  );
};

export default Equipment;

export const getServerSideProps = getServerSideAuth();
