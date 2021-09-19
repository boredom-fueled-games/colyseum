import { Button, Card, Divider, Space, Tooltip, Typography } from 'antd';
import StatsDisplay from 'components/Characters/StatsDisplay';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useAuth } from 'context/AuthContext';
import Item from 'types/Item';
import capitalize from 'utils/capitalize';

const {Title} = Typography;

type ExpandedItemDetailsProp = {
  item: Item,
  comparedItem?: Item,
  equipped?: boolean,
  showItem?: (item: Item) => void,
  handlePurchase?: (item: Item, autoEquip?: boolean) => Promise<void>
};

const ExpandedItemDetails = ({item, handlePurchase}: ExpandedItemDetailsProp): JSX.Element | null => {
  const {user} = useAuth();
  const {activeCharacter, equippedItems} = useActiveCharacter();
  if (!activeCharacter) {
    return null;
  }

  const canPurchase = user && user.currency >= item.price;
  const hasFreeSlot = equippedItems.filter((equippedItem) => equippedItem.type === item.type).length === 0;
  const hasStrength = activeCharacter.strength > item.requiredStrength;
  const hasDexterity = activeCharacter.dexterity > item.requiredDexterity;
  const canEquip = canPurchase && hasFreeSlot && hasStrength && hasDexterity;

  return (
    <Card actions={handlePurchase ? [
      <Tooltip
        title={canEquip ? null : canPurchase ? 'Character can\'t equip this item' : 'You don\'t have enough currency'}
        color="red" key="equip">
        <Button disabled={!canEquip} style={{width: '100%'}}
                type="link"
                onClick={() => handlePurchase(item, true)}>Buy and equip</Button>
      </Tooltip>,
      <Tooltip title={canPurchase ? null : 'You don\'t have enough currency'} color="red" key="store">
        <Button style={{width: '100%'}} type="link" disabled={!canPurchase} onClick={() => handlePurchase(item)}> Buy
          and store</Button>
      </Tooltip>
    ] : []}>
      <Space direction="vertical">
        <Title>{capitalize(item.identifier)}</Title>
        {item.requiredStrength || item.requiredDexterity ? (
          <>
            <Divider style={{marginBottom: 0}} orientation="left"><Title level={3}>Requirements</Title></Divider>
            {item.requiredStrength ? <StatsDisplay title="Strength" value={item.requiredStrength}/> : null}
            {item.requiredDexterity ? <StatsDisplay title="Dexterity" value={item.requiredDexterity}/> : null}
          </>
        ) : null}
        <Divider style={{marginBottom: 0}} orientation="left"><Title level={3}>Stats</Title></Divider>
        {item.minimalDamage && item.maximalDamage
          ? <StatsDisplay title="Damage" value={`${item.minimalDamage} - ${item.maximalDamage}`}/>
          : null}
        {item.defense
          ? <StatsDisplay title="Defense" value={item.defense}/>
          : null}
        {item.blockChance
          ? <StatsDisplay title="Block Chance" value={`${item.blockChance}%`}/>
          : null}
        {item.addedStrength
          ? <StatsDisplay title="Strength Modifier" value={item.addedStrength}/>
          : null}
        {item.addedDexterity
          ? <StatsDisplay title="Dexterity Modifier" value={item.addedDexterity}/>
          : null}
        {item.addedConstitution
          ? <StatsDisplay title="Constitution Modifier" value={item.addedConstitution}/>
          : null}
        {item.addedIntelligence
          ? <StatsDisplay title="Intelligence Modifier" value={item.addedIntelligence}/>
          : null}
      </Space>
    </Card>
  );
};

export default ExpandedItemDetails;
