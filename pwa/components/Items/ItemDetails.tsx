import axiosInstance from 'adapters/axios';
import { Button, Card, Descriptions, message, Tag } from 'antd';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useAuth } from 'context/AuthContext';
import Item from 'types/Item';
import capitalize from 'utils/capitalize';

type ItemDetailsProp = {
  item: Item,
  comparedItem?: Item,
  equipped?: boolean,
  showItemType?: boolean,
  showItem?: (item: Item) => void
  itemActions?: ItemActionType[]
};

export type ItemActionType = 'sell' | 'buy' | 'unequip' | 'equip';

const ItemDetails = ({
                       item,
                       showItem,
                       itemActions = [],
                       showItemType = false,
                     }: ItemDetailsProp): JSX.Element => {
  const {mutateOwnedItems} = useAuth();
  const {activeCharacter} = useActiveCharacter();

  const itemActionFunctions: { [key in ItemActionType]: (item: Item) => void } = {
    sell: async (item) => {
      await axiosInstance.delete(`/api/proxy${item['@id']}`);
      await mutateOwnedItems();
      message['success'](`Sold ${capitalize(item.identifier)}`);
    },
    buy: (item) => console.log('buy', item),
    unequip: async (item) => {
      await axiosInstance.patch(`/api/proxy${item['@id']}`, {character: null});
      await mutateOwnedItems();
      message['success'](`Unequipped ${capitalize(item.identifier)}`);
    },
    equip: async (item) => {
      if (!activeCharacter) {
        return;
      }

      const {status} = await axiosInstance.patch(`/api/proxy${item['@id']}`, {character: activeCharacter['@id']});
      if (status >= 400) {
        return;
      }

      await mutateOwnedItems();
      message['success'](`Equipped ${capitalize(item.identifier)}`);
    }
  };
  const actionElements = itemActions
    .filter((itemActionType) =>
      (itemActionType === 'unequip' && item.equipped)
      || (itemActionType === 'equip' && !item.equipped && activeCharacter)
      || (itemActionType === 'sell' && !item.equipped)
      || (itemActionType === 'buy' && item.equipped)
    )
    .map((itemActionType) => (
      <Button
        disabled={!item['@id']}
        style={{width: '100%'}}
        type="link"
        key={itemActionType}
        onClick={() => itemActionFunctions[itemActionType](item)}
      >{capitalize(itemActionType)}</Button>
    ));

  return (
    <Card className="item-details" actions={actionElements} title={showItemType ? capitalize(item.type) : null}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      {item['@id'] ? <Card.Grid onClick={() => showItem ? showItem(item) : null}
                                style={{width: '100%', cursor: 'pointer'}}
                                hoverable={true}>
        <Descriptions title={capitalize(item.identifier)} column={1}>
          <Descriptions.Item>
            {item.requiredStrength > 0 ?
              <Tag
                color={activeCharacter && activeCharacter.strength ? activeCharacter.strength >= item.requiredStrength ? 'green' : 'red' : 'black'}>
                Str: {item.requiredStrength}</Tag>
              : null}
            {item.requiredDexterity > 0 ?
              <Tag
                color={activeCharacter && activeCharacter.dexterity ? activeCharacter.dexterity >= item.requiredDexterity ? 'green' : 'red' : 'black'}>
                Dex: {item.requiredDexterity}</Tag>
              : null}
          </Descriptions.Item>
          {item.minimalDamage && item.maximalDamage ? (
            <Descriptions.Item label="Damage">{item.minimalDamage} - {item.maximalDamage}</Descriptions.Item>
          ) : null}
          {item.defense ? (
            <Descriptions.Item label="Defense">{item.defense}</Descriptions.Item>
          ) : null}
          {item.blockChance ? (
            <Descriptions.Item label="Block">{item.blockChance}%</Descriptions.Item>
          ) : null}
          {item.price ? (
            <Descriptions.Item label="Price">{item.price}</Descriptions.Item>
          ) : null}
        </Descriptions>
      </Card.Grid> : <Descriptions title={capitalize(item.identifier)}/>}
    </Card>
  );
};

export default ItemDetails;
