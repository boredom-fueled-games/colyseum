import { Button, Card, Descriptions, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import Item from 'types/Item';

type ItemDetailsProp = {
  item: Item,
  comparedItem?: Item,
  equipped?: boolean,
  showItem?: (item: Item) => void
};

const ItemDetails = ({item, equipped = false, showItem}: ItemDetailsProp): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();

  return (
    <Card>
      <Descriptions
        title={item.identifier.charAt(0).toUpperCase() + item.identifier.slice(1)
          // item.identifier
          // <Title level={4}>{item.identifier.charAt(0).toUpperCase() + item.identifier.slice(1)}</Title>
        }
        column={1}
        extra={
          showItem ? <Button
            icon={<QuestionCircleOutlined style={{fontSize: 22}}/>}
            type={'text'}
            shape="circle"
            onClick={() => showItem(item)}
          /> : null
        }
      >
        <Descriptions.Item>
          {item.requiredStrength !== 0 ?
            <Tag
              color={activeCharacter && activeCharacter.strength ? activeCharacter.strength >= item.requiredStrength ? 'green' : 'red' : 'black'}>
              Str: {item.requiredStrength}</Tag>
            : null}
          {item.requiredDexterity !== 0 ?
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
        <Descriptions.Item label="Price">{item.price}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ItemDetails;
