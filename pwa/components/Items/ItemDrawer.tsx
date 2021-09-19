import axios from 'adapters/axios';
import { Drawer, notification } from 'antd';
import ExpandedItemDetails from 'components/Items/ExpandedItemDetails';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useAuth } from 'context/AuthContext';
import Item from 'types/Item';
import OwnedItem from 'types/OwnedItem';

type ItemDrawerProps = {
  item: Item
  onClose: () => void
};

const ItemDrawer = ({item, onClose}: ItemDrawerProps): JSX.Element | null => {
  const {user, mutateOwnedItems} = useAuth();
  const {activeCharacter} = useActiveCharacter();
  if (!activeCharacter) {
    return null;
  }

  const handlePurchase = async (item: Item, autoEquip?: boolean): Promise<void> => {
    if (!user) {
      return;
    }

    const {status} = await axios.post<OwnedItem>('/api/proxy/owned_items', {
      item: item['@id'],
      user: user['@id'],
      character: autoEquip && activeCharacter ? activeCharacter['@id'] : null
    });

    if (status < 400) {
      notification['success']({
        message: 'Purchase successful!'
      });
      onClose();

      await mutateOwnedItems();
    }
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      visible
      width={Math.min(736, window.innerWidth)}
      closeIcon={false}
    >
      <ExpandedItemDetails item={item} handlePurchase={handlePurchase}/>
    </Drawer>
  );
};

export default ItemDrawer;
